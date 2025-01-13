'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axios';

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        // Cargar película principal
        const { data: movieData } = await api.get<Movie>(`/movies/${params.id}`);
        setMovie(movieData);

        // Cargar películas similares
        const { data: similarData } = await api.get<Movie[]>(`/movies/${params.id}/similar`);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Error loading movie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando película...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center">Película no encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{movie.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.split('|').map((genre) => (
              <Badge key={genre} variant="secondary" className="text-sm">
                {genre.trim()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Películas Similares</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {similarMovies.map((similar) => (
          <Card key={similar.movie_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{similar.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {similar.genres.split('|').map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 