
'use client';

/**
 * @fileOverview Firebase Client Configuration
 * 
 * This file gathers environment variables and exports the config object
 * used to initialize the Firebase SDK. It includes safety checks to 
 * ensure the app doesn't crash if configuration is missing.
 */

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // Automatically derive authDomain if not provided, standard for Firebase
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (projectId ? `${projectId}.firebaseapp.com` : undefined),
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.firebasestorage.app` : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log a warning in development if the configuration is incomplete
if (process.env.NODE_ENV === 'development') {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0 && !projectId?.includes('YOUR_')) {
    console.warn(
      `Firebase configuration is missing the following keys: ${missingKeys.join(', ')}. ` +
      `Check your .env file and ensure you've copied the config from the Firebase Console.`
    );
  }
}
