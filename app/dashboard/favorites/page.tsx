'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { FavoriteService } from '@/services/favorite.service';
import { MovieCard } from '@/components/movie-card';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFavorites = async () => {
    try {
      await FavoriteService.clearFavorites();
      setFavorites([]);
      toast({
        title: "Éxito",
        description: "Se han eliminado todos los favoritos",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron eliminar los favoritos",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return <div>Cargando favoritos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Favoritos</h1>
        {favorites.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={handleClearFavorites}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar favoritos
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p>No tienes películas favoritas aún.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((movie) => (
              <MovieCard 
                key={movie.movie_id} 
                movie={movie} 
                onFavoriteChange={() => loadFavorites(0)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => {
                  setPage(prev => prev + 1);
                  loadFavorites(page + 1);
                }}
              >
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 