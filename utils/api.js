import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const fetchProducts = async () => {
  return await api.get('/products');
};

export const createProduct = async (data) => {
  return await api.post('/products', data);
};

export const updateProduct = async (id, data) => {
  return await api.put(`/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};
export const fetchUserProfile = () => api.get('/auth/profile');