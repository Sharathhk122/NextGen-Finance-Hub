// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const validateToken = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://bmsp-back.onrender.com/api/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          email: data.username,
          roles: data.roles
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://bmsp-back.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token: newToken, roles, username, id } = data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({
          id,
          email: username,
          roles
        });
        return { success: true, roles };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const registerCustomer = async (userData) => {
    try {
      const response = await fetch('https://bmsp-back.onrender.com/api/auth/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { status: 'error', message: 'Registration failed. Please try again.' };
    }
  };

  const registerAdmin = async (userData) => {
    try {
      const response = await fetch('https://bmsp-back.onrender.com/api/auth/register/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { status: 'error', message: 'Registration failed. Please try again.' };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await fetch('https://bmsp-back.onrender.com/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      return { status: 'error', message: 'Email verification failed.' };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await fetch(`https://bmsp-back.onrender.com/api/auth/resend-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { status: 'error', message: 'Failed to resend OTP.' };
    }
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN');
  };

  const isCustomer = () => {
    return user?.roles?.includes('ROLE_CUSTOMER');
  };

  const value = {
    user,
    token,
    loading,
    login,
    registerCustomer,
    registerAdmin,
    verifyEmail,
    resendOTP,
    logout,
    isAdmin,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
