import axios from 'axios';
import API_BASE_URL from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (email, password, full_name) =>
    api.post('/api/auth/register', { email, password, full_name }),
  
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/api/auth/me'),
};

// Document API
export const documentAPI = {
  formatDocument: (file, documentType, university) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('university', university);
    
    return api.post('/format-docx/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
  },
  
  getHistory: () =>
    api.get('/api/history'),
  
  getTemplates: () =>
    api.get('/api/templates'),
};

// AI API
export const aiAPI = {
  proofread: (text, language = 'id', style = null) =>
    api.post('/api/ai/proofread', { text, language, style }),
};

export default api;
