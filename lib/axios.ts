import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi-backend-fghrfmdeegdydydd.canadacentral-01.azurewebsites.net';

// Asegurarnos de que la URL siempre use HTTPS
const secureApiUrl = API_URL.replace('http://', 'https://');

const api = axios.create({
  baseURL: `${secureApiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Agregar timeout para evitar peticiones infinitas
  timeout: 10000,
  // Comentamos temporalmente para probar
  // withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Asegurarnos de que todas las URLs usen HTTPS
  if (config.url && config.url.startsWith('http://')) {
    config.url = config.url.replace('http://', 'https://');
  }
  return config;
}, (error) => {
  console.error('Error en la configuración de la petición:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Mejorar el logging de errores
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
    } else {
      // Algo sucedió en la configuración de la petición
      console.error('Error:', error.message);
    }

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Manejar errores de CORS o Mixed Content
    if (error.message?.includes('Mixed Content') || error.message?.includes('CORS')) {
      console.error('Error de CORS o Mixed Content. Asegúrate de usar HTTPS.');
    }

    return Promise.reject(error);
  }
);

export default api;