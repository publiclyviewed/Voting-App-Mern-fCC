// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { register, login, logout, getCurrentUser } from '../api/auth';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To track if user is being loaded

  // Check for user in localStorage on initial load
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false); // Finished loading user status
  }, []);

  // Authentication functions
  const handleRegister = async (username, password) => {
    try {
      const userData = await register(username, password);
      setCurrentUser(userData);
      return userData; // Return user data on success
    } catch (error) {
      console.error("Registration error:", error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const userData = await login(username, password);
      setCurrentUser(userData);
      return userData; // Return user data on success
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children} {/* Only render children once loading is complete */}
    </AuthContext.Provider>
  );
};