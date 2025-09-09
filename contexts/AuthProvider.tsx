'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/services/firebase.client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

type AuthCtx = { user: any; loading: boolean };
const Ctx = createContext<AuthCtx>({ user: null, loading: true });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      // create user profile on first login
      if (u) {
        try {
          const ref = doc(db, 'users', u.uid);
          const snap = await getDoc(ref);
          if (!snap.exists()) {
            await setDoc(ref, {
              uid: u.uid,
              name: u.displayName ?? '',
              email: u.email ?? '',
              photoURL: u.photoURL ?? '',
              provider: 'google',
              createdAt: serverTimestamp(),
            });
          }
        } catch (e) {
          console.error('Failed to upsert user doc', e);
        }
      }
    });
  }, []);

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}
