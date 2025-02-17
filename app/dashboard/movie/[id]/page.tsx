'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { MovieHeader } from '@/components/page-movie/movie-header';
import { MoviePoster } from '@/components/page-movie/movie-poster';
import { MovieInfo } from '@/components/page-movie/movie-info';
import { FavoriteService } from '@/services/favorite.service';
import { SimilarMovies } from '@/components/page-movie/similar-movies';

export default function MovieDetailPage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/movies/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener detalles de la película');
        }

        const data = await response.json();
        setMovie(data);

        if (isAuthenticated) {
          const favoriteStatus = await FavoriteService.checkFavorite(data.movie_id);
          setIsFavorite(favoriteStatus);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la película",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id, isAuthenticated, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No se encontró la película</p>
        <MovieHeader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <MovieHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MoviePoster 
          posterPath={movie.poster_path} 
          title={movie.title} 
        />
        <MovieInfo 
          movie={movie}
          isFavorite={isFavorite}
          onFavoriteChange={setIsFavorite}
          isAuthenticated={isAuthenticated}
        />
      </div>

      <SimilarMovies movieId={movie.movie_id} />
    </div>
  );
} 