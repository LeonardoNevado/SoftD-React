import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Serviços de livros
export const bookService = {
  getAll: (search = '') => api.get(`/books${search ? `?search=${search}` : ''}`),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

// Serviços de aluguel
export const rentalService = {
  rent: (data) => api.post('/rentals', data),
  return: (rentalId) => api.put(`/rentals/${rentalId}/return`),
  getUserRentals: (userId) => api.get(`/rentals/user/${userId}`),
};

export default api;