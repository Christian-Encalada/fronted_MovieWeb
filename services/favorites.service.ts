import axios from 'axios';
import { Movie } from './movie.service';

interface FavoritesResponse {
  favs: number[];
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const FavoritesService = {
  async getFavorites(): Promise<number[]> {
    try {
      const response = await api.get<FavoritesResponse>('/users/me/favorites');
      return response.data.favs || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  async addFavorite(movieId: number): Promise<boolean> {
    try {
      await api.post('/users/me/favorites', { movie_id: movieId });
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  async removeFavorite(movieId: number): Promise<boolean> {
    try {
      await api.delete(`/users/me/favorites/${movieId}`);
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }
};
