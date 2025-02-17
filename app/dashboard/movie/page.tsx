'use client';

import { useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { MovieCard } from '@/components/movie-card';

export default function MovieSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // Primero buscar la película
      const { data: movies } = await api.get<Movie[]>(`/movies/search?title=${searchTerm}`);
      if (movies.length > 0) {
        setMovie(movies[0]);
        // Luego obtener películas similares
        const { data: similar } = await api.get<Movie[]>(`/movies/${movies[0].movie_id}/similar`);
        setSimilarMovies(similar);
      } else {
        toast({
          title: "No encontrado",
          description: "No se encontró ninguna película con ese título",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al buscar la película",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Buscar Películas Similares</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar película..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </form>

        {movie && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MovieCard 
              movie={movie}
              onFavoriteChange={() => {
                // Opcional: Actualizar estado si es necesario
              }}
            />

            <h2 className="text-xl font-bold mb-4">Películas Similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarMovies.map((similar) => (
                <MovieCard 
                  key={similar.movie_id} 
                  movie={similar}
                  onFavoriteChange={() => {
                    // Opcional: Recargar las películas similares si es necesario
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 