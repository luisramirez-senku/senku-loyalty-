/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {v4 as uuidv4} from "uuid";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Set global options for functions (e.g., region, memory)
setGlobalOptions({region: "us-central1"});

// This would come from your Google Cloud Service Account credentials in a real backend
const ISSUER_ID = "3388000000022316666";
// This should be a class you have pre-created via the Google Wallet API
const LOYALTY_CLASS_ID = "LOYALTY_CLASS_ID_PLACEHOLDER";


export const generateWalletPass = onRequest(
  {cors: true}, // Enable CORS for client-side requests
  (request, response) => {
    logger.info("generateWalletPass function triggered", {
      body: request.body,
    });

    // In a real implementation, you would validate this input
    const {
      customerId,
      customerName,
      customerPoints,
      customerTier,
      programName,
      logoText,
      backgroundColor,
      foregroundColor,
    } = request.body;

    if (!customerId || !customerName || customerPoints === undefined) {
      logger.error("Missing required fields in request body");
      response.status(400).send("Missing required fields.");
      return;
    }

    // In a real implementation, you would:
    // 1. Use the Google Wallet REST API client library.
    // 2. Create a new LoyaltyObject payload.
    // 3. Sign that payload into a JWT using your service account credentials.
    // Here, we continue to simulate this process for demonstration.

    const loyaltyObjectId = `${ISSUER_ID}.${uuidv4()}`;

    const loyaltyObject = {
      id: loyaltyObjectId,
      classId: LOYALTY_CLASS_ID,
      state: "active",
      heroImage: {
        sourceUri: {
          uri: "https://placehold.co/1032x336.png",
          description: "Banner",
        },
        contentDescription: {
          defaultValue: {
            language: "es-US",
            value: "Banner del programa de lealtad",
          },
        },
      },
      textModulesData: [
        {
          id: "points",
          header: "PUNTOS",
          body: customerPoints.toString(),
        },
        {
          id: "tier",
          header: "NIVEL",
          body: customerTier,
        },
      ],
      linksModuleData: {
        uris: [
          {
            uri: "https://www.example.com",
            description: "Sitio web del programa",
            id: "program_website",
          },
        ],
      },
      imageModulesData: [],
      barcode: {
        type: "QR_CODE",
        value: customerId,
        alternateText: customerName,
      },
      accountId: customerId,
      accountName: customerName,
      loyaltyPoints: {
        balance: {
          string: customerPoints.toString(),
        },
        label: "Puntos",
      },
      cardTitle: {
        defaultValue: {
          language: "es-US",
          value: logoText,
        },
      },
      header: {
        defaultValue: {
          language: "es-US",
          value: programName,
        },
      },
      hexBackgroundColor: backgroundColor,
      hexFontColor: foregroundColor,
    };

    // In a real implementation, this would be a securely signed JWT
    const simulatedJwt = `SIMULATED_JWT_PLACEHOLDER.${Buffer.from(JSON.stringify({
      iss: "your-service-account@your-project.iam.gserviceaccount.com",
      aud: "google",
      typ: "savetowallet",
      origins: ["https://your-app-domain.com"], // IMPORTANT: Update with your domain
      payload: {
        loyaltyObjects: [loyaltyObject],
      },
    })).toString("base64")}.SIMULATED_SIGNATURE`;

    response.json({
      saveUrl: `https://pay.google.com/gp/v/save/${simulatedJwt}`,
    });
  }
);


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

  if (verificationResponse.status !== 200) {
    logger.error("Webhook signature verification failed.");
    response.status(403).send("Forbidden");
    return;
  }
  const verificationData = await verificationResponse.json();
  if (verificationData.verification_status !== "SUCCESS") {
    logger.error("Webhook signature verification status not SUCCESS.");
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
