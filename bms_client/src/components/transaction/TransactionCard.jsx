// src/components/transaction/TransactionCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TransactionCard = ({ transaction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), {
    stiffness: 300,
    damping: 20
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), {
    stiffness: 300,
    damping: 20
  });
  
  // Background animation values
  const backgroundX = useMotionValue(0);
  const backgroundY = useMotionValue(0);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Update 3D tilt
      x.set(e.clientX - centerX);
      y.set(e.clientY - centerY);
      
      // Update background position for parallax effect
      const moveX = (e.clientX - centerX) / 25;
      const moveY = (e.clientY - centerY) / 25;
      backgroundX.set(moveX);
      backgroundY.set(moveY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, backgroundX, backgroundY]);

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'from-emerald-900 to-emerald-600';
      case 'WITHDRAWAL': return 'from-rose-900 to-rose-600';
      case 'TRANSFER_IN': return 'from-sky-900 to-sky-600';
      case 'TRANSFER_OUT': return 'from-amber-900 to-amber-600';
      default: return 'from-slate-900 to-slate-600';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT': 
        return (
          <motion.svg 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-emerald-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </motion.svg>
        );
      case 'WITHDRAWAL': 
        return (
          <motion.svg 
            initial={{ scale: 0.8, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-rose-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </motion.svg>
        );
      case 'TRANSFER_IN': 
        return (
          <motion.svg 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-sky-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </motion.svg>
        );
      case 'TRANSFER_OUT': 
        return (
          <motion.svg 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-amber-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </motion.svg>
        );
      default: 
        return (
          <motion.svg 
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-slate-300" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </motion.svg>
        );
    }
  };

  const formatType = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get color based on transaction type for glow effect
  const getGlowColor = (type) => {
    switch (type) {
      case 'DEPOSIT': return '#065f46';
      case 'WITHDRAWAL': return '#9f1239';
      case 'TRANSFER_IN': return '#0c4a6e';
      case 'TRANSFER_OUT': return '#92400e';
      default: return '#1e293b';
    }
  };

  // Animated text component
  const AnimatedText = ({ text, className }) => {
    return (
      <div className="flex overflow-hidden">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 300 }}
            className={className}
          >
            {char}
          </motion.span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="perspective-preserve"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-1 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl"
        style={{
          transform: 'translateZ(50px)',
        }}
      >
        {/* Animated background particles */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            x: backgroundX,
            y: backgroundY,
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-500/20"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-rose-500/20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-sky-500/20"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-amber-500/20"></div>
        </motion.div>
        
        {/* Static background with gradient */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${getGlowColor(transaction.type)} 0%, transparent 50%)`,
          }}
        />
        
        {/* Glow effect with opacity animation instead of background */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getGlowColor(transaction.type)} 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`p-3 rounded-2xl bg-gradient-to-br ${getTransactionTypeColor(transaction.type)} shadow-lg`}
              >
                {getTransactionIcon(transaction.type)}
              </motion.div>
              <div>
                <motion.p 
                  className="font-semibold text-slate-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedText text={formatType(transaction.type)} className="inline-block" />
                </motion.p>
                <motion.p 
                  className="text-sm text-slate-400 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {new Date(transaction.transactionDate).toLocaleDateString()} • {transaction.referenceNumber}
                </motion.p>
                {transaction.description && (
                  <motion.p 
                    className="text-sm text-slate-400 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {transaction.description}
                  </motion.p>
                )}
              </div>
            </div>
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.p 
                className={`font-bold text-lg ${transaction.type === 'WITHDRAWAL' || transaction.type === 'TRANSFER_OUT' ? 'text-rose-300' : 'text-emerald-300'}`}
                animate={{ 
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {transaction.type === 'WITHDRAWAL' || transaction.type === 'TRANSFER_OUT' ? '-' : '+'}
                ₹{transaction.amount.toLocaleString('en-IN')}
              </motion.p>
              <motion.p 
                className="text-sm text-slate-400 mt-1"
                animate={{ 
                  x: isHovered ? 5 : 0,
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Balance: ₹{transaction.balanceAfter.toLocaleString('en-IN')}
              </motion.p>
            </motion.div>
          </div>
          
          {/* Animated progress bar */}
          <motion.div 
            className="h-1 bg-slate-700 rounded-full overflow-hidden mt-4"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div 
              className={`h-full ${transaction.type === 'DEPOSIT' ? 'bg-emerald-500' : transaction.type === 'WITHDRAWAL' ? 'bg-rose-500' : transaction.type === 'TRANSFER_IN' ? 'bg-sky-500' : 'bg-amber-500'}`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </motion.div>
        </div>
        
        {/* 3D edge effect */}
        <div className="absolute inset-0 rounded-2xl border border-slate-600/30 pointer-events-none" style={{
          transform: 'translateZ(30px)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
        }} />
      </motion.div>
    </motion.div>
  );
};

export default TransactionCard;