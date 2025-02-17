'use client';

import { Button } from '@/components/ui/button';
import { Star, Play } from 'lucide-react';
import { Movie } from '@/services/movie.service';
import { useToast } from '@/hooks/use-toast';
import { FavoriteService } from '@/services/favorite.service';
import { TrailerModal } from './trailer-modal';
import { useState } from 'react';

interface MovieInfoProps {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (newStatus: boolean) => void;
  isAuthenticated: boolean;
}

export function MovieInfo({ movie, isFavorite, onFavoriteChange, isAuthenticated }: MovieInfoProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para agregar favoritos",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        await FavoriteService.removeFromFavorites(movie.movie_id);
        onFavoriteChange(false);
        toast({
          title: "Éxito",
          description: "Película eliminada de favoritos",
        });
      } else {
        await FavoriteService.addToFavorites(movie.movie_id);
        onFavoriteChange(true);
        toast({
          title: "Éxito",
          description: "Película agregada a favoritos",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar favoritos",
        variant: "destructive",
      });
    }
  };

  const handleTrailerClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/movies/${movie.movie_id}/videos`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener el trailer');
      }

      const video = await response.json();
      
      if (video && video.key) {
        setTrailerKey(video.key);
        setShowTrailer(true);
      } else {
        toast({
          title: "No disponible",
          description: "No se encontró un trailer para esta película",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el trailer",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleFavoriteClick}
            className={isFavorite ? 'text-yellow-400' : ''}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <span>{movie.release_date}</span>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Géneros</h2>
          <div className="flex flex-wrap gap-2">
            {movie.genres.split('|').map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-primary/10 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Descripción</h2>
          <p className="text-muted-foreground">{movie.overview}</p>
        </div>

        <Button className="w-full md:w-auto" onClick={handleTrailerClick}>
          <Play className="mr-2 h-4 w-4" />
          Ver trailer
        </Button>
      </div>

      {trailerKey && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          videoKey={trailerKey}
        />
      )}
    </>
  );
} 