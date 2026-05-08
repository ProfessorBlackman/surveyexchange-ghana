import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    // using set to safely apply headers in Axios >= 1.x
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;
