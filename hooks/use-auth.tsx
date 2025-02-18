'use client';
import { create } from 'zustand';

interface User {
  user_id: number;
  username: string;
  email: string;
  created_at: string;
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
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
})); 