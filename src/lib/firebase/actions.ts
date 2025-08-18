'use server';

import '@/lib/firebase/server'; // Ensures server is initialized
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, writeBatch, doc, collection } from 'firebase-admin/firestore';

const adminAuth = getAuth();
const db = getFirestore();


// This is a server action, it will only run on the server.
export const createNewTenant = async (tenantId: string, businessName: string, adminEmail: string, signupData: Record<string, any>) => {
    const batch = writeBatch(db);
    
    // 1. Create Tenant Document
    const tenantRef = doc(db, "tenants", tenantId);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

    const tenantData = {
        name: businessName,
        ownerEmail: adminEmail,
        createdAt: new Date().toISOString(),
        plan: "Crecimiento",
        status: "Prueba",
        trialEnds: trialEndDate,
        logoUrl: "https://placehold.co/100x100.png",
        survey: {
            industry: signupData.industry,
            businessSize: signupData.businessSize,
            goals: signupData.goals,
        },
        billingInfo: {
            address: signupData.billingAddress,
            city: signupData.city,
            country: signupData.country,
            taxId: signupData.taxId,
        }
    };
    batch.set(tenantRef, tenantData);

    // 2. Create a default loyalty program for the new tenant
    // Generate the program ID beforehand so we can use it in the demo customer
    const programCollectionRef = collection(db, "tenants", tenantId, "programs");
    const programRef = doc(programCollectionRef); // Creates a new doc with a random ID
    const programData = {
        name: "Programa de Recompensas Principal",
        type: "Puntos",
        status: "Activo",
        members: 1, // Starting with one demo member
        created: new Date().toISOString().split('T')[0],
        description: "Programa de lealtad predeterminado para todos los clientes.",
        rules: { pointsPerAmount: 10, amountForPoints: 1 },
        design: { logoText: businessName, backgroundColor: "#2962FF", foregroundColor: "#FFFFFF" }
    };
    batch.set(programRef, programData);
    
    // 3. Create the first admin user for the tenant
    const adminUserRef = doc(db, "tenants", tenantId, "users", tenantId);
    batch.set(adminUserRef, {
        name: "Admin " + businessName,
        email: adminEmail,
        role: "Admin",
        status: "Activo",
        lastLogin: new Date().toLocaleDateString(),
        initials: businessName.split(' ').map(n => n[0]).join('').toUpperCase()
    });

    // 4. Create a sample customer for demonstration
    const demoCustomerName = "Cliente Demo";
    const demoCustomerEmail = "cliente.demo@email.com";
    const demoCustomerPassword = "password123";
    try {
        const demoUserRecord = await adminAuth.createUser({
            email: demoCustomerEmail,
            password: demoCustomerPassword,
            displayName: demoCustomerName,
        });
        const demoCustomerRef = doc(db, "tenants", tenantId, "customers", demoUserRecord.uid);
        batch.set(demoCustomerRef, {
            name: demoCustomerName,
            email: demoCustomerEmail,
            phone: "555-0101",
            programId: programRef.id, // Use the pre-generated program ID
            tier: 'Bronce',
            points: 1250,
            segment: 'Nuevo miembro',
            joined: new Date().toISOString().split('T')[0],
            initials: demoCustomerName.split(' ').map(n => n[0]).join(''),
            history: [
                { id: 'tx_1', date: new Date().toISOString().split('T')[0], description: 'Bono de bienvenida', points: 250 },
                { id: 'tx_2', date: new Date().toISOString().split('T')[0], description: 'Primera compra', points: 1000 },
            ],
        });
    } catch (e: any) {
        if(e.code !== 'auth/email-already-exists') {
            console.error("Error creating demo customer auth user", e);
        } else {
             console.log("Demo customer auth user already exists.");
        }
    }
    
    // ** Special data population for luisdiego@gosenku.com **
    if (adminEmail === 'luisdiego@gosenku.com') {
        const customersCollectionRef = collection(db, "tenants", tenantId, "customers");
        const rewardsCollectionRef = collection(db, "tenants", tenantId, "rewards");
        const usersCollectionRef = collection(db, "tenants", tenantId, "users");
        const branchesCollectionRef = collection(db, "tenants", tenantId, "branches");

        // Add more customers
        batch.set(doc(customersCollectionRef), { name: "Ana Torres", email: "ana.t@example.com", tier: "Oro", points: 15200, segment: "VIP", joined: "2023-01-15", initials: "AT", history: [] });
        batch.set(doc(customersCollectionRef), { name: "Carlos Vega", email: "carlos.v@example.com", tier: "Plata", points: 6500, segment: "Comprador frecuente", joined: "2023-05-20", initials: "CV", history: [] });
        batch.set(doc(customersCollectionRef), { name: "Sofía Rojas", email: "sofia.r@example.com", tier: "Bronce", points: 850, segment: "En riesgo", joined: "2024-02-10", initials: "SR", history: [] });

        // Add rewards
        batch.set(doc(rewardsCollectionRef), { name: "Café Gratis", description: "Cualquier café mediano.", cost: 1500 });
        batch.set(doc(rewardsCollectionRef), { name: "20% Descuento", description: "20% de descuento en tu próxima compra.", cost: 5000 });
        batch.set(doc(rewardsCollectionRef), { name: "Postre Gratis", description: "Elige tu postre favorito.", cost: 2500 });
        
        // Add users
        batch.set(doc(usersCollectionRef), { name: "Cajero de Ejemplo", email: "cajero@example.com", role: "Cajero", status: "Activo", lastLogin: "2024-05-20", initials: "CE" });
        batch.set(doc(usersCollectionRef), { name: "Gerente de Ejemplo", email: "gerente@example.com", role: "Gerente", status: "Activo", lastLogin: "2024-05-21", initials: "GE" });

        // Add branches
        batch.set(doc(branchesCollectionRef), { name: "Sucursal Principal", address: "Avenida Central 123, San José", location: { lat: 9.9333, lng: -84.0833 } });
        batch.set(doc(branchesCollectionRef), { name: "Sucursal Este", address: "Mall del Este, Local 5", location: { lat: 9.9325, lng: -84.0507 } });
    }

    await batch.commit();
}

