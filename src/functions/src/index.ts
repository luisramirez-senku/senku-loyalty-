
/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();


// --- PayPal Webhook Handler ---

// Function to get PayPal access token
const getPayPalAccessToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://api.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();
  return data.access_token;
};


export const paypalWebhookHandler = onRequest(async (request, response) => {
  logger.info("PayPal webhook received");

  // 1. Verify the webhook signature
  // In a production environment, you must verify the webhook signature
  // to ensure the request is from PayPal.
  // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
  const accessToken = await getPayPalAccessToken();
  const verificationResponse = await fetch("https://api.sandbox.paypal.com/v1/notifications/verify-webhook-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      "auth_algo": request.headers["paypal-auth-algo"],
      "cert_url": request.headers["paypal-cert-url"],
      "transmission_id": request.headers["paypal-transmission-id"],
      "transmission_sig": request.headers["paypal-transmission-sig"],
      "transmission_time": request.headers["paypal-transmission-time"],
      "webhook_id": process.env.PAYPAL_WEBHOOK_ID,
      "webhook_event": request.body,
    }),
  });

  const verificationData = await verificationResponse.json();
  if (verificationData.verification_status !== "SUCCESS") {
    logger.error("Webhook signature verification failed.", verificationData);
    response.status(403).send("Forbidden");
    return;
  }


  // 2. Process the event
  const event = request.body;
  const eventType = event.event_type;
  const resource = event.resource;

  logger.info(`Processing event type: ${eventType}`);

  try {
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED" || eventType === "PAYMENT.SALE.COMPLETED") {
      const subscriptionId = resource.id || resource.billing_agreement_id;
      if (!subscriptionId) {
        logger.error("No subscription ID found in the webhook payload.");
        response.status(400).send("No subscription ID.");
        return;
      }

      // Find tenant by paypalSubscriptionId
      const tenantsRef = db.collection("tenants");
      const q = tenantsRef.where("paypalSubscriptionId", "==", subscriptionId);
      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        logger.warn(`No tenant found for subscription ID: ${subscriptionId}`);
        // We still send a 200 OK to PayPal so it doesn't retry this webhook.
        response.status(200).send("No tenant found for this subscription.");
        return;
      }

      const tenantDoc = querySnapshot.docs[0];
      await tenantDoc.ref.update({status: "Activo"});
      logger.info(`Tenant ${tenantDoc.id} status updated to Activo.`);
    }

    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const subscriptionId = resource.id;
      // Find tenant by paypalSubscriptionId
      const tenantsRef = db.collection("tenants");
      const q = tenantsRef.where("paypalSubscriptionId", "==", subscriptionId);
      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        logger.warn(`No tenant found for subscription ID to cancel: ${subscriptionId}`);
        response.status(200).send("No tenant found for this subscription.");
        return;
      }

      const tenantDoc = querySnapshot.docs[0];
      await tenantDoc.ref.update({status: "Cancelado"});
      logger.info(`Tenant ${tenantDoc.id} status updated to Cancelado.`);
    }

    response.status(200).send("Webhook processed successfully.");
  } catch (error) {
    logger.error("Error processing webhook:", error);
    response.status(500).send("Internal Server Error");
  }
});
