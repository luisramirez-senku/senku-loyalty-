
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
import { writeBatch, doc } from 'firebase/firestore';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (email: string, pass: string, businessName: string, signupData: Record<string, any>) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This function creates the basic tenant document without any demo data
const createNewTenant = async (tenantId: string, businessName: string, adminEmail: string, signupData: Record<string, any>) => {
    const tenantRef = doc(db, "tenants", tenantId);
    
    const tenantData = {
        name: businessName,
        ownerEmail: adminEmail,
        createdAt: new Date().toISOString(),
        plan: "Trial", // Start every new user on a trial plan
        status: "Activo",
        // Store the survey and billing info
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
        // After user is created in Auth, create their clean tenant structure
        await createNewTenant(userCredential.user.uid, businessName, email, signupData);
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
