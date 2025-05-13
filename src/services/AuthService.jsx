import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common.Authorization;
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AuthService = {
  async register(username, email, password) {
    try {
      const response = await api.post('/register', { username, email, password });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.success) {
        this.setAuthToken(response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common.Authorization;
  },

  isAuthenticated() {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getCurrentUser() {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  },

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  getAuthToken() {
    return localStorage.getItem('authToken');
  },

  handleError(error) {
    console.error('AuthService Error:', error);
    return {
      message: error.response?.data?.message || 'Une erreur est survenue',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export default AuthService;