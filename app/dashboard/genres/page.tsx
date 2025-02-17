'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';
import { MovieCard } from '@/components/movie-card';

const ITEMS_PER_PAGE = 12;
const GENRES = [
  "Action", "Adventure", "Animation", "Children", "Comedy", "Crime",
  "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror", "Musical",
  "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Determinar si mostrar géneros o películas
  const items = selectedGenre ? movies : GENRES;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const loadMovies = async () => {
      if (!selectedGenre) return;
      
      setLoading(true);
      try {
        const { data } = await api.get<Movie[]>(`/movies/genre/${selectedGenre}`);
        setMovies(data);
        setCurrentPage(1); // Reset a la primera página al cambiar de género
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [selectedGenre]);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleBack = () => {
    setSelectedGenre(null);
    setMovies([]);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {selectedGenre ? (
        <>
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Volver a géneros
            </button>
            <h1 className="text-2xl font-bold">Películas de {selectedGenre}</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {(currentItems as Movie[]).map((movie) => (
              <MovieCard 
                key={movie.movie_id} 
                movie={movie}
                onFavoriteChange={() => {
                  // Opcional: Recargar las películas del género si es necesario
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Explorar por Género</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {(currentItems as string[]).map((genre) => (
              <Card 
                key={genre}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleGenreClick(genre)}
              >
                <CardHeader>
                  <CardTitle className="text-center">{genre}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 