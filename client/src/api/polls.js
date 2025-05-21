// client/src/api/polls.js
import axios from 'axios';
import { getCurrentUser } from './auth'; // Import getCurrentUser to get the token

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance for poll requests
const pollsApi = axios.create({
  baseURL: `${API_URL}/polls`,
});

// Interceptor to add the authorization token to requests
pollsApi.interceptors.request.use((config) => {
  const user = getCurrentUser(); // Get user data from localStorage
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- API Functions for Polls ---

// Create a new poll (Private)
export const createPoll = async (question, options) => {
  try {
    const response = await pollsApi.post('/', { question, options });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get all polls (Public)
export const getAllPolls = async () => {
  try {
    const response = await pollsApi.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get a single poll by ID (Public)
export const getPollById = async (id) => {
  try {
    const response = await pollsApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get polls created by the authenticated user (Private)
export const getMyPolls = async () => {
  try {
    const response = await pollsApi.get('/my-polls');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Vote on a poll (Public)
export const voteOnPoll = async (pollId, optionIndex) => {
  try {
    const response = await pollsApi.post(`/${pollId}/vote`, { optionIndex });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Add a new option to an existing poll (Private - owner only)
export const addOptionToPoll = async (pollId, newOptionText) => {
  try {
    const response = await pollsApi.put(`/${pollId}/add-option`, { newOptionText });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Delete a poll (Private - owner only)
export const deletePoll = async (pollId) => {
  try {
    const response = await pollsApi.delete(`/${pollId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};