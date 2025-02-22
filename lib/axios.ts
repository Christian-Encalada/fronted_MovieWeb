import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fastapi-backend-fghrfmdeegdydydd.canadacentral-01.azurewebsites.net';

// Asegurarnos de que la URL siempre use HTTPS
const secureApiUrl = API_URL.replace('http://', 'https://');

const api = axios.create({
  baseURL: secureApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  // Importante para CORS
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Asegurarnos de que todas las URLs usen HTTPS
  if (config.url && config.url.startsWith('http://')) {
    config.url = config.url.replace('http://', 'https://');
  }

  // Asegurarnos de que el token se envíe correctamente
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage');
  }

  // Log de la petición para debugging
  console.log('Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    params: config.params
  });

  return config;
}, (error) => {
  console.error('Error en la configuración de la petición:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          params: error.config.params
        }
      });

      if (error.response.status === 422) {
        console.error('Detalles de validación:', error.response.data);
      }
    } else if (error.request) {
      console.error('Error de petición:', error.request);
    } else {
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