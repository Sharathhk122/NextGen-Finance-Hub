import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EyeOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  PercentageOutlined,
  FileTextOutlined 
} from '@ant-design/icons';

const LoanCard = ({ loan }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };
  
  // Calculate rotation based on mouse position
  const calculateRotation = () => {
    if (!cardRef.current) return { rotateX: 0, rotateY: 0 };
    
    const { width, height } = cardRef.current.getBoundingClientRect();
    const rotateX = ((mousePosition.y - height / 2) / height) * 10;
    const rotateY = ((mousePosition.x - width / 2) / width) * 10;
    
    return { rotateX, rotateY };
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-900 text-amber-200';
      case 'APPROVED': return 'bg-blue-900 text-blue-200';
      case 'DISBURSED': return 'bg-emerald-900 text-emerald-200';
      case 'CLOSED': return 'bg-slate-800 text-slate-200';
      case 'REJECTED': return 'bg-rose-900 text-rose-200';
      default: return 'bg-slate-800 text-slate-200';
    }
  };

  const getLoanTypeText = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: 10,
      rotateY: -10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      z: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  const textGlowVariants = {
    hidden: { 
      textShadow: "0 0 0px rgba(79, 70, 229, 0)" 
    },
    visible: { 
      textShadow: [
        "0 0 0px rgba(79, 70, 229, 0)",
        "0 0 10px rgba(79, 70, 229, 0.5)",
        "0 0 0px rgba(79, 70, 229, 0)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const { rotateX, rotateY } = calculateRotation();

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-xl overflow-hidden p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl"
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d'
      }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-900 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-900 rounded-full opacity-20 blur-xl"></div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        ></div>
      </div>
      
      {/* 3D depth effect with multiple layers */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <motion.h3 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {loan.loanAccountNumber}
            </motion.h3>
            <motion.span 
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)} inline-block mt-2`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {loan.status}
            </motion.span>
          </div>
          <motion.span 
            className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getLoanTypeText(loan.loanType)}
          </motion.span>
        </div>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent"
            variants={textGlowVariants}
            initial="hidden"
            animate="visible"
          >
            ₹{loan.loanAmount.toLocaleString('en-IN')}
          </motion.p>
          <p className="text-sm text-slate-400 mt-1">Loan Amount</p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <motion.div 
            className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-slate-400 flex items-center">
              <PercentageOutlined className="mr-1" /> Interest Rate
            </p>
            <p className="font-medium text-indigo-300">{loan.interestRate}%</p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-slate-400 flex items-center">
              <CalendarOutlined className="mr-1" /> Tenure
            </p>
            <p className="font-medium text-indigo-300">{loan.tenureMonths} months</p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-slate-400 flex items-center">
              <DollarOutlined className="mr-1" /> EMI Amount
            </p>
            <p className="font-medium text-emerald-300">₹{loan.emiAmount?.toLocaleString('en-IN') || 'N/A'}</p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-slate-400 flex items-center">
              <FileTextOutlined className="mr-1" /> Total Payable
            </p>
            <p className="font-medium text-emerald-300">₹{loan.totalPayableAmount?.toLocaleString('en-IN') || 'N/A'}</p>
          </motion.div>
        </div>
        
        <div className="flex space-x-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Link
              to={`/loans/${loan.id}`}
              className="block text-center bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-100 px-4 py-2.5 rounded-lg text-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-indigo-900/30"
            >
              <EyeOutlined className="mr-1" /> View Details
            </Link>
          </motion.div>
          
          {loan.status === 'DISBURSED' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Link
                to={`/loans/${loan.id}/pay-emi`}
                className="block text-center bg-gradient-to-r from-emerald-700 to-cyan-700 text-emerald-100 px-4 py-2.5 rounded-lg text-sm hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-emerald-900/30"
              >
                <DollarOutlined className="mr-1" /> Pay EMI
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoanCard;