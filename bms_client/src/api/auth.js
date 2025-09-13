// src/api/auth.js
import api from './index';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerCustomer: (userData) => api.post('/auth/register/customer', userData),
  registerAdmin: (userData) => api.post('/auth/register/admin', userData),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOTP: (email) => api.post('/auth/resend-otp', null, { params: { email } }),
  validateToken: () => api.get('/auth/validate', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }),
};