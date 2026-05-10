import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_WC_URL,
  auth: {
    username: import.meta.env.VITE_WC_KEY,
    password: import.meta.env.VITE_WC_SECRET,
  },
});

// Base WordPress URL
const wpBase = import.meta.env.VITE_WC_URL.replace('/wp-json/wc/v3', '');

// Products
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');

// Orders
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrder = (id) => api.get(`/orders/${id}`);

// M-Pesa STK Push
export const sendStkPush = (order_id, phone) =>
  axios.post(`${wpBase}/wp-json/juancogroup/v1/stk-push`, { order_id, phone });

// M-Pesa Payment Status
export const getPaymentStatus = (order_id) =>
  axios.get(`${wpBase}/wp-json/juancogroup/v1/payment-status/${order_id}`);

// Poll payment status until paid or timeout
export const pollPaymentStatus = (orderId, maxAttempts = 24, interval = 5000) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts++;
      try {
        const res = await getPaymentStatus(orderId);
        const { paid, status } = res.data;

        if (paid) {
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