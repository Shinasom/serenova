import axios from 'axios';

// 1. Create the instance
export const api = axios.create({ // <--- CHANGED: export const
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    // Check if running in browser to avoid server-side errors
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Handle Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);