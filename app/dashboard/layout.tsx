'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar para desktop */}
        <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)]">
          <Sidebar navigationItems={navigationItems} />
        </div>

        {/* Menú móvil */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="fixed left-4 top-20 z-40">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar navigationItems={navigationItems} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Contenido principal */}
        <main className="flex-1 w-full md:pl-64 overflow-y-auto">
          <div className="container mx-auto p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}