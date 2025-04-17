import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

// Create toast context
const ToastContext = createContext();

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(1);

  // Function to add a toast - using useCallback to prevent recreation on each render
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastIdCounter.current++;
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  // Function to remove a toast - using useCallback to prevent recreation on each render
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Helper functions for different toast types - using useCallback to prevent recreation
  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);

  // The context value
  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type}>
            <p>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)}>×</button>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Styled components for toast UI
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
`;

const Toast = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 4px;
  color: white;
  animation: slideIn 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#2196f3'; // info
    }
  }};
  
  p {
    margin: 0;
    flex-grow: 1;
  }
  
  button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`; 