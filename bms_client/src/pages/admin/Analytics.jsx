// src/pages/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const Analytics = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [revenueResponse, customerResponse, realTimeResponse] = await Promise.all([
        adminAPI.getRevenueAnalytics(dateRange),
        adminAPI.getCustomerGrowthAnalytics(dateRange),
        adminAPI.getRealTimeMetrics()
      ]);

      // Handle different response structures
      setRevenueData(revenueResponse.data);
      setCustomerData(customerResponse.data);
      setRealTimeData(realTimeResponse.data);
    } catch (err) {
      setError('Failed to fetch analytics data. Please check your admin privileges.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (key, value) => {
    setDateRange(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <span className="self-center">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Real-time Metrics */}
      {realTimeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-blue-600">{realTimeData.activeSessions || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Transactions (Last Hour)</h3>
            <p className="text-3xl font-bold text-green-600">{realTimeData.transactionsLastHour || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">New Users (Last Hour)</h3>
            <p className="text-3xl font-bold text-purple-600">{realTimeData.newUsersLastHour || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">System Uptime</h3>
            <p className="text-3xl font-bold text-yellow-600">{realTimeData.systemUptime || 0}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Response Time</h3>
            <p className="text-3xl font-bold text-red-600">{realTimeData.responseTimeMs || 0}ms</p>
          </div>
        </div>
      )}

      {/* Revenue Analytics */}
      {revenueData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ₹{revenueData.totalRevenue ? revenueData.totalRevenue.toLocaleString('en-IN') : '0'}
                </p>
                <p className="text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{revenueData.interestRevenue ? revenueData.interestRevenue.toLocaleString('en-IN') : '0'}
                </p>
                <p className="text-gray-600">Interest Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ₹{revenueData.feeRevenue ? revenueData.feeRevenue.toLocaleString('en-IN') : '0'}
                </p>
                <p className="text-gray-600">Fee Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Monthly Breakdown</h3>
            {revenueData.monthlyBreakdown && revenueData.monthlyBreakdown.length > 0 ? (
              <div className="space-y-3">
                {revenueData.monthlyBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.month}</span>
                    <span className="font-semibold">₹{item.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>
      )}

      {/* Customer Growth Analytics */}
      {customerData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Customer Growth</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{customerData.totalCustomers || 0}</p>
              <p className="text-gray-600">Total Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{customerData.newCustomers || 0}</p>
              <p className="text-gray-600">New Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{customerData.activeCustomers || 0}</p>
              <p className="text-gray-600">Active Customers</p>
            </div>
          </div>

          <h4 className="text-lg font-semibold mb-3">Monthly Growth</h4>
          {customerData.monthlyGrowth && customerData.monthlyGrowth.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New Customers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Churned Customers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerData.monthlyGrowth.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{item.newCustomers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{item.churnedCustomers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        {item.netGrowth >= 0 ? (
                          <span className="text-green-600">+{item.netGrowth}</span>
                        ) : (
                          <span className="text-red-600">{item.netGrowth}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No growth data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;