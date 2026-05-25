import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('inkline_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('inkline_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('inkline_token')));

  const persistSession = useCallback((payload) => {
    localStorage.setItem('inkline_token', payload.token);
    localStorage.setItem('inkline_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('inkline_token');
    localStorage.removeItem('inkline_user');
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('inkline_token')) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      localStorage.setItem('inkline_user', JSON.stringify(response.data.user));
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async ({ email, password, admin = false }) => {
      const response = await api.post(admin ? '/auth/admin/login' : '/auth/login', { email, password });
      persistSession(response.data);
      toast.success(`Welcome back, ${response.data.user.name}`);
      return response.data.user;
    },
    [persistSession]
  );

  const signup = useCallback(
    async (payload) => {
      const response = await api.post('/auth/signup', payload);
      persistSession(response.data);
      toast.success('Account created');
      return response.data.user;
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } finally {
      clearSession();
      toast.success('Signed out');
    }
  }, [clearSession, token]);

  const updateCachedUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem('inkline_user', JSON.stringify(nextUser));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
      refresh,
      setUser: updateCachedUser
    }),
    [loading, login, logout, refresh, signup, token, updateCachedUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
