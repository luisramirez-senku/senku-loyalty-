
/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {firestore} from "firebase-functions/v2";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {Resend} from "resend";
import {WelcomeEmail} from "./emails/welcome-email";

admin.initializeApp();
const db = admin.firestore();

// Set global options for functions (e.g., region, memory)
setGlobalOptions({region: "us-central1"});


// --- Email Functions ---
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = firestore.document("tenants/{tenantId}/customers/{customerId}")
  .onCreate(async (snap, context) => {
    const customerData = snap.data();
    const {tenantId} = context.params;

    try {
      // Get tenant data to personalize the email
      const tenantDoc = await db.collection("tenants").doc(tenantId).get();
      const tenantData = tenantDoc.data();

      if (!tenantData) {
        logger.error(`Tenant ${tenantId} not found.`);
        return;
      }

      const {data, error} = await resend.emails.send({
        from: `Senku Lealtad <no-reply@${process.env.GCLOUD_PROJECT}.web.app>`,
        to: [customerData.email],
        subject: `¡Bienvenido a ${tenantData.name}!`,
        react: WelcomeEmail({
          customerName: customerData.name,
          tenantName: tenantData.name,
          tenantLogo: tenantData.logoUrl,
        }) as React.ReactElement,
      });

      if (error) {
        logger.error(`Error sending welcome email to ${customerData.email}`, error);
        return;
      }

      logger.info(`Welcome email sent successfully to ${customerData.email}`, {emailId: data?.id});
    } catch (error) {
      logger.error("Error in sendWelcomeEmail function execution:", error);
    }
  });


// --- PayPal Webhook Handler ---

// Function to get PayPal access token
const getPayPalAccessToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://api.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {Authorization: `Basic ${auth}`},
  });

  const data = await response.json();
  return data.access_token;
};

interface PaypalWebhookEvent {
  event_type: string;
  resource: {
    id?: string;
    billing_agreement_id?: string;
  };
}

export const paypalWebhookHandler = onRequest(async (request, response) => {
  logger.info("PayPal webhook received");

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

  const event = request.body as PaypalWebhookEvent;
  const {event_type, resource} = event;

  logger.info(`Processing event type: ${event_type}`);

  try {
    if (event_type === "BILLING.SUBSCRIPTION.ACTIVATED" || event_type === "PAYMENT.SALE.COMPLETED") {
      const subscriptionId = resource.id || resource.billing_agreement_id;
      if (!subscriptionId) {
        logger.error("No subscription ID found in webhook payload.");
        response.status(400).send("No subscription ID.");
        return;
      }

      const query = db.collection("tenants").where("paypalSubscriptionId", "==", subscriptionId);
      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        logger.warn(`No tenant found for subscription ID: ${subscriptionId}`);
        response.status(200).send("No tenant found for this subscription.");
        return;
      }

      await querySnapshot.docs[0].ref.update({status: "Activo"});
      logger.info(`Tenant ${querySnapshot.docs[0].id} status updated to Activo.`);
    }

    if (event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
      const subscriptionId = resource.id;
      const query = db.collection("tenants").where("paypalSubscriptionId", "==", subscriptionId);
      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        logger.warn(`No tenant found for subscription ID to cancel: ${subscriptionId}`);
        response.status(200).send("No tenant found for this subscription.");
        return;
      }

      await querySnapshot.docs[0].ref.update({status: "Cancelado"});
      logger.info(`Tenant ${querySnapshot.docs[0].id} status updated to Cancelado.`);
    }

    response.status(200).send("Webhook processed successfully.");
  } catch (error) {
    logger.error("Error processing webhook:", error);
    response.status(500).send("Internal Server Error");
  }
});
