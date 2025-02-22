import axios from 'axios';
import { Movie } from './movie.service';

const API_URL = 'https://fastapi-backend-fghrfmdeegdydydd.canadacentral-01.azurewebsites.net/';

export const FavoriteService = {
  async getFavorites(skip?: number, limit?: number): Promise<Movie[]> {
    try {
      const params = new URLSearchParams();
      if (skip !== undefined) params.append('skip', skip.toString());
      if (limit !== undefined) params.append('limit', limit.toString());

      const response = await axios.get(`${API_URL}/favorites/favorites`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async addToFavorites(movieId: number) {
    try {
      const response = await axios.post(`${API_URL}/favorites/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(movieId: number) {
    try {
      const response = await axios.delete(`${API_URL}/favorites/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  async checkFavorite(movieId: number) {
    try {
      const response = await axios.get(`${API_URL}/favorites/favorites/check/${movieId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  async clearFavorites(): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/favorites/favorites/`);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }
}; 