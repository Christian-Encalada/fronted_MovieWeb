'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface User {
  user_id: number;
  username: string;
  email: string;
}

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      // Add username and email from localStorage if you have them
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      
      if (token && userId) {
        setUser({
          user_id: parseInt(userId),
          username: username || 'Usuario',
          email: email || ''
        });
        return true;
      }
      return false;
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
      // Store additional user data
      if (userData.username) localStorage.setItem('username', userData.username);
      if (userData.email) localStorage.setItem('email', userData.email);
      
      setUser({
        user_id: userData.user_id,
        username: userData.username || 'Usuario',
        email: userData.email || ''
      });
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
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
    user,
    login,
    logout,
    checkAuth
  };
}