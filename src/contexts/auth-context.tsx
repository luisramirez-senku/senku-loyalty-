
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
import { auth, db } from '@/lib/firebase/client'; // Import db from client setup
import { doc, setDoc } from "firebase/firestore"; // Import firestore functions
import { Loader } from 'lucide-react';
// createNewTenant is no longer needed here
// import { createNewTenant } from '@/lib/firebase/actions';


export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential>;
  signup: (email: string, pass: string, businessName: string, signupData: Record<string, any>) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  /**
   * Refactored signup flow.
   * 1. Creates the user in Firebase Auth.
   * 2. Writes the additional form data to a 'pendingTenants' collection in Firestore.
   * 3. A Cloud Function will trigger on user creation, read the pending data,
   *    and set up the tenant environment atomically.
   */
  const signup = async (email: string, pass: string, businessName: string, signupData: Record<string, any>) => {
    // Note: We don't create the user first anymore to get the UID.
    // The UID is available right after user creation.
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;

    if (newUser) {
      try {
        // Add businessName to the signupData object before saving
        const pendingData = { ...signupData, businessName };

        // Save the signup data to a temporary 'pendingTenants' document
        const pendingDocRef = doc(db, "pendingTenants", newUser.uid);
        await setDoc(pendingDocRef, pendingData);

      } catch (error) {
        // If writing to firestore fails, we must delete the created user
        // to prevent an orphaned user.
        console.error("Failed to write pending tenant data. Deleting user.", error);
        await newUser.delete();
        // Rethrow the error to be caught by the UI form
        throw new Error("Failed to save registration data. Please try again.");
      }
    }
    
    // The user credential is returned so the UI can proceed as before.
    // The Cloud Function will handle the rest in the background.
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
