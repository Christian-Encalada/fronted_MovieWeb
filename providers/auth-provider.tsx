'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  setAuth: (token: string, userData: any) => {},
  logout: () => {},
  updateUser: (userData: any) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token) {
        setIsAuthenticated(true);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const setAuth = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Mostrar un estado de carga mientras se inicializa
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuth, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
} 