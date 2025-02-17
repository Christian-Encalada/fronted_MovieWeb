'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/services/movie.service';
import { MovieCard } from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FavoriteService } from '@/services/favorite.service';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const loadFavorites = async (pageNum = 0) => {
    try {
      const favs = await FavoriteService.getFavorites(pageNum * 10, 10);
      if (pageNum === 0) {
        setFavorites(favs);
      } else {
        setFavorites(prev => [...prev, ...favs]);
      }
      setHasMore(favs.length === 10);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los favoritos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    loadFavorites(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            No tienes películas favoritas aún
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <MovieCard 
                key={movie.movie_id} 
                movie={movie}
                onFavoriteChange={() => loadFavorites()}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore}>
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 