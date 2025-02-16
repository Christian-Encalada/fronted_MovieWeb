'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/services/movie.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FavoritesService } from '@/services/favorites.service';
import { MovieService } from '@/services/movie.service';
import { FavoriteButton } from '@/components/ui/favorite-button';
import Link from 'next/link';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 12;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        // Get favorite movie IDs
        const favoriteIds = await FavoritesService.getFavorites();
        
        // Fetch movie details for each ID
        const moviePromises = favoriteIds.map(id => MovieService.getMovie(id));
        const movies = await Promise.all(moviePromises);
        
        // Filter out any null results and set movies
        setFavorites(movies.filter((movie): movie is Movie => movie !== null));
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes películas favoritas aún.</p>
          <Link href="/dashboard" className="text-blue-500 hover:underline mt-2 inline-block">
            Explorar películas
          </Link>
        </div>
      </div>
    );
  }

  // Calcular películas para la página actual
  const indexOfLastMovie = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMovie = indexOfLastMovie - ITEMS_PER_PAGE;
  const currentFavorites = favorites.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteRemoved = (movieId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(movie => movie.movie_id !== movieId)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {currentFavorites.map((movie) => (
          <Link href={`/dashboard/movie/${movie.movie_id}`} key={movie.movie_id}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer relative">
              <FavoriteButton 
                movieId={movie.movie_id} 
                initialState={true}
                onRemove={() => handleFavoriteRemoved(movie.movie_id)}
              />
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{movie.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {movie.genres.split('|').map((genre, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-700"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}