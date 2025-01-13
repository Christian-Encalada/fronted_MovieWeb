'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { toast } = useToast();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Películas',
    },
    {
      href: '/dashboard/for-you',
      label: 'Para Ti',
    },
    {
      href: '/dashboard/by-movie',
      label: 'Por Película',
    },
    {
      href: '/dashboard/genres',
      label: 'Por Género',
    },
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
            <div className="text-xl font-bold">CineAI</div>
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
    </nav>
  );
}