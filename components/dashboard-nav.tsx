'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut, User, Film, List, Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { toast } = useToast();

  const navItems = [
    {
      href: '/dashboard/for-you',
      label: 'Para Ti',
      icon: <User className="h-4 w-4" />
    },
    {
      href: '/dashboard/by-movie',
      label: 'Por Película',
      icon: <Film className="h-4 w-4" />
    },
    {
      href: '/dashboard/genres',
      label: 'Por Género',
      icon: <List className="h-4 w-4" />
    },
    {
      href: '/dashboard/favorites',
      label: 'Favoritos',
      icon: <Star className="h-4 w-4" />
    }
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    router.push('/login');
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard/for-you" className="text-xl font-bold">CineAI</Link>
            <div className="ml-8 flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-gray-900 text-white dark:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-700 hover:text-white dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/profile"
              className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
            >
              <User className="h-5 w-5" />
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}