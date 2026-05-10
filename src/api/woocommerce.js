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

// Poll order status until paid or timeout
export const pollOrderStatus = (orderId, maxAttempts = 12, interval = 5000) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts++;
      try {
        const res = await getOrder(orderId);
        const status = res.data.status;
        if (status === 'processing' || status === 'completed') {
          clearInterval(timer);
          resolve(status);
        } else if (status === 'failed' || status === 'cancelled') {
          clearInterval(timer);
          reject(new Error('Payment failed or cancelled'));
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
          reject(new Error('Payment timeout'));
        }
      } catch (err) {
        clearInterval(timer);
        reject(err);
      }
    }, interval);
  });
};