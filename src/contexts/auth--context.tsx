
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    UserCredential,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { db, auth } from '@/lib/firebase/client';
import { Loader } from 'lucide-react';
import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (email: string, pass: string, businessName: string, signupData: Record<string, any>) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to seed initial data for the demo account
const seedInitialData = async (tenantId: string, businessName: string, adminEmail: string) => {
    const batch = writeBatch(db);

    // 1. Create a demo program
    const programRef = doc(collection(db, "tenants", tenantId, "programs"));
    batch.set(programRef, {
        name: "Programa de Puntos de Cafetería",
        type: "Puntos",
        status: "Activo",
        members: 5,
        created: "2024-01-15",
        description: "Un programa de lealtad de ejemplo para una cafetería.",
        rules: { pointsPerAmount: 10, amountForPoints: 1 },
        design: {
            logoText: businessName,
            backgroundColor: "#4A2B2C",
            foregroundColor: "#FFFFFF",
            labelColor: "#D1C4E9"
        }
    });

    // 2. Create demo rewards
    const rewardsData = [
      { name: "Café Gratis", description: "Cualquier café de tamaño mediano.", cost: 1500 },
      { name: "Pastel del día", description: "Una rebanada de nuestro pastel del día.", cost: 2500 },
      { name: "Descuento del 20%", description: "20% de descuento en tu compra total.", cost: 5000 },
      { name: "Taza de Marca", description: "Una taza de cerámica con nuestro logo.", cost: 7500 },
    ];
    rewardsData.forEach((reward) => {
        const rewardRef = doc(collection(db, "tenants", tenantId, "rewards"));
        batch.set(rewardRef, reward);
    });

    // 3. Create demo customers
    const customersData = [
      { id: "bAsz8Nn9EaN5Sg2v3j0K", name: "Elena Ríos", email: "elena.rios@example.com", tier: "Oro", points: 8520, segment: "VIP", joined: "2023-05-10", initials: "ER", history: [{id: "tx_1", date: "2024-05-20", description: "Compra Grande", points: 500}] },
      { id: "fG7hJkL9mN0pQ3r5sT", name: "Carlos Vega", email: "carlos.vega@example.com", tier: "Plata", points: 4150, segment: "Comprador frecuente", joined: "2023-11-22", initials: "CV", history: [{id: "tx_2", date: "2024-05-18", description: "Canje de Café", points: -1500}] },
      { id: "uVwXyZ1a2B3c4D5e6F", name: "Sofía Moreno", email: "sofia.moreno@example.com", tier: "Bronce", points: 830, segment: "Nuevo miembro", joined: "2024-04-15", initials: "SM", history: [{id: "tx_3", date: "2024-05-19", description: "Compra", points: 120}] },
      { id: "gH8iJ9kL0mN1oP2qR", name: "Luis Torres", email: "luis.torres@example.com", tier: "Bronce", points: 250, segment: "En riesgo", joined: "2024-02-01", initials: "LT", history: [{id: "tx_4", date: "2024-03-01", description: "Compra", points: 80}] },
      { id: "sT4uV5wX6yZ7a8B9cD", name: "Ana Navarro", email: "ana.navarro@example.com", tier: "Plata", points: 6200, segment: "Alto valor", joined: "2023-08-19", initials: "AN", history: [{id: "tx_5", date: "2024-05-21", description: "Compra", points: 350}] },
    ];
    customersData.forEach((customer) => {
        const { id, ...customerData } = customer;
        const customerRef = doc(db, "tenants", tenantId, "customers", id);
        batch.set(customerRef, {...customerData, programId: programRef.id});
    });

    // 4. Create demo users
    const usersData = [
        { name: "Juan Cajero", email: "juan.cajero@example.com", role: "Cajero", status: "Activo", lastLogin: "2024-05-21", initials: "JC" },
        { name: "Maria Gerente", email: "maria.gerente@example.com", role: "Gerente", status: "Activo", lastLogin: "2024-05-20", initials: "MG" },
        { name: adminEmail, email: adminEmail, role: "Admin", status: "Activo", lastLogin: new Date().toLocaleDateString(), initials: businessName.split(' ').map(n => n[0]).join('').toUpperCase() },
    ];
    usersData.forEach((user) => {
        const userRef = doc(collection(db, "tenants", tenantId, "users"));
        batch.set(userRef, user);
    });

    await batch.commit();
};


const createNewTenant = async (tenantId: string, businessName: string, adminEmail: string, signupData: Record<string, any>) => {
    const tenantRef = doc(db, "tenants", tenantId);
    
    const tenantData = {
        name: businessName,
        ownerEmail: adminEmail,
        createdAt: new Date().toISOString(),
        plan: "Pro", 
        status: "Activo",
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
    
    // Create the tenant and the first admin user in a batch to ensure atomicity
    const batch = writeBatch(db);
    batch.set(tenantRef, tenantData);

    const adminUserRef = doc(db, "tenants", tenantId, "users", tenantId);
    batch.set(adminUserRef, {
        name: businessName,
        email: adminEmail,
        role: "Admin",
        status: "Activo",
        lastLogin: new Date().toLocaleDateString(),
        initials: businessName.split(' ').map(n => n[0]).join('').toUpperCase()
    });

    await batch.commit();
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, businessName: string, signupData: Record<string, any>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        // Create the clean tenant structure first
        await createNewTenant(userCredential.user.uid, businessName, email, signupData);

        // ONLY if the UID matches the specific demo account, seed the data
        if (userCredential.user.uid === "HUI2lwm11IYraNz0LyPv1Q597H73") {
            await seedInitialData(userCredential.user.uid, businessName, email);
        }
    }
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const sendPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    sendPasswordReset,
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


