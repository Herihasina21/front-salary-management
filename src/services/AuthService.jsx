import { jwtDecode } from 'jwt-decode';

import api from './Api.jsx';
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
        // Stockez le username si la réponse le contient
        if (response.data.data.username) {
          localStorage.setItem('username', response.data.data.username);
        }
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      delete api.defaults.headers.common.Authorization;
    }
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
    if (!token) {
      console.log("Aucun token trouvé");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Token décodé:", decoded); // Vérifiez ici
      return {
        ...decoded,
         email: decoded.sub 
      };
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
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
