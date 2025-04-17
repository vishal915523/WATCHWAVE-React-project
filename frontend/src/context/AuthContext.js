import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5001/api/user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const initAuth = () => {
      try {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (user && token) {
          setCurrentUser(JSON.parse(user));
          // Set auth token for axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
        
        setIsAuthReady(true);
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register user
  const register = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store in localStorage and set auth headers in one operation
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Single state update
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Registration failed';
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store in localStorage and set auth headers in one operation
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Single state update
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Login failed';
      setError(errorMessage);
      throw error;
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear current user
    setCurrentUser(null);
    
    // Clear axios auth header
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return currentUser?.isAdmin === true;
  }, [currentUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    isAuthReady,
    register,
    login,
    logout,
    isAdmin,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 