// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import api from '@/lib/axios';

const ITEMS_PER_PAGE = 12;

export default function DashboardPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular películas para la página actual
  const indexOfLastMovie = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMovie = indexOfLastMovie - ITEMS_PER_PAGE;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const { data } = await api.get<Movie[]>('/movies');
        setMovies(data);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando películas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Películas Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {currentMovies.map((movie) => (
          <Card key={movie.movie_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {movie.genres.split('|').join(', ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}