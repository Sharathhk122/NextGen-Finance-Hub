// src/pages/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { kycAPI } from '../../api/kyc';
import { userAPI } from '../../api/index';
import { loanAPI } from '../../api/loan';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingKYC: 0,
    totalUsers: 0,
    transactionsToday: 0,
    pendingLoans: 0
  });
  const [loading, setLoading] = useState(true);
  const [message] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch pending KYC count
      const kycResponse = await kycAPI.getAllKYCSubmissions();
      const kycData = Array.isArray(kycResponse.data) ? kycResponse.data : 
                     kycResponse.data.content || kycResponse.data.data || [];
      const pendingKYC = kycData.filter(kyc => kyc.status === 'PENDING').length;

      // Fetch total users count
      const usersResponse = await userAPI.getAllUsers();
      let usersData = [];
      
      if (Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (usersResponse.data && Array.isArray(usersResponse.data.content)) {
        usersData = usersResponse.data.content;
      } else if (usersResponse.data && Array.isArray(usersResponse.data.users)) {
        usersData = usersResponse.data.users;
      } else if (usersResponse.data && Array.isArray(usersResponse.data.data)) {
        usersData = usersResponse.data.data;
      } else {
        usersData = usersResponse.data || [];
      }
      
      const totalUsers = usersData.length || 0;

      // Fetch pending loans count
      const loansResponse = await loanAPI.getPendingLoans();
      const loansData = Array.isArray(loansResponse.data) ? loansResponse.data : 
                       loansResponse.data.content || loansResponse.data.data || [];
      const pendingLoans = loansData.length;

      // For transactions today, you might need to implement this API
      const transactionsToday = 156; // Placeholder

      setStats({
        pendingKYC,
        totalUsers,
        transactionsToday,
        pendingLoans
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</h2>
              <p className="text-gray-600">Pending KYC</p>
            </div>
          </div>
          <Link to="/admin/kyc" className="block mt-4 text-blue-600 hover:text-blue-800 font-medium">
            View Details →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h2>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{stats.transactionsToday}</h2>
              <p className="text-gray-600">Transactions Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{stats.pendingLoans}</h2>
              <p className="text-gray-600">Pending Loans</p>
            </div>
          </div>
          <Link to="/admin/loans" className="block mt-4 text-blue-600 hover:text-blue-800 font-medium">
            View Details →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/kyc"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-3">KYC Management</h3>
          <p className="text-gray-600 mb-4">Review and approve pending KYC applications</p>
          <span className="text-blue-600 font-medium">Manage KYC →</span>
        </Link>

        <Link
          to="/admin/loans"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-3">Loan Management</h3>
          <p className="text-gray-600 mb-4">Approve and manage loan applications</p>
          <span className="text-blue-600 font-medium">Manage Loans →</span>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">System Reports</h3>
          <p className="text-gray-600 mb-4">Generate financial and system reports</p>
          <span className="text-gray-400 font-medium">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;