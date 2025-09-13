// src/pages/admin/Reports.jsx
import React, { useState } from 'react';
import { adminAPI } from '../../api/admin';
import { useAuth } from '../../hooks/useAuth';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('transactions');
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDateChange = (key, value) => {
    setDateRange(prev => ({ ...prev, [key]: value }));
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let response;
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };

      // Determine which API to call based on report type and format
      if (reportType === 'transactions') {
        if (format === 'pdf') {
          response = await adminAPI.generateTransactionReportPDF(params);
        } else if (format === 'excel') {
          response = await adminAPI.generateTransactionReportExcel(params);
        } else {
          setError('CSV format not yet supported for transactions');
          setLoading(false);
          return;
        }
      } else if (reportType === 'loans') {
        if (format === 'pdf') {
          response = await adminAPI.generateLoanReportPDF(params);
        } else {
          setError('Only PDF format is supported for loan reports');
          setLoading(false);
          return;
        }
      } else {
        setError('Selected report type is not yet implemented');
        setLoading(false);
        return;
      }

      // Check if response is valid
      if (!response || !response.data) {
        throw new Error('No response data received from server');
      }

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${dateRange.startDate}_to_${dateRange.endDate}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      setSuccess('Report generated successfully');
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate report. Please check your admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Report Generation</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="transactions">Transactions</option>
              <option value="loans">Loans</option>
              <option value="users" disabled>Users (Coming Soon)</option>
              <option value="accounts" disabled>Accounts (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv" disabled>CSV (Coming Soon)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Report Information:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Transaction Reports: Includes all transactions within the selected date range</li>
            <li>Loan Reports: Includes all loan applications and their statuses</li>
            <li>PDF format is recommended for printing</li>
            <li>Excel format is recommended for data analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;