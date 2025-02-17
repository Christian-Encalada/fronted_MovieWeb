import api from '@/lib/axios';
import { Movie } from './movie.service';

export const FavoriteService = {
  async getFavorites(): Promise<Movie[]> {
    try {
      const response = await api.get<Movie[]>('/favorites');
      return response.data;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async addToFavorites(movieId: number) {
    try {
      const response = await api.post(`/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(movieId: number) {
    try {
      const response = await api.delete(`/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  async checkFavorite(movieId: number) {
    try {
      const response = await api.get(`/favorites/check/${movieId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  async clearFavorites(): Promise<boolean> {
    try {
      await api.delete('/favorites');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }
}; 