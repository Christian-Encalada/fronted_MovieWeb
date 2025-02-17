'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/services/movie.service';
import { FavoriteService } from '@/services/favorite.service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface MovieCardProps {
  movie: Movie;
  onFavoriteChange?: () => void;
}

export function MovieCard({ movie, onFavoriteChange }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) return;
      const status = await FavoriteService.checkFavorite(movie.movie_id);
      setIsFavorite(status);
    };

    checkFavoriteStatus();
  }, [movie.movie_id, isAuthenticated]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para agregar favoritos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await FavoriteService.removeFromFavorites(movie.movie_id);
        toast({
          title: "Éxito",
          description: "Película eliminada de favoritos",
        });
      } else {
        await FavoriteService.addToFavorites(movie.movie_id);
        toast({
          title: "Éxito",
          description: "Película agregada a favoritos",
        });
      }
      setIsFavorite(!isFavorite);
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Error al actualizar favoritos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <button
        onClick={handleFavoriteClick}
        disabled={isLoading}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full transition-all duration-300",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {isFavorite ? (
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ) : (
          <StarOff className="h-5 w-5 text-gray-400 hover:text-yellow-400 dark:text-gray-500 dark:hover:text-yellow-400" />
        )}
      </button>
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {movie.genres.split('|').join(', ')}
        </p>
      </CardContent>
    </Card>
  );
} 