// src/api/loan.js
import api from './index';

export const loanAPI = {
  // Loan application and management
  applyForLoan: (loanData) => api.post('/loans', loanData),
  getUserLoans: () => api.get('/loans'),
  getLoanDetails: (loanId) => api.get(`/loans/${loanId}`),
  getEMISchedule: (loanId) => api.get(`/loans/${loanId}/schedule`),
  payEMI: (loanId, data) => api.post(`/loans/${loanId}/pay-emi`, data),
  
  // Admin loan management
  getPendingLoans: () => api.get('/loans/pending'),
  getApprovedLoans: () => api.get('/loans?status=APPROVED'),
  approveLoan: (loanId) => api.post(`/loans/${loanId}/approve`),
  rejectLoan: (loanId, data) => api.post(`/loans/${loanId}/reject`, data, {
    params: { rejectionReason: data.reason }
  }),
  disburseLoan: (loanId) => api.post(`/loans/${loanId}/disburse`),
  
  // New methods for better loan management
  getAllLoans: (params) => api.get('/loans/all', { params }),
  getLoansByStatus: (status) => api.get(`/loans?status=${status}`),
  getLoanStatistics: () => api.get('/loans/statistics'),
};