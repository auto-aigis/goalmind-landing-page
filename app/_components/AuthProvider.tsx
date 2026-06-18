'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Subscription } from '../_lib/types';
import { authApi } from '../_lib/api';

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [userData, subData] = await Promise.all([authApi.me(), authApi.subscription()]);
      setUser(userData);
      setSubscription(subData);
    } catch {
      setUser(null);
      setSubscription(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    setSubscription(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, subscription, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}