export const createNewCustomer = async (tenantId: string, programId: string, customerData: Record<string, any>) => {
    // 1. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
        email: customerData.email,
        password: customerData.password,
        displayName: customerData.name,
    });

    // 2. Create the customer document in Firestore, using the UID from Auth as the document ID
    const customerRef = doc(db, "tenants", tenantId, "customers", userRecord.uid);
    const initials = customerData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

    const firestoreData = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || '',
        cedula: customerData.cedula || '',
        programId: programId,
        tier: 'Bronce',
        points: 0,
        segment: 'Nuevo miembro',
        joined: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        initials: initials,
        history: [],
    };
    
    await customerRef.set(firestoreData);

    return { uid: userRecord.uid };
};

// Server action to create a user (for admin panel)
export const createNewUser = async (tenantId: string, userData: { name: string; email: string; role: 'Cajero' | 'Gerente' | 'Admin' }) => {
    // 1. Create user in Firebase Auth
    const tempPassword = Math.random().toString(36).slice(-8); // Generate temporary password
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: tempPassword,
      displayName: userData.name,
    });
  
    // 2. Create user document in Firestore
    const userRef = doc(db, "tenants", tenantId, "users", userRecord.uid);
    const initials = userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  
    await userRef.set({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'Activo',
      lastLogin: 'Nunca',
      initials: initials,
    });
  
    // In a real application, you'd likely want to send the temporary password to the user
    // via a secure channel (e.g., email), but for now, we'll log it.
    console.log(`User ${userData.email} created with temporary password: ${tempPassword}`);
  
    return { uid: userRecord.uid };
};
