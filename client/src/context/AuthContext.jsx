import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lostloop_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lostloop_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync session on initial app load
  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('lostloop_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('lostloop_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification expired or failed. Clearing token.');
          localStorage.removeItem('lostloop_token');
          localStorage.removeItem('lostloop_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('lostloop_token', receivedToken);
        localStorage.setItem('lostloop_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        toast.success(res.data.message || 'Logged in successfully!');
        return { success: true, user: receivedUser };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('lostloop_token', receivedToken);
        localStorage.setItem('lostloop_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        toast.success(res.data.message || 'Account created successfully!');
        return { success: true, user: receivedUser };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check form fields.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('lostloop_token');
    localStorage.removeItem('lostloop_user');
    setToken(null);
    setUser(null);
    toast.success('Signed out. See you next time!');
  };

  const updateUserProfile = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('lostloop_user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
