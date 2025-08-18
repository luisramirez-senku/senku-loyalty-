'use server';

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!getApps().length) {
  initializeApp(serviceAccount ? { credential: cert(serviceAccount) } : {});
}
