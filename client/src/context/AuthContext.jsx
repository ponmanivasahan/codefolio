import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cf_token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (t) => {
    if (!t) { setLoading(false); return; }
    try {
      const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${t}` } });
      setUser(res.data.data);
    } catch {
      setToken(null);
      localStorage.removeItem('cf_token');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMe(token); }, [token, fetchMe]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('cf_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('cf_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('cf_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => fetchMe(token);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
