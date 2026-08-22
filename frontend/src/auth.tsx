import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const AUTH_KEY = 'festival_admin_auth_v1';
const TOKEN_KEY = 'festival_admin_token';
const ADMIN_PASSWORD = 'festival2026';

interface AuthContextValue {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  getToken: () => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(TOKEN_KEY, password);
      setIsAdmin(true);
      console.log('Admin logged in, token saved');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setIsAdmin(false);
    console.log('Admin logged out');
  }, []);

  const getToken = useCallback(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    console.log('Getting token:', token ? 'Token exists' : 'No token');
    return token || '';
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}