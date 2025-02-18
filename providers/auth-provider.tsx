'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth } = useAuth();

  useEffect(() => {
    // Recuperar estado de autenticación al cargar
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuth(token, user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [setAuth]);

  return <>{children}</>;
} 