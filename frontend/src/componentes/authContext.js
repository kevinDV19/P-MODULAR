import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userId, setUserId] = useState(null); // Estado para el user_id
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUserFirstName = localStorage.getItem('first_name');
    const storedUserId = localStorage.getItem('user_id'); // Obtener user_id del localStorage

    if (token) {
      setIsAuthenticated(true);
      setUserFirstName(storedUserFirstName);
      setUserId(storedUserId); // Establecer user_id
    }
  }, []);

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: localStorage.getItem('refreshToken'),
        }),
      });

      if (!response.ok) throw new Error('Error refreshing token');

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, options);

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          options.headers.Authorization = `Bearer ${newToken}`;
          return fetch(url, options);
        }
      }

      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const login = (firstName, userId) => {
    setIsAuthenticated(true);
    setUserFirstName(firstName);
    setUserId(userId); // Establecer user_id al iniciar sesión
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('first_name');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    setUserFirstName('');
    setUserId(null); // Limpiar user_id
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userFirstName, userId, fetchWithAuth, refreshToken, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
