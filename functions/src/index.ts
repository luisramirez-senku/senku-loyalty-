/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {v4 as uuidv4} from "uuid";

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
