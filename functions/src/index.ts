
/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {v4 as uuidv4} from "uuid";
import * as admin from "firebase-admin";
import {GoogleAuth} from "google-auth-library";

admin.initializeApp();
const db = admin.firestore();

// Set global options for functions (e.g., region, memory)
setGlobalOptions({region: "us-central1"});

// This would come from your Google Cloud Service Account credentials in a real backend
// You can find this in the Google Wallet API console after creating an issuer account.
const ISSUER_ID = "3388000000022986929"; // <<<--- YOUR ISSUER ID


export const createWalletClass = onRequest(
  {cors: true},
  async (request, response) => {
    logger.info("createWalletClass function triggered", {body: request.body});

    // 1. Authenticate with Google
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });
    const authClient = await auth.getClient();

    // 2. Validate Input
    const {
      programId, // Using programId to create a unique, predictable class ID
      programName,
      issuerName,
      logoText,
      backgroundColor,
      foregroundColor,
    } = request.body;

    if (!programId || !programName || !issuerName) {
      logger.error("Missing required fields for class creation");
      response.status(400).send("Missing programId, programName, or issuerName.");
      return;
    }

    const classId = `${ISSUER_ID}.${programId}`;

    // 3. Check if the class already exists
    try {
      const classGetResponse = await authClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${classId}`,
        method: "GET",
      });
      logger.info(`Loyalty Class ${classId} already exists.`);
      // If it exists, return the ID
      response.json({walletClassId: programId});
      return;
    } catch (err: any) {
      if (err.response && err.response.status !== 404) {
        // If error is not 404 (Not Found), then something else went wrong.
        logger.error("Error checking for wallet class:", err.response?.data || err.message);
        response.status(500).send(`Error checking wallet class: ${err.response?.data?.error?.message || err.message}`);
        return;
      }
      // If error IS 404, that's good. It means we can create it.
      logger.info(`Loyalty Class ${classId} does not exist. Creating it now.`);
    }

    // 4. If it does not exist, create it
    const loyaltyClass = {
      id: classId,
      issuerName: issuerName,
      programName: programName,
      reviewStatus: "under_review",
      hexBackgroundColor: backgroundColor || "#2962FF",
      hexFontColor: foregroundColor || "#FFFFFF",
      cardTitle: {
        defaultValue: {
          language: "es-US",
          value: logoText || issuerName,
        },
      },
      header: {
        defaultValue: {
          language: "es-US",
          value: programName,
        },
      },
      loyaltyPoints: {
        label: "Puntos",
        balance: {
          string: "0",
        },
      },
      textModulesData: [
        {
          id: "points",
          header: "PUNTOS",
          body: "...",
        },
        {
          id: "tier",
          header: "NIVEL",
          body: "...",
        },
      ],
    };

    try {
      // 5. Make the API call to Google Wallet to insert the new class
      const apiResponse = await authClient.request({
        url: "https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass",
        method: "POST",
        data: loyaltyClass,
      });

      logger.info("Successfully created Loyalty Class:", apiResponse.data);

      // 6. Send the new class ID (the part after the issuer ID) back to the client
      response.json({walletClassId: programId});
    } catch (error: any) {
      logger.error("Error creating wallet class:", error.response?.data || error.message);
      response.status(500).send(`Error creating wallet class: ${error.response?.data?.error?.message || error.message}`);
    }
  }
);


export const generateWalletPass = onRequest(
  {cors: true}, // Enable CORS for client-side requests
  async (request, response) => {
    logger.info("generateWalletPass function triggered", {
      body: request.body,
    });

    // 1. Authenticate with Google
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });
    const authClient = await auth.getClient();

    // 2. Validate Input
    const {
      tenantId,
      programId,
      customerId,
      customerName,
      customerPoints,
      customerTier,
    } = request.body;

    if (!tenantId || !programId || !customerId || !customerName || customerPoints === undefined) {
      logger.error("Missing required fields in request body");
      response.status(400).send("Missing required fields.");
      return;
    }

    // 3. Get Loyalty Class ID from the program document in Firestore
    let programData;
    try {
        const programRef = admin.firestore().doc(`tenants/${tenantId}/programs/${programId}`);
        const programSnap = await programRef.get();
        if (!programSnap.exists) {
            throw new Error(`Program ${programId} not found for tenant ${tenantId}.`);
        }
        programData = programSnap.data();
    } catch (error) {
        logger.error("Error fetching program details:", error);
        response.status(500).send("Error fetching program configuration.");
        return;
    }


    // 4. Create the Loyalty Object Payload
    const loyaltyObjectId = `${ISSUER_ID}.${uuidv4()}`;
    const loyaltyClassId = `${ISSUER_ID}.${programId}`; // The class ID is now predictable

    const loyaltyObject = {
      id: loyaltyObjectId,
      classId: loyaltyClassId,
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
            uri: "https://www.example.com", // <<<--- REPLACE WITH YOUR WEBSITE
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
          value: programData?.design?.logoText || programData?.name || "Tarjeta de Lealtad",
        },
      },
      header: {
        defaultValue: {
          language: "es-US",
          value: programData?.name,
        },
      },
      hexBackgroundColor: programData?.design?.backgroundColor || "#2962FF",
      hexFontColor: programData?.design?.foregroundColor || "#FFFFFF",
    };

    // 5. Create the JWT for the "Save to Wallet" button
    const claims = {
      iss: authClient.email,
      aud: "google",
      typ: "savetowallet",
      origins: [
        "http://localhost:9002", // For local development
        "https://senku-loyalty.web.app", // <<<--- REPLACE WITH YOUR PRODUCTION DOMAIN
      ],
      payload: {
        loyaltyObjects: [loyaltyObject],
      },
    };

    try {
      const token = await authClient.sign(claims);
      logger.info("JWT successfully created.");

      // 6. Send the signed JWT to the client
      response.json({
        saveUrl: `https://pay.google.com/gp/v/save/${token}`,
      });
    } catch (error) {
      logger.error("Error signing JWT:", error);
      response.status(500).send("Error generating wallet pass.");
    }
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
