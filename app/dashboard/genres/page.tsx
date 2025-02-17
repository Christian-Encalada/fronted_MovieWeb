'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { MovieCard } from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const GENRES = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" },
  { id: 99, name: "Documental" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" },
  { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ciencia ficción" },
  { id: 53, name: "Suspense" },
  { id: 10752, name: "Bélica" },
  { id: 37, name: "Western" }
];

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState<{ id: number; name: string } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const moviesPerPage = 10;

  const loadMoviesByGenre = async (genreId: number, page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/movies/genre/${genreId}?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar películas');
      }

      const movies = await response.json();
      setMovies(movies);
      // Asumimos 20 películas por página de TMDB
      setTotalPages(Math.ceil(100 / moviesPerPage)); // Por ahora hardcodeamos 100 películas total
      setCurrentPage(page);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las películas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = (genre: typeof GENRES[0]) => {
    setSelectedGenre(genre);
    setMovies([]);
    setCurrentPage(1);
    loadMoviesByGenre(genre.id, 1);
  };

  const handlePageChange = (page: number) => {
    if (selectedGenre && !loading) {
      setCurrentPage(page);
      loadMoviesByGenre(selectedGenre.id, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para generar el rango de páginas a mostrar
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  // Renderizar la lista de géneros
  if (!selectedGenre) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Explorar por Género</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {GENRES.map((genre) => (
            <Card 
              key={genre.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleGenreSelect(genre)}
            >
              <CardHeader>
                <CardTitle className="text-center text-base">{genre.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar las películas del género seleccionado
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedGenre(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a géneros
        </Button>
        <h1 className="text-2xl font-bold">Películas de {selectedGenre.name}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.movie_id} 
                movie={movie}
                variant="compact"
              />
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Anterior
            </Button>

            {getPageRange().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                disabled={loading}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 