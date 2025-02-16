import api from '@/lib/axios';
import { Movie } from './movie.service';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserFavorites {
  favs: number[];
}

interface FavoritesResponse {
  favs: number[];
}

export const UserService = {
  async getFavorites(): Promise<UserFavorites> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get<FavoritesResponse>('/users/favorites');
      return response.data;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return { favs: [] };
    }
  },

  async addToFavorites(movieId: number): Promise<UserFavorites> {
    try {
      const response = await api.post<FavoritesResponse>('/users/favorites', {
        movie_id: movieId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(movieId: number): Promise<UserFavorites> {
    try {
      const response = await api.delete<FavoritesResponse>(`/users/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  async getRecommendedMovies(): Promise<Movie[]> {
    try {
      const response = await api.get<Movie[]>('/recommendations/user');
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await api.post('/users/register', data);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
};