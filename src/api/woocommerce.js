import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_WC_URL,
  auth: {
    username: import.meta.env.VITE_WC_KEY,
    password: import.meta.env.VITE_WC_SECRET,
  },
});

// Products
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');

// Orders
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrder = (id) => api.get(`/orders/${id}`);