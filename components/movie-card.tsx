'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/services/movie.service';
import { FavoriteService } from '@/services/favorite.service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onFavoriteChange?: () => void;
  variant?: 'default' | 'compact';
}

export function MovieCard({ 
  movie, 
  onFavoriteChange,
  variant = 'default'
}: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'; // Asegúrate de tener una imagen placeholder

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Evitar navegación si se hizo clic en el botón de favoritos
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/dashboard/movie/${movie.movie_id}`);
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-shadow relative cursor-pointer overflow-hidden",
        variant === 'compact' && "scale-90 origin-top"
      )}
      onClick={handleCardClick}
    >
      <div className={cn(
        "relative aspect-[2/3] w-full",
        variant === 'compact' && "aspect-[2/2.8]"
      )}>
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick();
          }}
          disabled={isLoading}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm",
            "hover:bg-black/70 transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            isLoading && "opacity-50 cursor-not-allowed",
            variant === 'compact' && "scale-90"
          )}
        >
          {isFavorite ? (
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
      <CardContent className={cn(
        "p-4",
        variant === 'compact' && "p-3"
      )}>
        <h3 className={cn(
          "font-semibold line-clamp-1",
          variant === 'default' ? "text-lg" : "text-base"
        )}>
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {movie.genres.split('|').join(', ')}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
} 