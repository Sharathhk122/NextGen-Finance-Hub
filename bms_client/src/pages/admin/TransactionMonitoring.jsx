// src/pages/admin/TransactionMonitoring.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: ''
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10
      };
      
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = filters.type;

      const response = await adminAPI.getAllTransactions(params);
      
      // Handle Spring Boot pagination response structure
      let transactionsData = [];
      let totalPagesData = 0;
      
      if (response.data && response.data.content) {
        transactionsData = response.data.content;
        totalPagesData = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        transactionsData = response.data;
        totalPagesData = 1;
      } else {
        transactionsData = [];
        totalPagesData = 1;
      }
      
      setTransactions(transactionsData);
      setTotalPages(totalPagesData);
    } catch (err) {
      setError('Failed to fetch transactions. Please check your admin privileges.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setPage(0); // Reset to first page when filters change
    fetchTransactions();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'bg-green-100 text-green-800';
      case 'WITHDRAWAL': return 'bg-red-100 text-red-800';
      case 'TRANSFER_IN': return 'bg-blue-100 text-blue-800';
      case 'TRANSFER_OUT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction Monitoring</h1>
        <button
          onClick={fetchTransactions}
          className="bg-blue-500 text-red px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-red p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER_IN">Transfer In</option>
              <option value="TRANSFER_OUT">Transfer Out</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 text-red-800  px-4 py-2 rounded hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-red-800  rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="bg-red-800  divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 red-800 space-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.description || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 red-800 space-nowrap text-sm text-gray-500">
                  {transaction.accountNumber || 'N/A'}
                </td>
                <td className="px-6 py-4 red-800 space-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 red-800 space-nowrap text-sm text-gray-900">
                  ₹{transaction.amount ? transaction.amount.toLocaleString('en-IN') : '0'}
                </td>
                <td className="px-6 py-4 red-800 space-nowrap text-sm text-gray-500">
                  {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A'}
                </td>
                <td className="px-6 py-4 red-800 space-nowrap text-sm text-gray-500">
                  {transaction.referenceNumber || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {transactions.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      )}
      
    </div>
  );
};

export default TransactionMonitoring;