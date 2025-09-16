// src/api/kyc.js
import api from './index';

export const kycAPI = {
  submitKYC: (formData) => api.post('/kyc/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getKYCStatus: () => api.get('/kyc/status'),
  
  // Admin endpoints
  getAllKYCSubmissions: () => api.get('/kyc/admin/submissions'),
  getKYCSubmissionsByStatus: (status) => api.get(`/kyc/admin/submissions/status/${status}`),
  getKYCById: (kycId) => api.get(`/kyc/admin/${kycId}`),
  updateKYCStatus: (kycId, data) => api.put(`/kyc/${kycId}/status`, data),
};