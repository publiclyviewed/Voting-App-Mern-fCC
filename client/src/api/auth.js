// client/src/api/auth.js
import axios from 'axios';

// Get the base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with a base URL
const authApi = axios.create({
  baseURL: API_URL, // CHANGE: Use API_URL directly, it now already contains '/api'
  withCredentials: true, // ADD THIS: Crucial for sending cookies/auth headers with cross-origin requests
});

// Interceptor to add the authorization token to requests (already good)
authApi.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register User
export const register = async (username, password) => {
  try {
    // CHANGE: The full path is now /api/auth/register, so here it's just /auth/register
    const response = await authApi.post('/auth/register', { username, password });
    // Store user data and token in localStorage (or sessionStorage)
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message; // Use optional chaining for response.data
  }
};

// Login User
export const login = async (username, password) => {
  try {
    // CHANGE: The full path is now /api/auth/login, so here it's just /auth/login
    const response = await authApi.post('/auth/login', { username, password });
    // Store user data and token in localStorage (or sessionStorage)
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message; // Use optional chaining for response.data
  }
};

// Logout User
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};