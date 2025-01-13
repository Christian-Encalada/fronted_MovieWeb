'use client';

import { useState, useEffect } from 'react';
import { Movie, MovieService } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth-guard';

export default function TopRatedPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTopRatedMovies = async () => {
      try {
        const { data } = await MovieService.getTopRatedMovies();
        setMovies(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al cargar las películas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTopRatedMovies();
  }, [toast]);

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
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Películas Mejor Valoradas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Card key={movie.movie_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{movie.title}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg font-bold">{movie.rating.toFixed(1)}</span>
                  </div>
                </CardTitle>
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
      </div>
    </AuthGuard>
  );
}