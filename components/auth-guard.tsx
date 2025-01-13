'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar un estado de carga o nada mientras se verifica la autenticación
  if (isLoading) {
    return <div>Cargando...</div>; // Puedes personalizar esto
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}