// src/api/transaction.js
import api from './index';

export const transactionAPI = {
  deposit: (data) => api.post('/transactions/deposit', data),
  withdraw: (data) => api.post('/transactions/withdraw', data),
  transfer: (data) => api.post('/transactions/transfer', data),
  getTransactionHistory: (accountNumber) => api.get(`/transactions/history/${accountNumber}`),
  getTransactionHistoryBetweenDates: (accountNumber, startDate, endDate) => 
    api.get(`/transactions/history/${accountNumber}/filter?startDate=${startDate}&endDate=${endDate}`),
};