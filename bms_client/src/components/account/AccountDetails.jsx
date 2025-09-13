/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { accountAPI } from "../../api/account";
import { useAuth } from "../../hooks/useAuth";
import { Card, Badge, Spin, Alert } from "antd";
import { 
  ArrowLeftOutlined, 
  DollarOutlined, 
  TransactionOutlined, 
  SwapOutlined, 
  HistoryOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const AccountDetails = () => {
  const { accountNumber } = useParams();
  useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccountDetails();
  }, [accountNumber]);

  const fetchAccountDetails = async () => {
    try {
      const response = await accountAPI.getAccountDetails(accountNumber);
      setAccount(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch account details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced 3D Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: Math.random() * 120 + 30,
                height: Math.random() * 120 + 30,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, 
                  rgba(255,255,255,0.15) 0%, 
                  rgba(255,255,255,0) 70%)`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${Math.random() * 15 + 10}s`,
                filter: 'blur(8px)'
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-300 mx-auto mb-6 
              shadow-lg shadow-purple-500/50 backdrop-blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full 
                animate-ping opacity-75"></div>
            </div>
          </div>
          <p className="text-white text-2xl font-semibold mt-8 bg-black/30 px-6 py-3 rounded-xl 
            backdrop-blur-sm animate-pulse border border-white/10">
            Loading account details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced 3D Animated background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-25 animate-pulse" 
            style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" 
            style={{animationDelay: '0.7s'}}></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl text-center max-w-md transform transition-all duration-700 
          hover:scale-105 hover:rotate-1 border border-white/20 relative z-10">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur opacity-30 
            group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          <div className="mb-8 text-red-300 relative">
            <ExclamationCircleOutlined className="text-6xl mx-auto drop-shadow-lg" />
          </div>
          
          <Alert
            message="Error"
            description={error}
            type="error"
            className="mb-8 bg-red-500/20 border-red-500/50 text-white"
          />
          
          <Link 
            to="/accounts" 
            className="inline-block relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-10 
            rounded-full transform transition-all duration-500 hover:scale-110 hover:shadow-2xl shadow-lg shadow-purple-500/30 
            hover:-translate-y-1 border border-white/20"
          >
            <span className="relative z-10 flex items-center justify-center">
              <ArrowLeftOutlined className="mr-2" />
              Back to Accounts
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full opacity-0 
              group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-8 px-4 relative overflow-hidden">
      {/* Enhanced 3D Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const colors = [
            'rgba(139, 92, 246, 0.15)', // purple
            'rgba(236, 72, 153, 0.15)', // pink
            'rgba(59, 130, 246, 0.15)', // blue
            'rgba(16, 185, 129, 0.15)', // green
            'rgba(245, 158, 11, 0.15)'  // amber
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 100 + 30,
                height: Math.random() * 100 + 30,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${randomColor} 0%, rgba(255,255,255,0) 70%)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 20 + 15}s`,
                filter: 'blur(12px)',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with enhanced 3D effect */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            to="/accounts" 
            className="group flex items-center text-white font-medium transition-all duration-500 hover:text-purple-300 
            bg-black/30 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-purple-400/30 
            hover:bg-purple-500/10 hover:shadow-2xl hover:-translate-x-1"
          >
            <ArrowLeftOutlined className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to Accounts
          </Link>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 
            transform transition-all duration-700 hover:scale-105 drop-shadow-2xl tracking-tight">
            Account Details
          </h1>
          
          <div className="w-32 bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full rotate-12 
            shadow-lg shadow-purple-500/50"></div>
        </div>

        {account && (
          <div className="flex flex-col gap-12">
            {/* Account Summary with enhanced 3D card effect */}
            <Card 
              className="relative group border-0 bg-transparent"
              bodyStyle={{ padding: 0 }}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur 
                opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20 
                transform transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-wider bg-black/30 px-6 py-3 rounded-2xl 
                      backdrop-blur-sm inline-block border border-white/10">
                      {account.accountNumber}
                    </h2>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-lg 
                      shadow-cyan-400/30"></div>
                  </div>
                  
                  <Badge 
                    status={account.status === 'Active' ? 'success' : 'error'} 
                    text={account.status} 
                    className="bg-black/40 text-white px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Type", value: account.accountType, color: "from-blue-400 to-cyan-400", icon: "📋" },
                    { label: "Current Balance", value: `₹${account.balance}`, color: "from-green-400 to-cyan-400", icon: "💰", isLarge: true },
                    { label: "Minimum Balance", value: `₹${account.minimumBalance || "0.00"}`, color: "from-gray-400 to-blue-400", icon: "📉" },
                    { label: "Branch Name", value: account.branchName, color: "from-purple-400 to-pink-400", icon: "🏢" },
                    { label: "Branch Code", value: account.branchCode, color: "from-indigo-400 to-blue-400", icon: "🔢" },
                    { label: "IFSC Code", value: account.ifscCode, color: "from-cyan-400 to-teal-400", icon: "🏛️" },
                    { label: "Interest Rate", value: `${account.interestRate}%`, color: "from-yellow-400 to-amber-400", icon: "📈" },
                    { label: "Account Created", value: new Date(account.createdAt).toLocaleDateString(), color: "from-pink-400 to-rose-400", icon: "📅" },
                    ...(account.allowOverdraft ? [{ label: "Overdraft Limit", value: `₹${account.overdraftLimit || "0.00"}`, color: "from-orange-400 to-red-400", icon: "⚡" }] : [])
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-5 bg-black/30 rounded-2xl backdrop-blur-sm border border-white/10 
                        transform transition-all duration-500 hover:translate-x-2 hover:bg-white/10 hover:shadow-lg"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${item.color} font-semibold text-lg`}>
                          {item.label}:
                        </span>
                      </div>
                      
                      {item.isLarge ? (
                        <span className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.color} 
                          drop-shadow-md`}>
                          {item.value}
                        </span>
                      ) : (
                        <span className="text-white font-semibold text-lg">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions with enhanced 3D effects */}
            <Card 
              className="relative group border-0 bg-transparent"
              bodyStyle={{ padding: 0 }}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-3xl blur 
                opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20 
                transform transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-white mb-4 tracking-wider bg-black/30 px-6 py-3 rounded-2xl 
                    backdrop-blur-sm inline-block border border-white/10">
                    Quick Actions
                  </h2>
                  <div className="h-1.5 w-32 bg-gradient-to-r from-pink-400 to-yellow-500 rounded-full shadow-lg 
                    shadow-pink-400/30"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { 
                      title: "Deposit Money", 
                      to: `/transactions/deposit?account=${account.accountNumber}`, 
                      gradient: "from-green-500 to-cyan-600",
                      icon: <DollarOutlined className="text-3xl" />
                    },
                    { 
                      title: "Withdraw Money", 
                      to: `/transactions/withdraw?account=${account.accountNumber}`, 
                      gradient: "from-amber-500 to-orange-600",
                      icon: <TransactionOutlined className="text-3xl" />
                    },
                    { 
                      title: "Transfer Funds", 
                      to: `/transactions/transfer?from=${account.accountNumber}`, 
                      gradient: "from-blue-500 to-indigo-600",
                      icon: <SwapOutlined className="text-3xl" />
                    },
                    { 
                      title: "View Transactions", 
                      to: `/transactions/history/${account.accountNumber}`, 
                      gradient: "from-purple-500 to-pink-600",
                      icon: <HistoryOutlined className="text-3xl" />
                    }
                  ].map((action, index) => (
                    <Link 
                      key={index}
                      to={action.to}
                      className={`group relative bg-gradient-to-br ${action.gradient} p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center 
                        transform transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:z-10 hover:-translate-y-3 
                        overflow-hidden h-48`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 
                        bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      
                      <div className="mb-6 w-20 h-20 bg-white/25 rounded-full flex items-center justify-center 
                        group-hover:rotate-12 transition-transform duration-700 shadow-inner border border-white/30">
                        {action.icon}
                      </div>
                      
                      <span className="text-white font-semibold text-center text-xl tracking-wide drop-shadow-md">
                        {action.title}
                      </span>
                      
                      {/* 3D effect border */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-white/40 group-hover:border-white/60 
                        transition-colors duration-500"></div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
          33% {
            transform: translateY(-30px) rotate(5deg) scale(1.05);
            opacity: 0.8;
          }
          66% {
            transform: translateY(15px) rotate(-5deg) scale(0.95);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        /* Enhanced gradient animation for background */
        .min-h-screen {
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AccountDetails;