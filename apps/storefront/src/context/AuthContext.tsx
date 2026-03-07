'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { getStoredToken, setStoredToken, authMe, type UserRecord } from '@/lib/api';

interface AuthContextValue {
  user: UserRecord | null;
  loading: boolean;
  setUser: (u: UserRecord | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((token: string | null) => {
    setStoredToken(token);
    if (!token) setUser(null);
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authMe()
      .then((u) => setUser(u ?? null))
      .catch(() => setStoredToken(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
