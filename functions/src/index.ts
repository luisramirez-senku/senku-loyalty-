
import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// Set global options for functions
setGlobalOptions({region: "us-central1"});


/**
 * Sets up a new tenant environment when a user is created.
 * This function is triggered by Firebase Auth on user creation.
 */
export const setupNewUser = functions.auth.user().onCreate(async (user) => {
  const {uid, email} = user;

  if (!email) {
    logger.warn(`User ${uid} created without an email. Skipping setup.`);
    return;
  }

  logger.info(`New user created: ${email} (${uid}). Starting setup process.`);

  // 1. Get additional signup data from the 'pendingTenants' collection
  const pendingDocRef = db.collection("pendingTenants").doc(uid);
  const pendingDoc = await pendingDocRef.get();

  if (!pendingDoc.exists) {
    logger.error(`Pending tenant data not found for user ${uid}.`);
    // Critical error: delete the user to prevent an orphaned account
    await auth.deleteUser(uid);
    logger.info(`Deleted orphaned user ${uid}.`);
    return;
  }

  const signupData = pendingDoc.data();
  const businessName = signupData?.businessName || "Mi Negocio";

  try {
    // 2. Run all database creations in a single atomic transaction
    await db.runTransaction(async (transaction) => {
      // Create Tenant Document
      const tenantRef = db.collection("tenants").doc(uid);
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      const tenantData = {
        name: businessName,
        ownerEmail: email,
        createdAt: new Date().toISOString(),
        plan: "Crecimiento",
        status: "Prueba",
        trialEnds: trialEndDate,
        logoUrl: "https://placehold.co/100x100.png",
        survey: {
          industry: signupData?.industry,
          businessSize: signupData?.businessSize,
          goals: signupData?.goals,
        },
        billingInfo: {
          address: signupData?.billingAddress,
          city: signupData?.city,
          country: signupData?.country,
          taxId: signupData?.taxId,
        },
      };
      transaction.set(tenantRef, tenantData);

      // Create a default loyalty program
      const programRef = tenantRef.collection("programs").doc();
      transaction.set(programRef, {
        name: "Programa de Recompensas Principal",
        type: "Puntos",
        status: "Activo",
        members: 0,
        created: new Date().toISOString().split("T")[0],
        description: "Programa de lealtad predeterminado.",
        rules: {pointsPerAmount: 10, amountForPoints: 1},
        design: {logoText: businessName, backgroundColor: "#2962FF", foregroundColor: "#FFFFFF"},
      });

      // Create the first admin user for the tenant
      const adminUserRef = tenantRef.collection("users").doc(uid);
      transaction.set(adminUserRef, {
        name: "Admin " + businessName,
        email: email,
        role: "Admin",
        status: "Activo",
        lastLogin: new Date().toLocaleDateString(),
        initials: businessName.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      });

      // ** Special data population for specific email **
      if (email === "luisdiego@gosenku.com") {
        const customersCollectionRef = tenantRef.collection("customers");
        const rewardsCollectionRef = tenantRef.collection("rewards");
        const usersCollectionRef = tenantRef.collection("users");
        const branchesCollectionRef = tenantRef.collection("branches");

        transaction.set(customersCollectionRef.doc(), {name: "Ana Torres", email: "ana.t@example.com", tier: "Oro", points: 15200, segment: "VIP", joined: "2023-01-15", initials: "AT", history: []});
        transaction.set(customersCollectionRef.doc(), {name: "Carlos Vega", email: "carlos.v@example.com", tier: "Plata", points: 6500, segment: "Comprador frecuente", joined: "2023-05-20", initials: "CV", history: []});
        transaction.set(rewardsCollectionRef.doc(), {name: "Café Gratis", description: "Cualquier café mediano.", cost: 1500});
        transaction.set(usersCollectionRef.doc(), {name: "Cajero de Ejemplo", email: "cajero@example.com", role: "Cajero", status: "Activo", lastLogin: "2024-05-20", initials: "CE"});
        transaction.set(branchesCollectionRef.doc(), {name: "Sucursal Principal", address: "Avenida Central 123, San José", location: {lat: 9.9333, lng: -84.0833}});
      }

      // After the transaction, delete the pending document
      transaction.delete(pendingDocRef);
    });

    logger.info(`Successfully set up tenant for user ${uid}.`);
  } catch (error) => {
    logger.error(`Failed to set up tenant for user ${uid}. Deleting user.`, error);
    // If the transaction fails, delete the user to roll back
    await auth.deleteUser(uid);
    logger.info(`Deleted user ${uid} after setup failure.`);
  }
});


// --- Existing PayPal Webhook Handler ---

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

  // ... (rest of the PayPal webhook logic remains unchanged)
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
