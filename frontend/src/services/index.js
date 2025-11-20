import api from './api';

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Dashboard endpoints
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats')
};

// Supplier endpoints
export const supplierService = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`)
};

// User endpoints
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  deactivate: (id) => api.put(`/users/${id}/deactivate`),
  resetPassword: (id, newPassword) => api.put(`/users/${id}/reset-password`, { newPassword }),
  delete: (id) => api.delete(`/users/${id}`)
};

// Product endpoints
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBestsellers: () => api.get('/products/bestsellers/list'),
  getCategories: () => api.get('/products/categories/list'),
  getByCategory: (categoryName) => api.get(`/products/category/${categoryName}`),
  getCollections: () => api.get('/products/collections/list'),
  getByCollection: (collectionName) => api.get(`/products/collection/${collectionName}`),
  getByOccasion: (occasionName) => api.get(`/products/occasion/${occasionName}`),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`)
};

// Order endpoints
export const orderService = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`)
};
