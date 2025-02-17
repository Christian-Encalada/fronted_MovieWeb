'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/services/movie.service';
import { MovieCard } from '@/components/movie-card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ByMoviePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const router = useRouter();

  useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedSearch) {
        setMovies([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/movies/search?term=${encodeURIComponent(debouncedSearch)}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        setMovies(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedSearch]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/dashboard/movie/${movieId}`);
    setShowSuggestions(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Buscar Películas Similares</h1>
      
      {/* Buscador con sugerencias */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Buscar películas..."
            className="pl-10 h-12 bg-background border-primary/20 focus:border-primary transition-colors duration-200
                     dark:bg-gray-800/50 dark:focus:bg-gray-800/80 backdrop-blur-sm
                     rounded-lg text-lg shadow-sm"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Lista de sugerencias */}
        {showSuggestions && searchTerm && movies.length > 0 && (
          <Card className="absolute w-full mt-2 p-2 shadow-lg bg-background/80 backdrop-blur-sm 
                        dark:bg-gray-800/90 border border-border/50 rounded-lg z-50">
            <div className="max-h-[60vh] overflow-y-auto">
              {movies.map((movie) => (
                <div
                  key={movie.movie_id}
                  className="flex items-center gap-3 p-2 hover:bg-primary/5 rounded-md cursor-pointer transition-colors"
                  onClick={() => handleMovieClick(movie.movie_id)}
                >
                  <div className="relative h-16 w-12 flex-shrink-0">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/placeholder-movie.jpg'}
                      alt={movie.title}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground line-clamp-1">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {movie.genres.split('|').join(', ')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                      <span className="text-xs text-yellow-400 flex items-center gap-1">
                        ★ {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {!loading && searchTerm && movies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            No se encontraron películas que coincidan con tu búsqueda
          </p>
        </div>
      )}

      {/* Mensaje inicial */}
      {!loading && !searchTerm && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            Escribe el nombre de una película para comenzar a buscar
          </p>
        </div>
      )}
    </div>
  );
}