'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { MovieCard } from '@/components/movie-card';
import { useToast } from '@/hooks/use-toast';

interface SimilarMoviesProps {
  movieId: number;
}

export function SimilarMovies({ movieId }: SimilarMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        const response = await fetch(`http://localhost:8000/movies/${movieId}/similar`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener películas similares');
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las películas similares",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Películas Parecidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.movie_id} 
            movie={movie}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
} 