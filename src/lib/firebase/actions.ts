'use server';

import '@/lib/firebase/server'; // Ensures server is initialized
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const adminAuth = getAuth();
const db = getFirestore();

export const createNewCustomer = async (tenantId: string, programId: string, customerData: Record<string, any>) => {
    // 1. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
        email: customerData.email,
        password: customerData.password,
        displayName: customerData.name,
    });

    // 2. Create the customer document in Firestore, using the UID from Auth as the document ID
    const customerRef = db.collection("tenants").doc(tenantId).collection("customers").doc(userRecord.uid);
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
    const userRef = db.collection("tenants").doc(tenantId).collection("users").doc(userRecord.uid);
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
