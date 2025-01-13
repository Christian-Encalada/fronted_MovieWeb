'use client';

import { Button } from '@/components/ui/button';
import { Film, User, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const isActive = (path: string) => pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    router.push('/login');
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="font-bold">CineAI</span>
          </Link>
          
          {/* Mostrar enlaces solo si está autenticado */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4 ml-4">
              <Link 
                href="/recommendations/user"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/recommendations/user') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Para Ti
              </Link>
              <Link 
                href="/recommendations/movies"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/recommendations/movies') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Por Película
              </Link>
              <Link 
                href="/recommendations/genres"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/recommendations/genres') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Por Género
              </Link>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <LanguageToggle />
          
          {/* Botones de autenticación */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="mr-2">
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button>
                    <User className="h-4 w-4 mr-2" />
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}