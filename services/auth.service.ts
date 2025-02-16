import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await api.post<LoginResponse>('/users/login', {
        username: credentials.username,
        password: credentials.password
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};
