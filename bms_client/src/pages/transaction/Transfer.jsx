// src/pages/transaction/Transfer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { transactionAPI } from '../../api/transaction';
import { useAuth } from '../../hooks/useAuth';
import TransferForm from '../../components/transaction/TransferForm';
import { motion } from 'framer-motion';
import { Card, notification } from 'antd';
import { RocketOutlined, TransactionOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const Transfer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get pre-filled account number from query params if available
  const fromAccount = searchParams.get('from');
  const toAccount = searchParams.get('to');

  const handleTransfer = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await transactionAPI.transfer(data);
      setSuccess('Transfer successful!');
      notification.success({
        message: 'Transfer Completed',
        description: 'Your funds have been transferred successfully!',
        placement: 'topRight',
        className: 'bg-gray-800 text-cyan-300 border border-cyan-500/30'
      });
      
      setTimeout(() => {
        navigate('/transactions/history');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process transfer');
      notification.error({
        message: 'Transfer Failed',
        description: err.response?.data?.message || 'Failed to process transfer',
        placement: 'topRight',
        className: 'bg-gray-800 text-red-300 border border-red-500/30'
      });
    } finally {
      setLoading(false);
    }
  };

  // Particle background effect
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      
      // Random gradient
      const gradients = [
        'bg-gradient-to-br from-cyan-500/10 to-blue-500/10',
        'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
        'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
        'bg-gradient-to-br from-pink-500/10 to-purple-500/10'
      ];
      
      particle.className += ' ' + gradients[Math.floor(Math.random() * gradients.length)];
      
      const size = Math.random() * 20 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      
      document.getElementById('particle-container').appendChild(particle);
      
      // Animate particle
      const animation = particle.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 0 },
        { transform: `translateY(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0.7 },
        { transform: `translateY(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 10000 + 5000,
        iterations: Infinity
      });
      
      return particle;
    };

    // Create particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        particles.push(createParticle());
      }, i * 200);
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 overflow-hidden relative flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div id="particle-container" className="absolute top-0 left-0 w-full h-full overflow-hidden"></div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02MCA2MEgwVjBoNjB2NjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTYwIDYwSDBWMGg2MHY2MHoiIGZpbGw9InJnYmEoMjAsIDIwLCAzMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="container mx-auto relative z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <Card 
            className="bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl relative overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            {/* Animated border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg pointer-events-none"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 blur-lg opacity-50 pointer-events-none"></div>
            
            <div className="p-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center mb-6"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotateY: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-4"
                >
                  <div className="relative">
                    <TransactionOutlined className="text-5xl text-cyan-400" />
                    <motion.div 
                      className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-md"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 text-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Transfer Funds
                </motion.h1>
                
                <motion.p 
                  className="text-cyan-300/70 text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Securely transfer money between accounts
                </motion.p>
              </motion.div>

              <TransferForm 
                onSubmit={handleTransfer} 
                loading={loading} 
                fromAccount={fromAccount}
                toAccount={toAccount}
              />
            </div>
          </Card>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center mt-6"
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-cyan-300 hover:text-cyan-100 flex items-center bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* 3D floating elements */}
      <motion.div
        className="absolute bottom-10 right-10 hidden md:block"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-4 rounded-xl backdrop-blur-sm border border-cyan-400/30 shadow-2xl">
          <RocketOutlined className="text-4xl text-cyan-300" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-10 left-10 hidden md:block"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl backdrop-blur-sm border border-purple-400/30 shadow-2xl">
          <SafetyCertificateOutlined className="text-3xl text-purple-300" />
        </div>
      </motion.div>

      {/* Animated circles in background */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block rounded-full border border-cyan-400/20"
          style={{
            width: 100 + i * 100,
            height: 100 + i * 100,
            top: `${20 + i * 10}%`,
            right: `${10 + i * 5}%`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default Transfer;