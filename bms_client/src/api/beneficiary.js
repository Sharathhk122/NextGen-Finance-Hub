import api from './index';

export const beneficiaryAPI = {
  addBeneficiary: (data) => api.post('/beneficiaries', data),
  getUserBeneficiaries: () => api.get('/beneficiaries'),
  getBeneficiaryDetails: (id) => api.get(`/beneficiaries/${id}`),
  deleteBeneficiary: (id) => api.delete(`/beneficiaries/${id}`),
};