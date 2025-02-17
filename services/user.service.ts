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
  },

  updateProfile: async (data: UpdateProfileData) => {
    return await api.put('/users/profile', data);
  },

  updatePassword: async (data: UpdatePasswordData) => {
    try {
      const response = await api.put('/users/password', {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      });
      
      if (response.data.message) {
        return response.data;
      }
      throw new Error('Respuesta inválida del servidor');
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Error al actualizar la contraseña');
    }
  },

  getProfile: async () => {
    return await api.get('/users/profile');
  }
}; 