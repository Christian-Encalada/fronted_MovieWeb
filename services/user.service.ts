import api from '@/lib/axios';
import { Movie } from './movie.service';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserFavorites {
  user_id: number;
  favs: number[];
}

export const UserService = {
  async getFavorites() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get<UserFavorites>('/users/favorites');
      return response.data;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return { user_id: 0, favs: [] };
    }
  },

  async addToFavorites(movieId: number) {
    const response = await api.post('/users/favorites', { movie_id: movieId });
    return response.data;
  },

  async removeFromFavorites(movieId: number) {
    const response = await api.delete(`/users/favorites/${movieId}`);
    return response.data;
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
    const response = await api.post('/users/register', data);
    return response.data;
  }
}; 