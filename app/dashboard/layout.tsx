'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  MessageSquareText, 
  Home, 
  Film, 
  Layers, 
  Heart 
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

const navigationItems: NavigationItem[] = [
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isProfilePage = pathname.includes('/profile');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar navigationItems={navigationItems} />
      <div className="flex h-[calc(100vh-4rem)]">
        {!isProfilePage && (
          <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)]">
            <Sidebar navigationItems={navigationItems} />
          </div>
        )}
        <main className={cn(
          "flex-1 w-full overflow-y-auto",
          !isProfilePage && "md:pl-64"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}