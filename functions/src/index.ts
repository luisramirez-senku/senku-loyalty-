
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
const ISSUER_ID = "3388000000022986929"; // <<<--- REPLACE WITH YOUR ISSUER ID


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
      programName,
      issuerName,
      logoText,
      backgroundColor,
      foregroundColor,
    } = request.body;

    if (!programName || !issuerName) {
      logger.error("Missing required fields for class creation");
      response.status(400).send("Missing programName or issuerName.");
      return;
    }

    const classId = uuidv4();
    const fullClassId = `${ISSUER_ID}.${classId}`;

    const loyaltyClass = {
      id: fullClassId,
      issuerName: issuerName,
      programName: programName,
      reviewStatus: "under_review",
      hexBackgroundColor: backgroundColor || "#2962FF", // Default color
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
      // Add other required fields for a class
      // See: https://developers.google.com/wallet/reference/rest/v1/loyaltyclass
    };

    try {
      // 4. Make the API call to Google Wallet
      const apiResponse = await authClient.request({
        url: "https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass",
        method: "POST",
        data: loyaltyClass,
      });

      logger.info("Successfully created Loyalty Class:", apiResponse.data);

      // 5. Send the new class ID back to the client
      response.json({walletClassId: classId});
    } catch (error: any) {
      logger.error("Error creating wallet class:", error.response?.data || error.message);
      response.status(500).send("Error creating wallet class.");
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
    // To get credentials for this function, you must:
    //   a. Create a Service Account in your Google Cloud Project (IAM & Admin -> Service Accounts).
    //   b. Go to the Google Pay & Wallet Console (https://pay.google.com/business/console).
    //   c. Go to the "Users" section and invite your new Service Account's email address. This grants the service account permission.
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

    // 3. Get Loyalty Class ID and program details from the program document in Firestore
    let loyaltyClassId;
    let programData;
    try {
        const programRef = admin.firestore().doc(`tenants/${tenantId}/programs/${programId}`);
        const programSnap = await programRef.get();
        if (!programSnap.exists) {
            throw new Error(`Program ${programId} not found for tenant ${tenantId}.`);
        }
        programData = programSnap.data();
        if (!programData?.design?.walletClassId) {
            throw new Error(`walletClassId not found in program ${programId}.`);
        }
        loyaltyClassId = programData.design.walletClassId;
    } catch (error) {
        logger.error("Error fetching program details:", error);
        response.status(500).send("Error fetching program configuration.");
        return;
    }


    // 4. Create the Loyalty Object Payload
    const loyaltyObjectId = `${ISSUER_ID}.${uuidv4()}`;

    const loyaltyObject = {
      id: loyaltyObjectId,
      classId: `${ISSUER_ID}.${loyaltyClassId}`, // Class ID is now dynamic
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

    