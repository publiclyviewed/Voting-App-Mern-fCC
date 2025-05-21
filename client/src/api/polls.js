// client/src/api/polls.js
import axios from 'axios';
import { getCurrentUser } from './auth'; // Import getCurrentUser to get the token

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance for poll requests
const pollsApi = axios.create({
  baseURL: API_URL, // CHANGE: Use API_URL directly, it now already contains '/api'
  withCredentials: true, // ADD THIS: Crucial for sending cookies/auth headers with cross-origin requests
});

// Interceptor to add the authorization token to requests (already good)
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
    // CHANGE: The full path is now /api/polls/, so here it's just /polls
    const response = await pollsApi.post('/polls', { question, options });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get all polls (Public)
export const getAllPolls = async () => {
  try {
    // CHANGE: The full path is now /api/polls/, so here it's just /polls
    const response = await pollsApi.get('/polls');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get a single poll by ID (Public)
export const getPollById = async (id) => {
  try {
    // CHANGE: The full path is now /api/polls/:id, so here it's just /polls/:id
    const response = await pollsApi.get(`/polls/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get polls created by the authenticated user (Private)
export const getMyPolls = async () => {
  try {
    // CHANGE: The full path is now /api/polls/my-polls, so here it's just /polls/my-polls
    const response = await pollsApi.get('/polls/my-polls');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Vote on a poll (Public)
export const voteOnPoll = async (pollId, optionIndex) => {
  try {
    // CHANGE: The full path is now /api/polls/:pollId/vote, so here it's just /polls/:pollId/vote
    const response = await pollsApi.post(`/polls/${pollId}/vote`, { optionIndex });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Add a new option to an existing poll (Private - owner only)
export const addOptionToPoll = async (pollId, newOptionText) => {
  try {
    // CHANGE: The full path is now /api/polls/:pollId/add-option, so here it's just /polls/:pollId/add-option
    const response = await pollsApi.put(`/polls/${pollId}/add-option`, { newOptionText });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Delete a poll (Private - owner only)
export const deletePoll = async (pollId) => {
  try {
    // CHANGE: The full path is now /api/polls/:pollId, so here it's just /polls/:pollId
    const response = await pollsApi.delete(`/polls/${pollId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};