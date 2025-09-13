// src/pages/transaction/Deposit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../../api/transaction';
import { useAuth } from '../../hooks/useAuth';
import TransactionForm from '../../components/transaction/TransactionForm';
import { Card, notification } from 'antd';
import { motion } from 'framer-motion';

const Deposit = () => {
  const navigate = useNavigate();
  useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const canvasRef = useRef(null);

  // Particle animation for background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles = [];
    const particleCount = 100;
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6'];
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = 0;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
        
        this.angle += 0.01;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add a glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines
    const connectParticles = () => {
      const maxDistance = 150;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleDeposit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await transactionAPI.deposit(data);
      setSuccess('Deposit successful!');
      
      // Show Ant Design notification
      notification.success({
        message: 'Deposit Completed',
        description: 'Your funds have been successfully deposited to your account.',
        placement: 'topRight',
      });
      
      setTimeout(() => {
        navigate('/transactions/history');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process deposit');
      
      // Show error notification
      notification.error({
        message: 'Deposit Failed',
        description: err.response?.data?.message || 'Failed to process deposit',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative flex items-center justify-center">
      {/* Animated background canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto p-6 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div 
          className="flex items-center mb-6"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="text-indigo-300 hover:text-indigo-100 mr-4 flex items-center transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </motion.button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Deposit Money
          </h1>
        </motion.div>

        <motion.div 
          className="w-full max-w-md flex items-center justify-center" // Changed from max-w-2xl to max-w-md
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {/* 3D Animated Card Container */}
          <motion.div
            className="relative w-full"
            initial={{ rotateY: 0, rotateX: 0 }}
            whileHover={{ 
              rotateY: [0, -5, 5, 0],
              rotateX: [0, -2, 2, 0],
              transition: { duration: 0.5 }
            }}
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Moving gradient border */}
            <motion.div 
              className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-75"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
                zIndex: 0
              }}
            />
            
            <Card 
              className="bg-gray-800 border-0 shadow-xl overflow-hidden relative z-10"
              bodyStyle={{ padding: 0 }}
            >
              {/* Inner 3D effect with gradient moving sides */}
              <motion.div 
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: `linear-gradient(45deg, 
                    #6366f1 0%, #8b5cf6 25%, #ec4899 50%, #3b82f6 75%, #6366f1 100%)`,
                  backgroundSize: '200% 200%',
                  zIndex: -1
                }}
              />
              
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="bg-gray-800 p-8 relative overflow-hidden">
                  {/* Floating particles inside the form */}
                  <motion.div 
                    className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 rounded-full opacity-30"
                    animate={{
                      y: [0, 15, 0],
                      x: [0, 10, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="absolute -bottom-4 -right-4 w-10 h-10 bg-purple-500 rounded-full opacity-30"
                    animate={{
                      y: [0, -15, 0],
                      x: [0, -10, 0],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  
                  {error && (
                    <motion.div 
                      className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {success}
                    </motion.div>
                  )}

                  <div className="flex flex-col items-center justify-center">
                    <TransactionForm 
                      type="deposit" 
                      onSubmit={handleDeposit} 
                      loading={loading} 
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* 3D animated coins */}
        <div className="absolute bottom-10 right-10 hidden md:block">
          <motion.div
            className="relative w-20 h-20"
            animate={{ 
              rotateY: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear"
            }}
          >
            <div className="absolute inset-0 bg-yellow-500 rounded-full shadow-lg"></div>
            <div className="absolute inset-1 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xs">$</span>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div 
          className="absolute top-1/4 left-10 hidden lg:block"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-600/30 backdrop-blur-sm rotate-45"></div>
        </motion.div>

        <motion.div 
          className="absolute bottom-1/3 right-20 hidden lg:block"
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="w-12 h-12 rounded-full bg-purple-600/30 backdrop-blur-sm"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Deposit;