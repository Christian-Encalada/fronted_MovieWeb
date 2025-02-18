'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { MovieCard } from '@/components/movie-card';
import { MovieCardSkeleton } from '@/components/ui/movie-card-skeleton';
import { useToast } from "@/hooks/use-toast";
import { FavoriteService } from '@/services/favorite.service';

export default function FavoritesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await FavoriteService.getFavorites();
        setMovies(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar tus favoritos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && movies.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            No tienes películas favoritas aún
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.movie_id} 
            movie={movie}
            onFavoriteChange={() => {
              // Recargar la lista de favoritos
              window.location.reload();
            }}
          />
        ))}
      </div>
    </div>
  );
} 