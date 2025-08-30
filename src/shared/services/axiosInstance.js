import axios from 'axios';
import { getLocalAccessToken, removeLocalAccessToken } from '../helpers/authHelpers';
import { deleteCookie } from '../helpers/cookies';

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://staging.api.majikgift.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for setting Authorization and custom headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const isNgrokURL = config.baseURL.includes('ngrok');
    if (isNgrokURL) {
      config.headers['ngrok-skip-browser-warning'] = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/// for refresh token functionality
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Handle token expiration (401 error)
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const newAccessToken = await handleTokenRefresh(); // Custom function to refresh the token
//             if (newAccessToken) {
//                 axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return axiosInstance(originalRequest);
//             }
//         }

//         // Log and handle the error globally
//         console.error('API call failed:', error.response || error.message);
//         return Promise.reject(error.response?.data || error.message);
//     }
// );
/// for refresh token functionality

// Response interceptor to handle errors globally

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 error)
    if (error.response?.status === 401) {
      await deleteCookie();
      removeLocalAccessToken();
      window.location.href = '/login';
    }

    // Log and handle the error globally
    console.error('API call failed:', error.response || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
