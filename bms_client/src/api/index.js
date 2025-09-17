// src/api/index.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bmsp-back.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export const kycAPI = {
  submitKYC: (kycData) => api.post('/kyc', kycData),
  getKYCStatus: () => api.get('/kyc/status'),
  getAllKYCSubmissions: () => api.get('/admin/kyc'),
  approveKYC: (kycId) => api.put(`/admin/kyc/${kycId}/approve`),
  rejectKYC: (kycId, data) => api.put(`/admin/kyc/${kycId}/reject`, data),
};

export const accountAPI = {
  getAccountDetails: () => api.get('/accounts'),
  createAccount: (accountData) => api.post('/accounts', accountData),
  getTransactions: (params) => api.get('/accounts/transactions', { params }),
  transferFunds: (transferData) => api.post('/accounts/transfer', transferData),
  getUserAccounts: () => api.get('/accounts/user'),
};

export const loanAPI = {
  // Loan application and management
  applyForLoan: (loanData) => api.post('/loans', loanData),
  getUserLoans: () => api.get('/loans'),
  getLoanDetails: (loanId) => api.get(`/loans/${loanId}`),
  getEMISchedule: (loanId) => api.get(`/loans/${loanId}/emi-schedule`),
  payEMI: (loanId, data) => api.post(`/loans/${loanId}/pay-emi`, data),
  
  // Admin loan management
  getPendingLoans: () => api.get('/admin/loans/pending'),
  approveLoan: (loanId) => api.put(`/admin/loans/${loanId}/approve`),
  disburseLoan: (loanId) => api.post(`/admin/loans/${loanId}/disburse`),
  rejectLoan: (loanId, reason) => api.put(`/admin/loans/${loanId}/reject`, { reason }),
  getAllLoans: (params) => api.get('/admin/loans', { params }),
};

export default api;
