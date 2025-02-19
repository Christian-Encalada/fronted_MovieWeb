import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.apiUrl || 'https://fastapi-backend-fghrfmdeegdydydd.canadacentral-01.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Error en la petición:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;