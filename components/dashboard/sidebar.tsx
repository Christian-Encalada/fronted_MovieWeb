'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, Home, Film, Clapperboard } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

interface SidebarProps {
  navigationItems: NavigationItem[];
}

export function Sidebar({ navigationItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-muted/50 border-r">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Navegación
        </h2>
        <div className="space-y-1">
          {navigationItems.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn(
                  "h-5 w-5 mr-3",
                  pathname === route.href ? "text-primary" : "text-muted-foreground"
                )} />
                {route.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 