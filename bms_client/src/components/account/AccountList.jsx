// AccountList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { accountAPI } from "../../api/account";
import AccountCard from "../../components/account/AccountCard";
import { useAuth } from "../../hooks/useAuth";
import { Card, Skeleton, Statistic, Tag, Empty, Button } from "antd";
import { 
  DollarOutlined, 
  AccountBookOutlined, 
  PieChartOutlined, 
  PlusOutlined,
  ReloadOutlined,
  BankOutlined
} from '@ant-design/icons';

const AccountListPage = () => {
  useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getUserAccounts();
      setAccounts(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce(
      (total, account) => total + parseFloat(account.balance),
      0
    );
  };

  const getAccountTypeStats = () => {
    const stats = {};
    accounts.forEach((account) => {
      const type = account.type || "Other";
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
        {/* Enhanced 3D background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700 rounded-full filter blur-3xl opacity-20 animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-700 rounded-full filter blur-3xl opacity-30 animate-float-medium"></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-blue-800 rounded-full filter blur-3xl opacity-25 animate-float-fast"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-800 rounded-full filter blur-3xl opacity-15 animate-float-slow"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full animate-ping-slow opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-full shadow-2xl flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-100 mb-2">Loading Your Portfolio</h2>
          <p className="text-purple-300">We're gathering your financial information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Advanced 3D Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10% left-5% w-72 h-72 bg-purple-800 rounded-full filter blur-3xl opacity-15 animate-float-slow"></div>
        <div className="absolute top-20% right-10% w-96 h-96 bg-indigo-800 rounded-full filter blur-3xl opacity-20 animate-float-medium"></div>
        <div className="absolute bottom-10% left-15% w-80 h-80 bg-blue-900 rounded-full filter blur-3xl opacity-15 animate-float-slow"></div>
        <div className="absolute bottom-20% right-15% w-64 h-64 bg-violet-800 rounded-full filter blur-3xl opacity-25 animate-float-fast"></div>
        <div className="absolute top-60% left-25% w-96 h-96 bg-cyan-900 rounded-full filter blur-3xl opacity-10 animate-float-medium"></div>
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/30 to-transparent animate-move-gradient"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
        </div>

        {/* 3D floating particles */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-amber-500 rounded-full opacity-70 animate-particle-1"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-60 animate-particle-2"></div>
        <div className="absolute top-1/2 left-1/5 w-5 h-5 bg-emerald-500 rounded-full opacity-50 animate-particle-3"></div>
        <div className="absolute top-1/3 right-1/5 w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-particle-4"></div>
        <div className="absolute bottom-1/4 left-2/3 w-4 h-4 bg-purple-500 rounded-full opacity-50 animate-particle-5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header Section with enhanced 3D effect */}
        <div className="text-center mb-16 transform transition-all duration-700 hover:scale-105">
          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-gradient-to-r from-purple-700 to-indigo-700 blur-2xl opacity-70 rounded-lg animate-pulse-slow"></div>
            <h1 className="relative text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-200 mb-6">
              My Accounts
            </h1>
          </div>
          
          <p className="text-lg text-purple-200 max-w-2xl mx-auto mb-10">
            Manage all your financial accounts in one place with our advanced 3D dashboard
          </p>
          
          <div className="mt-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Link 
              to="/accounts/new" 
              className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-purple-100 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-500 hover:-translate-y-2 hover:scale-110 group-hover:skew-y-2"
            >
              <PlusOutlined className="mr-3" />
              Create New Account
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-12 p-6 bg-red-700/20 backdrop-blur-xl rounded-2xl border border-red-600/30 text-red-200 text-center transform transition-all duration-500 hover:scale-[1.02] animate-wiggle">
            <p className="text-lg font-medium mb-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Error: {error}
            </p>
            <Button 
              onClick={fetchAccounts}
              icon={<ReloadOutlined />}
              className="px-5 py-2.5 bg-red-700/50 hover:bg-red-700/70 text-purple-100 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Summary Section with enhanced 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="perspective-1000">
            <Card 
              className="h-full bg-gradient-to-br from-purple-800/30 to-indigo-800/30 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl transform transition-all duration-700 hover:-translate-y-2 hover:rotate-x-12"
              bordered={false}
            >
              <Statistic
                title={<span className="text-purple-200 text-xl">Total Balance</span>}
                value={getTotalBalance()}
                precision={2}
                prefix="₹"
                valueStyle={{ color: '#86efac', fontSize: '28px', fontWeight: 'bold' }}
                suffix={
                  <div className="w-10 h-10 bg-purple-700/20 rounded-full flex items-center justify-center">
                    <DollarOutlined className="text-purple-300 text-lg" />
                  </div>
                }
              />
            </Card>
          </div>

          <div className="perspective-1000">
            <Card 
              className="h-full bg-gradient-to-br from-indigo-800/30 to-blue-800/30 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-2xl transform transition-all duration-700 hover:-translate-y-2 hover:rotate-x-12"
              bordered={false}
            >
              <Statistic
                title={<span className="text-indigo-200 text-xl">Total Accounts</span>}
                value={accounts.length}
                valueStyle={{ color: '#fde68a', fontSize: '28px', fontWeight: 'bold' }}
                suffix={
                  <div className="w-10 h-10 bg-indigo-700/20 rounded-full flex items-center justify-center">
                    <AccountBookOutlined className="text-indigo-300 text-lg" />
                  </div>
                }
              />
            </Card>
          </div>

          <div className="perspective-1000">
            <Card 
              className="h-full bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl transform transition-all duration-700 hover:-translate-y-2 hover:rotate-x-12"
              bordered={false}
            >
              <Statistic
                title={<span className="text-cyan-200 text-xl">Average Balance</span>}
                value={getTotalBalance() / (accounts.length || 1)}
                precision={2}
                prefix="₹"
                valueStyle={{ color: '#93c5fd', fontSize: '28px', fontWeight: 'bold' }}
                suffix={
                  <div className="w-10 h-10 bg-cyan-700/20 rounded-full flex items-center justify-center">
                    <PieChartOutlined className="text-cyan-300 text-lg" />
                  </div>
                }
              />
            </Card>
          </div>
        </div>

        {/* Account Types Section */}
        <div className="mb-16 bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/20 shadow-2xl transform transition-all duration-700 hover:scale-[1.01]">
          <h2 className="text-3xl font-bold text-purple-200 mb-6 text-center">Account Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Object.entries(getAccountTypeStats()).map(([type, count], index) => (
              <div 
                key={type} 
                className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 p-5 rounded-2xl text-center transform transition-all duration-500 hover:scale-110 hover:rotate-3"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <BankOutlined className="text-purple-200 text-xl" />
                </div>
                <p className="text-sm text-purple-300 mb-1 uppercase tracking-wider">{type}</p>
                <p className="text-2xl font-bold text-purple-100">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts List Section */}
        {accounts.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl transform transition-all duration-700 hover:scale-[1.01]">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-purple-300">No accounts found</span>
              }
            >
              <h3 className="text-3xl font-bold text-purple-200 mb-4">No accounts found</h3>
              <p className="text-purple-300 mb-8 max-w-md mx-auto">Start your financial journey by creating your first account to manage your money effectively</p>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Link 
                  to="/accounts/new" 
                  className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-purple-100 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-500 hover:-translate-y-2 hover:scale-110"
                >
                  <PlusOutlined className="mr-2" />
                  Create Your First Account
                </Link>
              </div>
            </Empty>
          </div>
        ) : (
          <div>
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mb-3">
                Account Overview
              </h2>
              <p className="text-purple-300">
                Active Accounts: {accounts.filter((acc) => acc.status === "active").length}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {accounts.map((account, index) => (
                <div 
                  key={account.accountNumber} 
                  className="transform transition-all duration-700 hover:scale-105 hover:z-10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AccountCard account={account} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes move-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 0.8; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes tilt {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-0.5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes wiggle {
          0%, 7% { transform: rotateZ(0); }
          15% { transform: rotateZ(-5deg); }
          20% { transform: rotateZ(4deg); }
          25% { transform: rotateZ(-3deg); }
          30% { transform: rotateZ(2deg); }
          35% { transform: rotateZ(-1deg); }
          40%, 100% { transform: rotateZ(0); }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -60px) scale(1.2); }
          50% { transform: translate(80px, 0) scale(1); }
          75% { transform: translate(40px, 60px) scale(0.8); }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-60px, 40px) scale(1.1); }
          50% { transform: translate(0, 80px) scale(1.3); }
          75% { transform: translate(60px, 40px) scale(1); }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(0, -80px) scale(1.2); }
          50% { transform: translate(-80px, 0) scale(0.8); }
          75% { transform: translate(0, 80px) scale(1.1); }
        }
        @keyframes particle-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, 30px) scale(1.3); }
          50% { transform: translate(30px, -60px) scale(0.9); }
          75% { transform: translate(-60px, -30px) scale(1.2); }
        }
        @keyframes particle-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-40px, -50px) scale(1.1); }
          50% { transform: translate(50px, 40px) scale(0.7); }
          75% { transform: translate(-50px, 40px) scale(1.3); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-move-gradient {
          background-size: 200% 200%;
          animation: move-gradient 15s ease infinite;
        }
        .animate-grid-move {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        .animate-wiggle {
          animation: wiggle 2s linear infinite;
        }
        .animate-particle-1 {
          animation: particle-1 15s ease-in-out infinite;
        }
        .animate-particle-2 {
          animation: particle-2 20s ease-in-out infinite;
        }
        .animate-particle-3 {
          animation: particle-3 18s ease-in-out infinite;
        }
        .animate-particle-4 {
          animation: particle-4 22s ease-in-out infinite;
        }
        .animate-particle-5 {
          animation: particle-5 17s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .hover\:rotate-x-12:hover {
          transform: rotateX(12deg);
        }
        .group:hover .group-hover\:skew-y-2 {
          transform: skewY(-2deg);
        }
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default AccountListPage;