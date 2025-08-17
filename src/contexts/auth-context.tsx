
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

// Helper function to generate initials
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const demoTransactions = [
    { id: "txn_1", date: "2024-07-20", description: "Compra en tienda", points: 120 },
    { id: "txn_2", date: "2024-07-18", description: "Bono de bienvenida", points: 500 },
    { id: "txn_3", date: "2024-07-15", description: "Canje: Café Gratis", points: -1500 },
    { id: "txn_4", date: "2024-07-12", description: "Compra en tienda", points: 85 },
];

// Data for seeding
const demoCustomers = [
    { id: "bAsz8Nn9EaN5Sg2v3j0K", name: "Elena Ríos", email: "elena.r@example.com", tier: "Oro", points: 12580, segment: "Alto valor", joined: "2023-01-15", initials: "ER", history: demoTransactions },
    { id: "cDy1FmPq7sT9wX4z6K", name: "Carlos Vargas", email: "carlos.v@example.com", tier: "Plata", points: 7500, segment: "Comprador frecuente", joined: "2023-03-22", initials: "CV", history: [] },
    { id: "hJkL5rT8vW2yX9z1M", name: "Ana Torres", email: "ana.t@example.com", tier: "Bronce", points: 1200, segment: "Nuevo miembro", joined: "2024-05-10", initials: "AT", history: [] },
    { id: "mNbV6cXz8aQ3wE9rT", name: "Javier Mendoza", email: "javier.m@example.com", tier: "Plata", points: 6200, segment: "En riesgo", joined: "2023-02-01", initials: "JM", history: [] },
    { id: "pLkT7sW9vX3zY1gH4", name: "Sofía Castillo", email: "sofia.c@example.com", tier: "VIP", points: 25000, segment: "VIP", joined: "2022-11-20", initials: "SC", history: [] },
];

const demoRewards = [
    { name: "Café Gratis", description: "Cualquier café de tamaño mediano.", cost: 1500 },
    { name: "Postre del Día", description: "Una porción de nuestro postre especial.", cost: 2500 },
    { name: "20% de Descuento", description: "En tu próxima compra total.", cost: 5000 },
    { name: "Bebida Premium", description: "Cualquier bebida especial de nuestro menú.", cost: 3500 },
];

const demoUsers = [
    { name: 'Laura Gómez', email: 'laura.g@cashier.com', role: 'Cajero', status: 'Activo', lastLogin: '2024-07-20' },
    { name: 'Pedro Morales', email: 'pedro.m@manager.com', role: 'Gerente', status: 'Activo', lastLogin: '2024-07-21' }
];

const demoPrograms = [
    {
        name: "Programa de Puntos Demo",
        type: "Puntos",
        status: "Activo",
        members: 5,
        created: "2024-01-01",
        description: "Un programa de puntos de demostración para empezar.",
        rules: { pointsPerAmount: 10, amountForPoints: 1 },
        design: {
            logoText: "Tu Cafetería",
            backgroundColor: "#4A5568",
            foregroundColor: "#FFFFFF",
            labelColor: "#A0AEC0",
        }
    }
];

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (email: string, pass: string, name: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to seed data for a new user, now as a tenant
const seedInitialData = async (tenantId: string, tenantName: string, adminEmail: string) => {
    const batch = writeBatch(db);

    // Create the tenant document
    const tenantRef = doc(db, "tenants", tenantId);
    batch.set(tenantRef, {
        name: tenantName,
        ownerEmail: adminEmail,
        createdAt: new Date().toISOString(),
        plan: "Pro",
        status: "Activo"
    });

    // 1. Create the admin user for the new account inside the tenant's user collection
    const adminUserRef = doc(db, "tenants", tenantId, "users", tenantId);
    batch.set(adminUserRef, {
        name: tenantName, // Business name can be the initial admin name
        email: adminEmail,
        role: "Admin",
        status: "Activo",
        lastLogin: new Date().toLocaleDateString(),
        initials: getInitials(tenantName)
    });

    // 2. Seed other demo users inside the tenant's user collection
    demoUsers.forEach(user => {
        const userRef = doc(collection(db, "tenants", tenantId, "users"));
        batch.set(userRef, { ...user, initials: getInitials(user.name) });
    });
    
    // 3. Seed customers inside the tenant's customer collection
    demoCustomers.forEach(customer => {
        const customerRef = doc(db, "tenants", tenantId, "customers", customer.id);
        batch.set(customerRef, customer);
    });

    // 4. Seed rewards inside the tenant's reward collection
    demoRewards.forEach(reward => {
        const rewardRef = doc(collection(db, "tenants", tenantId, "rewards"));
        batch.set(rewardRef, reward);
    });

    // 5. Seed programs inside the tenant's program collection
    demoPrograms.forEach(program => {
        const programRef = doc(collection(db, "tenants", tenantId, "programs"));
        batch.set(programRef, { ...program, id: programRef.id }); // Add the generated ID to the doc
    })


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

  const signup = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        // After user is created in Auth, seed their tenant data
        await seedInitialData(userCredential.user.uid, name, email);
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
