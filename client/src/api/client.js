import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lostloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and we had a token, remove it so stale sessions don't linger
      const hadToken = Boolean(localStorage.getItem('lostloop_token'));
      if (hadToken && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('lostloop_token');
        localStorage.removeItem('lostloop_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
