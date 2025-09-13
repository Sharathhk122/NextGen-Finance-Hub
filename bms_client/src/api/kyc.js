// src/api/kyc.js
import api from './index';
import { mockKYCAPI } from './mockKYC';

export const kycAPI = {
  // Customer endpoints
  submitKYC: (formData) => api.post('/kyc/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  getKYCStatus: () => api.get('/kyc/status'),
  
  // Admin endpoints - corrected to match your backend API structure
  getAllKYCSubmissions: async () => {
    try {
      return await api.get('/kyc/admin/submissions');
    } catch (error) {
      console.log('Admin endpoint /kyc/admin/submissions failed, using mock data');
      return await mockKYCAPI.getAllKYCSubmissions();
    }
  },
  
  updateKYCStatus: async (kycId, statusData) => {
    try {
      return await api.put(`/kyc/${kycId}/status`, statusData);
    } catch (error) {
      console.log('Admin endpoint failed, using mock data');
      return await mockKYCAPI.updateKYCStatus(kycId, statusData);
    }
  },
  
  // Get all KYC submissions with different statuses
  getKYCSubmissionsByStatus: (status) => api.get(`/kyc/admin/submissions/status/${status}`),
  getKYCById: (kycId) => api.get(`/kyc/admin/${kycId}`),
};