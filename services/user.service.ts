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

interface UpdateProfileData {
  username?: string;
  email?: string;
}

interface UpdatePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const UserService = {
  async getFavorites() {
    try {
      const response = await api.get<UserFavorites>('/users/favorites');
      return response.data;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return { user_id: 0, favs: [] };
    }
  },

  async checkFavorite(movieId: number) {
    try {
      const response = await api.get(`/users/favorites/${movieId}/check`);
      return response.data;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  async addToFavorites(movieId: number) {
    try {
      const response = await api.post(`/users/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(movieId: number) {
    try {
      const response = await api.delete(`/users/favorites/${movieId}`);
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
    const response = await api.post('/users/register', data);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    return await api.put('/users/profile', data);
  },

  updatePassword: async (data: UpdatePasswordData) => {
    try {
      const response = await api.put('/users/password', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Error al actualizar la contraseña';
      throw new Error(message);
    }
  },

  getProfile: async () => {
    return await api.get('/users/profile');
  }
}; 