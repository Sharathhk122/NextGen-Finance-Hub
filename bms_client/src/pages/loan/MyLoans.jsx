import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { loanAPI } from '../../api/loan';
import LoanCard from '../../components/loan/LoanCard';
import { useAuth } from '../../hooks/useAuth';
import { Card, Empty, Button, notification, Space, Typography } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

const MyLoans = () => {
  useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    fetchLoans();
    
    // Set up 3D background animation
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      containerRef.current.style.setProperty('--mouse-x', x);
      containerRef.current.style.setProperty('--mouse-y', y);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await loanAPI.getUserLoans();
      const loansData = Array.isArray(response.data) ? response.data : 
                       response.data.data || response.data.content || [];
      setLoans(loansData);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch loans';
      setError(errorMsg);
      notification.error({
        message: 'Error',
        description: errorMsg,
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
      style={{
        '--mouse-x': 0,
        '--mouse-y': 0,
      }}
    >
      {/* 3D Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, 
                hsl(${Math.random() * 360}, 70%, 60%) 0%, 
                transparent 70%)`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(
                calc(var(--mouse-x) * ${Math.random() * 50}px),
                calc(var(--mouse-y) * ${Math.random() * 50}px)
              )`,
            }}
          />
        ))}
      </div>

      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 100, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 100, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `
            perspective(500px) 
            rotateX(calc(var(--mouse-y) * 5deg)) 
            rotateY(calc(var(--mouse-x) * 5deg))
          `,
          transition: 'transform 0.1s ease-out',
        }}
      />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
       <Title
  level={1}
  className="text-center m-0 bg-clip-text text-transparent 
             bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-green-400 via-blue-500 via-purple-500 to-pink-500
             animate-text-shimmer
             drop-shadow-[3px_3px_0px_#ff0000] 
             [text-shadow:3px_3px_6px_rgba(0,0,0,0.8),-3px_-3px_6px_rgba(255,255,255,0.2)]"
>
  My Loans
</Title>

          <Space direction="horizontal" size="middle">
            <Button
              icon={<SyncOutlined />}
              loading={loading}
              onClick={fetchLoans}
              className="bg-indigo-900 border-indigo-700 text-indigo-200 hover:bg-indigo-800 hover:text-white h-12 px-4 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Refresh
            </Button>
            <Link to="/loans/apply">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 border-0 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
                size="large"
              >
                Apply for Loan
              </Button>
            </Link>
          </Space>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg backdrop-blur-sm animate-pulse">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-pink-500 border-b-transparent rounded-full animate-reverse-spin"></div>
            </div>
            <span className="mt-6 text-gray-400 text-xl animate-pulse">Loading your loans...</span>
          </div>
        ) : loans.length === 0 ? (
          <Card 
            className="bg-gray-800/60 border-gray-700 backdrop-blur-md rounded-2xl shadow-2xl max-w-3xl mx-auto"
            bodyStyle={{ padding: '60px 40px' }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-300 text-lg">No loans found</span>
              }
            >
              <p className="text-gray-400 mb-8 text-base">You haven't applied for any loans yet.</p>
              <Link to="/loans/apply">
                <Button 
                  type="primary" 
                  size="large"
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 text-base"
                >
                  Apply for Your First Loan
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loans.map((loan, index) => (
              <div 
                key={loan.id}
                className="transform transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <LoanCard 
                  loan={loan} 
                  className="animate-fade-in-up h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes text-shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes reverse-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-reverse-spin {
          animation: reverse-spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MyLoans;