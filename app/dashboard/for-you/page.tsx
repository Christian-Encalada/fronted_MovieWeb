'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { MovieCard } from '@/components/movie-card';

const ITEMS_PER_PAGE = 12; // Número de películas por página

export default function ForYouPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Calcular películas para la página actual
  const indexOfLastMovie = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMovie = indexOfLastMovie - ITEMS_PER_PAGE;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
        return;
      }

      if (isLoading) {
        return;
      }

      try {
        const { data } = await api.get<Movie[]>('/movies/recommendations/user');
        
        if (!Array.isArray(data)) {
          throw new Error('Formato de datos inválido');
        }
        
        setMovies(data);
        setLoading(false);
      } catch (error: any) {
        let errorMessage = "No se pudieron cargar las recomendaciones";
        if (error.response?.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail[0]?.msg || errorMessage;
          } else {
            errorMessage = error.response.data.detail;
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadRecommendations();
    }
  }, [isAuthenticated, isLoading, router, toast]);

  if (isLoading || loading) {
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
      <div className="flex justify-center items-center min-h-screen">
        <p>Debes iniciar sesión para ver las recomendaciones</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Para Ti</h1>
      {movies.length === 0 ? (
        <p>No hay recomendaciones disponibles en este momento.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {currentMovies.map((movie) => (
              <MovieCard 
                key={movie.movie_id} 
                movie={movie}
                onFavoriteChange={() => {
                  // Opcional: Recargar las recomendaciones si es necesario
                }}
              />
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 