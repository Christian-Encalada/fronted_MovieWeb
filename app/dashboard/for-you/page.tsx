'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { MovieCard } from '@/components/movie-card';
import { MovieCardSkeleton } from '@/components/ui/movie-card-skeleton';
import { useRouter } from 'next/navigation';

export default function ForYouPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtén el token directamente
        console.log("Token en frontend:", token?.substring(0, 20)); // Debug

        const response = await fetch('https://fastapi-backend-fghrfmdeegdydydd.canadacentral-01.azurewebsites.net/movies/recommendations/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          console.log("Error de autenticación"); // Debug
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Error al obtener recomendaciones');
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error completo:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las recomendaciones",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecommendations();
    }
  }, [isAuthenticated, toast, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando recomendaciones...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-lg">Debes iniciar sesión para ver las recomendaciones</p>
        <Button onClick={() => router.push('/login')}>
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Para Ti</h1>
      {movies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground mb-4">
            No tienes preferencias aún. Agrega películas a favoritos para obtener recomendaciones personalizadas.
          </p>
          <Button 
            onClick={() => router.push('/dashboard/by-movie')}
            className="mx-auto"
          >
            Explorar Películas
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.movie_id} 
              movie={movie}
              onFavoriteChange={() => {
                // Recargar recomendaciones cuando cambian los favoritos
                router.refresh();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 