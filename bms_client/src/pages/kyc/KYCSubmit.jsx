// src/pages/kyc/KYCSubmit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycAPI } from '../../api/kyc';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadOutlined, 
  IdcardOutlined, 
  CameraOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Typography, Spin, notification, Progress, Tooltip } from 'antd';

const { Title, Text } = Typography;

const KYCSubmit = () => {
  const navigate = useNavigate();
  useAuth();
  const [formData, setFormData] = useState({
    documentType: 'AADHAAR',
    documentNumber: '',
    documentFrontImage: null,
    documentBackImage: null,
    selfieImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingKYC, setExistingKYC] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [typingIndex, setTypingIndex] = useState(0);
  const containerRef = useRef(null);
  const floatingCardsRef = useRef([]);

  const typingTexts = [
    "Securing your identity...",
    "Verifying your documents...",
    "Encrypting your data...",
    "Almost there..."
  ];

  useEffect(() => {
    checkExistingKYC();
    
    // Typing animation effect
    const typingInterval = setInterval(() => {
      setTypingIndex(prev => (prev + 1) % typingTexts.length);
    }, 3000);

    // 3D mouse move effect
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      containerRef.current.style.transform = `
        perspective(1000px)
        rotateX(${y * -8}deg)
        rotateY(${x * 8}deg)
        translateZ(0)
      `;
      
      // Update CSS variables for dynamic lighting
      document.documentElement.style.setProperty('--x-pos', x);
      document.documentElement.style.setProperty('--y-pos', y);

      // Floating cards parallax effect
      floatingCardsRef.current.forEach((card, index) => {
        if (card) {
          const depth = 20 + (index * 5);
          card.style.transform = `
            translateX(${x * depth}px)
            translateY(${y * depth}px)
            rotateX(${y * -depth * 0.2}deg)
            rotateY(${x * depth * 0.2}deg)
          `;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(typingInterval);
    };
  }, []);

  const checkExistingKYC = async () => {
    try {
      const response = await kycAPI.getKYCStatus();
      setExistingKYC(response.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to check KYC status:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Simulate upload progress for visual feedback
      if (files[0]) {
        setUploadProgress(prev => ({
          ...prev,
          [name]: 0
        }));
        
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev[name] >= 100) {
              clearInterval(interval);
              return prev;
            }
            return {
              ...prev,
              [name]: prev[name] + 10
            };
          });
        }, 100);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.documentFrontImage || !formData.selfieImage) {
      setError('Please upload all required documents');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('documentType', formData.documentType);
      submitData.append('documentNumber', formData.documentNumber);
      submitData.append('documentFrontImage', formData.documentFrontImage);
      
      if (formData.documentBackImage) {
        submitData.append('documentBackImage', formData.documentBackImage);
      }
      
      submitData.append('selfieImage', formData.selfieImage);

      await kycAPI.submitKYC(submitData);
      
      if (existingKYC) {
        setSuccess('KYC resubmitted successfully! It will be reviewed shortly.');
      } else {
        setSuccess('KYC submitted successfully! It will be reviewed shortly.');
      }
      
      setTimeout(() => {
        navigate('/kyc/status');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden p-4">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20 blur-xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 70, 0],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating 3D cards */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          ref={el => floatingCardsRef.current[i] = el}
          className="absolute w-32 h-44 rounded-xl bg-gradient-to-br from-purple-700/30 to-blue-500/30 border border-purple-500/30 shadow-lg"
          style={{
            left: `${15 + (i * 25)}%`,
            top: `${20 + (i * 10)}%`,
            rotate: `${i * 15}deg`,
            zIndex: -1
          }}
          animate={{
            y: [0, -20, 0],
            rotateZ: [i * 15, i * 15 + 5, i * 15],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Glowing particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-cyan-400 opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(100, 100, 255, 0.2)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <motion.div
        ref={containerRef}
        className="w-full max-w-2xl bg-gray-800 bg-opacity-70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: `
            radial-gradient(
              circle at calc(50% + (var(--x-pos, 0) * 150px)) calc(50% + (var(--y-pos, 0) * 150px)),
              rgba(99, 102, 241, 0.25),
              transparent 50%
            ),
            linear-gradient(135deg, rgba(25, 25, 35, 0.95), rgba(30, 30, 40, 0.95))
          `,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 30px rgba(99, 102, 241, 0.3)
          `,
        }}
      >
        {/* Animated border gradient */}
        <motion.div 
          className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-70 blur-xl -z-10"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating particles inside container */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400"
            style={{
              left: `${10 + (i * 25)}%`,
              top: `${15 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
        
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            animate={floatingAnimation}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 mb-6 shadow-lg"
            style={{
              boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)"
            }}
          >
            <IdcardOutlined className="text-3xl text-white" />
          </motion.div>
          
          <Title level={1} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3 font-bold tracking-tight">
            {existingKYC ? 'Update KYC Documents' : 'Identity Verification'}
          </Title>
          
          <motion.div 
            className="h-6 mb-2"
            key={typingIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text className="text-cyan-300 font-medium tracking-wide">
              {typingTexts[typingIndex]}
            </Text>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {existingKYC && existingKYC.status === 'APPROVED' && (
            <motion.div 
              className="flex items-center p-4 mb-6 rounded-xl bg-blue-900 bg-opacity-40 border border-blue-700 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircleOutlined className="text-blue-400 text-lg mr-3 flex-shrink-0" />
              <Text className="text-blue-300">
                Your KYC is already approved. You cannot resubmit unless your status changes.
              </Text>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="flex items-center p-4 mb-6 rounded-xl bg-red-900 bg-opacity-40 border border-red-700 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CloseCircleOutlined className="text-red-400 text-lg mr-3 flex-shrink-0" />
              <Text className="text-red-300">{error}</Text>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div 
              className="flex items-center p-4 mb-6 rounded-xl bg-green-900 bg-opacity-40 border border-green-700 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircleOutlined className="text-green-400 text-lg mr-3 flex-shrink-0" />
              <Text className="text-green-300">{success}</Text>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {existingKYC && existingKYC.status === 'REJECTED' && (
            <motion.div 
              className="p-4 mb-6 rounded-xl bg-yellow-900 bg-opacity-40 border border-yellow-700 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-start mb-2">
                <ExclamationCircleOutlined className="text-yellow-400 text-lg mr-3 mt-0.5 flex-shrink-0" />
                <Text className="text-yellow-300 font-semibold">Your previous KYC submission was rejected.</Text>
              </div>
              <Text className="text-yellow-300 block ml-6">Reason: {existingKYC.rejectionReason}</Text>
              <Text className="text-yellow-300 block ml-6 mt-1">Please correct the issues and resubmit your documents.</Text>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="relative">
            <label className="block text-cyan-300 text-sm font-semibold mb-2 uppercase tracking-wide">
              Document Type *
            </label>
            <div className="relative">
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300 appearance-none"
                style={{
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)"
                }}
              >
                <option value="AADHAAR" className="bg-gray-800">Aadhaar Card</option>
                <option value="PAN_CARD" className="bg-gray-800">PAN Card</option>
                <option value="PASSPORT" className="bg-gray-800">Passport</option>
                <option value="DRIVING_LICENSE" className="bg-gray-800">Driving License</option>
                <option value="VOTER_ID" className="bg-gray-800">Voter ID</option>
                <option value="UTILITY_BILL" className="bg-gray-800">Utility Bill</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-cyan-300 text-sm font-semibold mb-2 uppercase tracking-wide">
              Document Number *
            </label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              style={{
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)"
              }}
              placeholder="Enter document number"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-cyan-300 text-sm font-semibold mb-2 uppercase tracking-wide">
              Document Front Image *
            </label>
            <motion.label 
              className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-gray-700 bg-opacity-50 hover:border-cyan-400 transition-all duration-300 group relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 relative">
                <motion.div animate={pulseAnimation}>
                  <UploadOutlined className="w-10 h-10 mb-3 text-gray-400 group-hover:text-cyan-300 transition-colors" />
                </motion.div>
                <p className="mb-2 text-sm text-gray-400 group-hover:text-cyan-200 transition-colors">
                  {formData.documentFrontImage ? 'File selected' : 'Click to upload'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-cyan-100 transition-colors">
                  Clear image of the front side (JPG, PNG, PDF)
                </p>
              </div>
              <input
                type="file"
                name="documentFrontImage"
                onChange={handleChange}
                accept="image/*,.pdf"
                required
                className="hidden"
              />
              
              {uploadProgress.documentFrontImage !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <Progress 
                    percent={uploadProgress.documentFrontImage} 
                    size="small" 
                    showInfo={false}
                    strokeColor={{
                      '0%': '#06b6d4',
                      '100%': '#8b5cf6',
                    }}
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.label>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-cyan-300 text-sm font-semibold mb-2 uppercase tracking-wide">
              Document Back Image (Optional)
            </label>
            <motion.label 
              className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-gray-700 bg-opacity-50 hover:border-cyan-400 transition-all duration-300 group relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 relative">
                <motion.div animate={pulseAnimation}>
                  <UploadOutlined className="w-10 h-10 mb-3 text-gray-400 group-hover:text-cyan-300 transition-colors" />
                </motion.div>
                <p className="mb-2 text-sm text-gray-400 group-hover:text-cyan-200 transition-colors">
                  {formData.documentBackImage ? 'File selected' : 'Click to upload'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-cyan-100 transition-colors">
                  Back side image if applicable (JPG, PNG, PDF)
                </p>
              </div>
              <input
                type="file"
                name="documentBackImage"
                onChange={handleChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              
              {uploadProgress.documentBackImage !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <Progress 
                    percent={uploadProgress.documentBackImage} 
                    size="small" 
                    showInfo={false}
                    strokeColor={{
                      '0%': '#06b6d4',
                      '100%': '#8b5cf6',
                    }}
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.label>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-cyan-300 text-sm font-semibold mb-2 uppercase tracking-wide">
              Selfie with Document *
            </label>
            <motion.label 
              className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-gray-700 bg-opacity-50 hover:border-cyan-400 transition-all duration-300 group relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 relative">
                <motion.div animate={pulseAnimation}>
                  <CameraOutlined className="w-10 h-10 mb-3 text-gray-400 group-hover:text-cyan-300 transition-colors" />
                </motion.div>
                <p className="mb-2 text-sm text-gray-400 group-hover:text-cyan-200 transition-colors">
                  {formData.selfieImage ? 'File selected' : 'Click to upload selfie'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-cyan-100 transition-colors">
                  Clear selfie holding your document
                </p>
              </div>
              <input
                type="file"
                name="selfieImage"
                onChange={handleChange}
                accept="image/*"
                required
                className="hidden"
              />
              
              {uploadProgress.selfieImage !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <Progress 
                    percent={uploadProgress.selfieImage} 
                    size="small" 
                    showInfo={false}
                    strokeColor={{
                      '0%': '#06b6d4',
                      '100%': '#8b5cf6',
                    }}
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.label>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              type="submit"
              disabled={loading || (existingKYC && existingKYC.status === 'APPROVED')}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group"
              style={{
                boxShadow: "0 5px 15px rgba(99, 102, 241, 0.4)"
              }}
            >
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <>
                    <Spin indicator={<LoadingOutlined className="text-white" spin />} className="mr-2" />
                    <motion.span
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Submitting...
                    </motion.span>
                  </>
                ) : existingKYC ? (
                  'Resubmit KYC'
                ) : (
                  'Submit Verification'
                )}
              </span>
              
              {/* Animated button background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                <div className="w-1/2 h-full bg-white/20"></div>
              </div>
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate('/kyc/status')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium flex items-center justify-center mx-auto group"
            whileHover={{ x: 5 }}
          >
            Check Verification Status
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Global styles */}
      <style jsx global>{`
        :root {
          --x-pos: 0;
          --y-pos: 0;
        }
        
        body {
          background-color: #0f172a;
          color: #e2e8f0;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.8);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
        
        /* Selection color */
        ::selection {
          background: rgba(6, 182, 212, 0.3);
        }
        
        /* Input number arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default KYCSubmit;