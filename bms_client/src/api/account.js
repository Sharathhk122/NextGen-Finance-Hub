import api from './index';

export const accountAPI = {
  createAccount: (data) => api.post('/accounts', data),
  getUserAccounts: () => api.get('/accounts'),
  getAccountDetails: (accountNumber) => api.get(`/accounts/${accountNumber}`),
  deleteAccount: (accountNumber) => api.delete(`/accounts/${accountNumber}`),
};