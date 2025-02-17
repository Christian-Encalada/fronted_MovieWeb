import api from '@/lib/axios';

export interface Movie {
  [x: string]: any;
  movie_id: number;
  title: string;
  genres: string;
}

export const MovieService = {
  async getMovies(): Promise<Movie[]> {
    try {
      const response = await api.get<Movie[]>('/movies/');
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  },

  async getMovie(id: number): Promise<Movie | null> {
    try {
      const response = await api.get<Movie>(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      return null;
    }
  },

  async searchMoviesByTitle(term: string): Promise<Movie[]> {
    try {
      if (!term || term.trim().length < 1) return [];
      const response = await api.get<Movie[]>('/movies/search', {
        params: { term: term.trim() }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    try {
      const response = await api.get<Movie[]>(`/movies/${movieId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      return [];
    }
  },

  async getMoviesByGenre(genre: string): Promise<Movie[]> {
    try {
      const response = await api.get<Movie[]>(`/movies/genre/${genre}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  }
}; 