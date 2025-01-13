'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      return !!(token && userId);
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = () => {
      const isAuth = checkAuth();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };

    initAuth();
  }, [checkAuth]);

  const login = async (token: string, userData: any) => {
    try {
      const cleanToken = token.replace('Bearer ', '');
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('user_id', userData.user_id.toString());
      setIsAuthenticated(true);
      setIsLoading(false);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al iniciar sesión",
        variant: "destructive",
      });
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
    login,
    logout,
    checkAuth
  };
}