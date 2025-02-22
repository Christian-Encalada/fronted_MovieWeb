import api from '@/lib/axios';
import { Movie } from './movie.service';

export const FavoriteService = {
  async getFavorites(skip?: number, limit?: number): Promise<Movie[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, user might not be authenticated');
        return [];
      }

      const params = new URLSearchParams();
      if (typeof skip === 'number' && skip >= 0) params.append('skip', skip.toString());
      if (typeof limit === 'number' && limit > 0) params.append('limit', limit.toString());

      // Corregimos la ruta según el Swagger
      const response = await api.get('/favorites/', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('Usuario no autorizado. Por favor, inicie sesión nuevamente.');
        // Opcional: redirigir al login
        window.location.href = '/login';
        return [];
      }
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async addToFavorites(movieId: number) {
    try {
      // Ruta según el Swagger: /favorites/{movie_id}
      const response = await api.post(`/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(movieId: number) {
    try {
      // Ruta según el Swagger: /favorites/{movie_id}
      const response = await api.delete(`/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  async checkFavorite(movieId: number) {
    try {
      // Ruta según el Swagger: /favorites/check/{movie_id}
      const response = await api.get(`/favorites/check/${movieId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  async clearFavorites(): Promise<boolean> {
    try {
      // Ruta según el Swagger: /favorites/
      await api.delete('/favorites/');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }
};