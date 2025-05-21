// client/src/api/auth.js
import axios from 'axios';

// Get the base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with a base URL
const authApi = axios.create({
  baseURL: `${API_URL}/auth`, // All auth requests will go to http://localhost:5000/api/auth
});

// Register User
export const register = async (username, password) => {
  try {
    const response = await authApi.post('/register', { username, password });
    // Store user data and token in localStorage (or sessionStorage)
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

// Login User
export const login = async (username, password) => {
  try {
    const response = await authApi.post('/login', { username, password });
    // Store user data and token in localStorage (or sessionStorage)
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
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