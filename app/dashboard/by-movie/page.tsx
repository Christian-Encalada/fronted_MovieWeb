'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieService } from '@/services/movie.service';
import { Input } from '@/components/ui/input';
import { MovieCard } from '@/components/movie-card';

export default function ByMoviePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const searchMovies = async () => {
      const results = await MovieService.searchMoviesByTitle(searchTerm);
      setSearchResults(results);
      setShowResults(true);
    };

    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchMovies();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleMovieSelect = async (movie: Movie) => {
    setSelectedMovie(movie);
    setShowResults(false);
    setLoading(true);
    const similar = await MovieService.getSimilarMovies(movie.movie_id);
    setSimilarMovies(similar);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Buscar Películas Similares</h1>
      
      <div className="relative max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Buscar película..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((movie) => (
              <div
                key={movie.movie_id}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                onClick={() => handleMovieSelect(movie)}
              >
                {movie.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="mb-8">
            <MovieCard 
              movie={selectedMovie}
              onFavoriteChange={() => {
                // Opcional: Actualizar estado si es necesario
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Películas Similares</h2>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarMovies.map((movie) => (
                  <MovieCard 
                    key={movie.movie_id} 
                    movie={movie}
                    onFavoriteChange={() => {
                      // Opcional: Recargar las películas similares si es necesario
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}