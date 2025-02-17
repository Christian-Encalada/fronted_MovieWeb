'use client';

import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { 
  MessageSquareText, 
  Home, 
  Film, 
  Layers, 
  Heart 
} from "lucide-react";

const navigationItems = [
  {
    title: "Para Ti",
    href: "/dashboard/for-you",
    icon: Home,
  },
  {
    title: "Por Película",
    href: "/dashboard/by-movie",
    icon: Film,
  },
  {
    title: "Por Género",
    href: "/dashboard/genres",
    icon: Layers,
  },
  {
    title: "Favoritos",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Chat IA",
    href: "/dashboard/chat",
    icon: MessageSquareText,
    className: "text-primary hover:text-primary/80"
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirigir a "Para ti" si estamos en la ruta /dashboard
  if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
    redirect('/dashboard/for-you');
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)]">
          <Sidebar navigationItems={navigationItems} />
        </div>
        <main className="md:pl-64 flex-1 overflow-y-auto">
          <div className="container mx-auto p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}