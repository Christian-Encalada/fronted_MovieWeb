'use client';

import { create } from 'zustand';

interface User {
  user_id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  theme: string;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setTheme: (theme: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light',
  
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ 
      isAuthenticated: true, 
      token,
      user 
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ 
      isAuthenticated: false, 
      token: null,
      user: null 
    });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  }
}));

// Inicializar el estado
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    useAuth.setState({ 
      user: JSON.parse(user),
      token,
      isAuthenticated: true
    });
  }
}