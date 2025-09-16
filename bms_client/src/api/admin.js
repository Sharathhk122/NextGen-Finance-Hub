// src/api/admin.js
import axios from 'axios';
import { authHeader } from './auth-header';

// Use environment variable with fallback for browser compatibility
const API_URL = window._env_?.REACT_APP_API_URL || 'https://backend-hk.onrender.com/api';

const adminAPI = {
  // Dashboard
  getDashboardStats: () => {
    return axios.get(`${API_URL}/admin/dashboard/stats`, {
      headers: authHeader()
    });
  },

  // Users
  getAllUsers: (params = {}) => {
    return axios.get(`${API_URL}/admin/users`, {
      headers: authHeader(),
      params
    });
  },

  getUserDetails: (userId) => {
    return axios.get(`${API_URL}/admin/users/${userId}`, {
      headers: authHeader()
    });
  },

  updateUserStatus: (userId, data) => {
    return axios.patch(`${API_URL}/admin/users/${userId}/status`, data, {
      headers: authHeader()
    });
  },

  // Transactions
  getAllTransactions: (params = {}) => {
    return axios.get(`${API_URL}/admin/transactions`, {
      headers: authHeader(),
      params
    });
  },

  // Analytics
  getRevenueAnalytics: (params = {}) => {
    return axios.get(`${API_URL}/admin/analytics/revenue`, {
      headers: authHeader(),
      params
    });
  },

  getCustomerGrowthAnalytics: (params = {}) => {
    return axios.get(`${API_URL}/admin/analytics/customer-growth`, {
      headers: authHeader(),
      params
    });
  },

  getRealTimeMetrics: () => {
    return axios.get(`${API_URL}/admin/analytics/real-time-metrics`, {
      headers: authHeader()
    });
  },

  // Reports
  generateTransactionReportPDF: (params = {}) => {
    return axios.get(`${API_URL}/admin/reports/transactions/pdf`, {
      headers: authHeader(),
      params,
      responseType: 'blob'
    });
  },

  generateTransactionReportExcel: (params = {}) => {
    return axios.get(`${API_URL}/admin/reports/transactions/excel`, {
      headers: authHeader(),
      params,
      responseType: 'blob'
    });
  },

  generateLoanReportPDF: (params = {}) => {
    return axios.get(`${API_URL}/admin/reports/loans/pdf`, {
      headers: authHeader(),
      params,
      responseType: 'blob'
    });
  },

  // Bulk Operations
  bulkUpdateAccountStatus: (accountNumbers, status) => {
    return axios.post(`${API_URL}/admin/bulk/accounts/status?status=${status}`, accountNumbers, {
      headers: authHeader()
    });
  },

  broadcastNotification: (message, userType = 'ALL') => {
    return axios.post(`${API_URL}/admin/notifications/broadcast?message=${encodeURIComponent(message)}&userType=${userType}`, {}, {
      headers: authHeader()
    });
  },

  // Audit Logs
  getAuditLogs: (params = {}) => {
    return axios.get(`${API_URL}/admin/audit-logs`, {
      headers: authHeader(),
      params
    });
  },

  // Loan Statistics
  getLoanStatistics: () => {
    return axios.get(`${API_URL}/admin/loans/stats`, {
      headers: authHeader()
    });
  }
};

export { adminAPI };