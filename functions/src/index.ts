import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// ------------------------
// User creation handler
// ------------------------
export const setupNewUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email } = user;

  if (!email) {
    logger.warn(`User ${uid} created without an email. Skipping setup.`);
    return;
  }

  logger.info(`New user created: ${email} (${uid}). Starting setup process.`);

  const pendingDocRef = db.collection("pendingTenants").doc(uid);
  const pendingDoc = await pendingDocRef.get();

  if (!pendingDoc.exists) {
    logger.error(`Pending tenant data not found for user ${uid}.`);
    await auth.deleteUser(uid);
    logger.info(`Deleted orphaned user ${uid}.`);
    return;
  }

  const signupData = pendingDoc.data();
  const businessName = signupData?.businessName || "Mi Negocio";

  try {
    await db.runTransaction(async (transaction) => {
      const tenantRef = db.collection("tenants").doc(uid);
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      transaction.set(tenantRef, {
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
      });

      // Default loyalty program
      const programRef = tenantRef.collection("programs").doc();
      transaction.set(programRef, {
        name: "Programa de Recompensas Principal",
        type: "Puntos",
        status: "Activo",
        members: 0,
        created: new Date().toISOString().split("T")[0],
        description: "Programa de lealtad predeterminado.",
        rules: { pointsPerAmount: 10, amountForPoints: 1 },
        design: { logoText: businessName, backgroundColor: "#2962FF", foregroundColor: "#FFFFFF" },
      });

      // First admin user
      const adminUserRef = tenantRef.collection("users").doc(uid);
      transaction.set(adminUserRef, {
        name: "Admin " + businessName,
        email: email,
        role: "Admin",
        status: "Activo",
        lastLogin: new Date().toLocaleDateString(),
        initials: businessName.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      });

      // Special example data
      if (email === "luisdiego@gosenku.com") {
        const customersCollectionRef = tenantRef.collection("customers");
        const rewardsCollectionRef = tenantRef.collection("rewards");
        const usersCollectionRef = tenantRef.collection("users");
        const branchesCollectionRef = tenantRef.collection("branches");

        transaction.set(customersCollectionRef.doc(), { name: "Ana Torres", email: "ana.t@example.com", tier: "Oro", points: 15200, segment: "VIP", joined: "2023-01-15", initials: "AT", history: [] });
        transaction.set(customersCollectionRef.doc(), { name: "Carlos Vega", email: "carlos.v@example.com", tier: "Plata", points: 6500, segment: "Comprador frecuente", joined: "2023-05-20", initials: "CV", history: [] });
        transaction.set(rewardsCollectionRef.doc(), { name: "Café Gratis", description: "Cualquier café mediano.", cost: 1500 });
        transaction.set(usersCollectionRef.doc(), { name: "Cajero de Ejemplo", email: "cajero@example.com", role: "Cajero", status: "Activo", lastLogin: "2024-05-20", initials: "CE" });
        transaction.set(branchesCollectionRef.doc(), { name: "Sucursal Principal", address: "Avenida Central 123, San José", location: { lat: 9.9333, lng: -84.0833 } });
      }

      // Delete pending document
      transaction.delete(pendingDocRef);
    });

    logger.info(`Successfully set up tenant for user ${uid}.`);
  } catch (error: any) {
    logger.error(`Failed to set up tenant for user ${uid}. Deleting user.`, error);
    await auth.deleteUser(uid);
  }
})