import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, me } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // try to load current user if token exists
  async function bootstrapUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await me();
      // adapt to your backend response shape (data.user or data)
      setUser(data.user || data);
    } catch (err) {
      console.error('bootstrap error', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrapUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      // set user from response immediately (avoids depending on /auth/me)
      setUser(data.user || data);
    }
    return data;
  };

  const register = async (payload) => {
    const { data } = await apiRegister(payload);
    if (data.token) {
      localStorage.setItem('token', data.token);
      // set user from response immediately
      setUser(data.user || data);
    }
    return data;
  };


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
