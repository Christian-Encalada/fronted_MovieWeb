'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieService } from '@/services/movie.service';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <div className="relative">
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
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{selectedMovie.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{selectedMovie.genres}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMovie.genres.split('|').map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-sm">
                    {genre.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-bold mb-4">Películas Similares</h2>
            {loading ? (
              <div>Cargando recomendaciones...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {similarMovies.map((movie) => (
                  <Card key={movie.movie_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">{movie.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">{movie.genres}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.split('|').map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-sm">
                            {genre.trim()}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}