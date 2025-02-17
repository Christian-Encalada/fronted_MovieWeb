import api from '@/lib/axios';

export interface FavoriteMovie {
  movie_id: number;
  user_id: number;
}

export const FavoriteService = {
  addToFavorites: async (movieId: number) => {
    return await api.post('/favorites', { movie_id: movieId });
  },

  removeFromFavorites: async (movieId: number) => {
    return await api.delete(`/favorites/${movieId}`);
  },

  getFavorites: async () => {
    return await api.get('/favorites');
  },

  isFavorite: async (movieId: number) => {
    return await api.get(`/favorites/${movieId}`);
  }
}; 