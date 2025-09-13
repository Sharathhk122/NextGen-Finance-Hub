import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loanAPI } from '../../api/loan';
import { useAuth } from '../../hooks/useAuth';

const LoanSchedulePage = () => {
  const { loanId } = useParams();
  useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, [loanId]);

  const fetchSchedule = async () => {
    try {
      const response = await loanAPI.getEMISchedule(loanId);
      
      // Handle different response structures
      let scheduleData = [];
      
      if (Array.isArray(response.data)) {
        scheduleData = response.data;
      } else if (response.data && Array.isArray(response.data.schedule)) {
        scheduleData = response.data.schedule;
      } else if (response.data && Array.isArray(response.data.data)) {
        scheduleData = response.data.data;
      } else if (response.data && Array.isArray(response.data.content)) {
        scheduleData = response.data.content;
      }
      
      setSchedule(scheduleData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch EMI schedule');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading schedule...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to={`/loans/${loanId}`} className="text-blue-500 hover:underline">
          Back to Loan Details
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link to={`/loans/${loanId}`} className="text-blue-500 hover:underline mr-4">
          ← Back to Loan Details
        </Link>
        <h1 className="text-3xl font-bold">EMI Schedule</h1>
      </div>

      {schedule && schedule.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold mb-2">
              Loan: {schedule[0].loanAccountNumber || 'N/A'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Loan Amount</p>
                <p className="font-medium">₹{schedule[0].loanAmount?.toLocaleString('en-IN') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Interest Rate</p>
                <p className="font-medium">{schedule[0].interestRate || 'N/A'}%</p>
              </div>
              <div>
                <p className="text-gray-600">EMI Amount</p>
                <p className="font-medium">₹{schedule[0].emiAmount?.toLocaleString('en-IN') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Payable</p>
                <p className="font-medium">₹{schedule[0].totalPayableAmount?.toLocaleString('en-IN') || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining Principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.map((emi) => (
                  <tr key={emi.installmentNumber}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{emi.installmentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(emi.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{emi.principalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{emi.interestAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{emi.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{emi.remainingPrincipal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        emi.status === 'PAID' 
                          ? 'bg-green-100 text-green-800'
                          : emi.status === 'LATE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {emi.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanSchedulePage;