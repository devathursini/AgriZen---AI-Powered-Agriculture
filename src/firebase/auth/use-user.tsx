'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

// Mock user for Demo Mode
const MOCK_USER = {
  uid: 'demo-user-id',
  displayName: 'Zen Demo Farmer',
  email: 'demo@agrizen.ai',
  photoURL: 'https://picsum.photos/seed/demo/100/100',
} as User;

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo mode in localStorage
    const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('agrizen_demo_mode') === 'true';
    
    if (isDemoMode) {
      setUser(MOCK_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const enterDemoMode = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrizen_demo_mode', 'true');
      setUser(MOCK_USER);
    }
  };

  const exitDemoMode = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrizen_demo_mode');
      setUser(null);
    }
  };

  return { user, loading, enterDemoMode, exitDemoMode };
}
