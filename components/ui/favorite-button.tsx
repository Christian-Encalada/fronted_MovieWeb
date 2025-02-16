import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from './button';
import { UserService } from '@/services/user.service';
import { AuthService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  movieId: number;
  initialState?: boolean;
  onRemove?: () => void;
  movieTitle?: string;
}

export function FavoriteButton({ 
  movieId, 
  initialState = false, 
  onRemove,
  movieTitle = 'la película'
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!AuthService.isAuthenticated()) {
        return;
      }

      try {
        const favorites = await UserService.getFavorites();
        setIsFavorite(favorites.favs.includes(movieId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (!initialState) {
      checkFavoriteStatus();
    }
  }, [movieId, initialState]);

  const toggleFavorite = async () => {
    if (!AuthService.isAuthenticated()) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para guardar películas en favoritos",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/login')}
          >
            Iniciar Sesión
          </Button>
        ),
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await UserService.removeFromFavorites(movieId);
        onRemove?.();
        toast({
          description: `${movieTitle} ha sido eliminada de tus favoritos`,
        });
      } else {
        await UserService.addToFavorites(movieId);
        toast({
          title: "¡Añadida a favoritos!",
          description: `${movieTitle} ha sido añadida a tus favoritos. ¿Quieres ver tu lista completa?`,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/favorites')}
            >
              Ver Favoritos
            </Button>
          ),
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar tu solicitud. Por favor, inicia sesión e intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-2 right-2 z-10 hover:bg-background/80 ${
        isFavorite ? 'text-yellow-400' : 'text-gray-400'
      }`}
      onClick={(e) => {
        e.preventDefault(); // Prevenir la navegación del Link padre
        toggleFavorite();
      }}
      disabled={isLoading}
    >
      <Star
        className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`}
      />
    </Button>
  );
}
