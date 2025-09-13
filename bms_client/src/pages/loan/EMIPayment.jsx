import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanAPI } from '../../api/loan';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Progress, Statistic, Tag, Timeline, notification } from 'antd';
import { 
  ArrowLeftOutlined, 
  SafetyCertificateOutlined, 
  LockOutlined,
  DollarOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const EMIPayment = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  useAuth();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const canvasRef = useRef(null);

  // Enhanced 5D Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const particles = [];
    const particleCount = 150;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 60 + 200}, 80%, 60%)`;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.05;
        this.waveAmplitude = Math.random() * 25 + 10;
        this.oscillationSpeed = Math.random() * 0.03 + 0.01;
        this.zIndex = Math.random() * 5;
        this.pulse = 0;
        this.pulseDirection = 1;
      }
      
      update() {
        this.angle += this.angleSpeed;
        
        // 3D movement with wave pattern
        this.x += this.speedX + Math.sin(this.angle) * 0.7 * this.zIndex;
        this.y += this.speedY + Math.cos(this.angle) * 0.7 * this.zIndex;
        
        // Pulse animation
        this.pulse += 0.05 * this.pulseDirection;
        if (this.pulse >= 1 || this.pulse <= 0) this.pulseDirection *= -1;
        
        // Boundary check with wrap-around
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.y > canvas.height + 10) this.y = -10;
        if (this.y < -10) this.y = canvas.height + 10;
      }
      
      draw() {
        const pulseSize = this.size + (this.pulse * 2);
        const alpha = 0.6 + (this.pulse * 0.4);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        ctx.fill();
        
        // Draw connecting lines between nearby particles
        particles.forEach(particle => {
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${0.3 - distance/500})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          }
        });
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      gradient.addColorStop(0, '#0a0e1a');
      gradient.addColorStop(0.5, '#13172b');
      gradient.addColorStop(1, '#1a2036');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebula effect
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.7,
        0,
        canvas.width * 0.3,
        canvas.height * 0.7,
        canvas.width * 0.5
      );
      nebulaGradient.addColorStop(0, 'hsla(260, 60%, 20%, 0.6)');
      nebulaGradient.addColorStop(1, 'hsla(260, 60%, 10%, 0)');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Fetch loan details and schedule
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        const [loanResponse, scheduleResponse] = await Promise.all([
          loanAPI.getLoanDetails(loanId),
          loanAPI.getEMISchedule(loanId).catch(err => {
            console.warn('Could not fetch EMI schedule:', err.message);
            return { data: [] };
          })
        ]);
        
        // Extract schedule from the response - handle different response structures
        let emiSchedule = [];
        
        if (Array.isArray(scheduleResponse.data)) {
          emiSchedule = scheduleResponse.data;
        } else if (scheduleResponse.data && Array.isArray(scheduleResponse.data.schedule)) {
          emiSchedule = scheduleResponse.data.schedule;
        } else if (scheduleResponse.data && Array.isArray(scheduleResponse.data.data)) {
          emiSchedule = scheduleResponse.data.data;
        } else if (scheduleResponse.data && Array.isArray(scheduleResponse.data.content)) {
          emiSchedule = scheduleResponse.data.content;
        } else if (scheduleResponse.data && typeof scheduleResponse.data === 'object') {
          // If it's a single object, wrap it in an array
          emiSchedule = [scheduleResponse.data];
        }
        
        setLoan({
          ...loanResponse.data,
          emiSchedule: emiSchedule
        });
      } catch (err) {
        console.error('Error fetching loan details:', err);
        setError(err.response?.data?.message || 'Failed to fetch loan details');
        notification.error({
          message: 'Error',
          description: err.response?.data?.message || 'Failed to fetch loan details',
          placement: 'topRight',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId]);

  const handlePayment = async (paymentData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await loanAPI.payEMI(loanId, paymentData);
      setSuccess(response.data.message || 'EMI payment successful!');
      
      notification.success({
        message: 'Payment Successful',
        description: response.data.message || 'EMI payment successful!',
        placement: 'topRight',
      });
      
      // Refresh loan details after successful payment
      setTimeout(() => {
        navigate(`/loans/${loanId}`);
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to process EMI payment');
      notification.error({
        message: 'Payment Failed',
        description: err.response?.data?.message || 'Failed to process EMI payment',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !loan) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center overflow-hidden relative">
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0"></canvas>
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            className="w-20 h-20 border-t-4 border-b-4 border-purple-500 rounded-full mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.span 
            className="mt-4 text-xl font-semibold text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
          >
            Loading loan details...
          </motion.span>
          <motion.p 
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Securing your financial information
          </motion.p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 relative flex items-center justify-center">
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0"></canvas>
        <div className="relative z-10 max-w-md w-full">
          <motion.div 
            className="bg-red-900/80 backdrop-blur-xl border border-red-700/50 text-red-100 px-8 py-6 rounded-2xl mb-6 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Error Loading Loan</h3>
                <p>{error || 'Failed to load loan details. Please try again later.'}</p>
              </div>
            </div>
          </motion.div>
          <motion.button
            onClick={() => navigate(-1)}
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center justify-center group w-full py-4 bg-cyan-900/30 hover:bg-cyan-800/40 backdrop-blur-md rounded-xl border border-cyan-700/30 transition-all duration-300"
            whileHover={{ x: -5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Loans
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden flex items-center justify-center p-4">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0"></canvas>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="flex items-center justify-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="text-cyan-400 hover:text-cyan-300 mr-4 flex items-center group bg-cyan-900/20 hover:bg-cyan-800/30 px-4 py-2 rounded-lg backdrop-blur-md border border-cyan-700/30 transition-all duration-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeftOutlined className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </motion.button>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 text-center">
            EMI Payment Portal
          </h1>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-900/80 backdrop-blur-xl border border-red-700/50 text-red-100 px-6 py-4 rounded-xl mb-8 shadow-2xl mx-auto max-w-2xl"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div 
              className="bg-green-900/80 backdrop-blur-xl border border-green-700/50 text-green-100 px-6 py-4 rounded-xl mb-8 shadow-2xl mx-auto max-w-2xl"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <div className="flex items-center">
                <CheckCircleOutlined className="h-6 w-6 mr-3 flex-shrink-0" />
                <span>{success}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <EMIPaymentForm 
            loan={loan} 
            onSubmit={handlePayment} 
            loading={loading} 
          />
        </motion.div>
      </div>
    </div>
  );
};

const EMIPaymentForm = ({ loan, onSubmit, loading }) => {
  const [installmentNumber, setInstallmentNumber] = useState('');
  const [error, setError] = useState('');
  const [pendingInstallments, setPendingInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  // Typewriter animation effect
  useEffect(() => {
    const text = "Secure EMI Payment Gateway - Bank Grade Encryption";
    if (typingIndex < text.length) {
      const timer = setTimeout(() => {
        setTypingText(text.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [typingIndex]);

  useEffect(() => {
    if (loan && loan.emiSchedule) {
      // Filter pending installments
      const pending = loan.emiSchedule.filter(emi => 
        emi && (emi.status === 'PENDING' || emi.status === 'LATE')
      );
      
      setPendingInstallments(pending);
      
      // Auto-select the first pending installment
      if (pending.length > 0 && !installmentNumber) {
        setInstallmentNumber(pending[0].installmentNumber.toString());
        setSelectedInstallment(pending[0]);
      }
    }
  }, [loan, installmentNumber]);

  const handleInstallmentChange = (e) => {
    const selectedNumber = e.target.value;
    setInstallmentNumber(selectedNumber);
    
    const installment = pendingInstallments.find(
      emi => emi.installmentNumber === parseInt(selectedNumber)
    );
    setSelectedInstallment(installment);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!installmentNumber) {
      setError('Please select an installment to pay');
      return;
    }
    
    setError('');
    onSubmit({ installmentNumber: parseInt(installmentNumber) });
  };

  // Safe function to format currency with fallback
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate loan progress
  const paidInstallments = loan.emiSchedule ? loan.emiSchedule.filter(emi => emi.status === 'PAID').length : 0;
  const totalInstallments = loan.emiSchedule ? loan.emiSchedule.length : 0;
  const progressPercent = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;

  return (
    <motion.div 
      className="bg-gray-900/70 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-gray-700/50 w-full max-w-4xl"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center px-4 py-2 bg-purple-900/50 rounded-full mb-3 border border-purple-700/30">
          <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-semibold text-purple-300">{typingText}|</span>
        </div>
        <div className="flex items-center justify-center text-cyan-400 mb-2">
          <LockOutlined className="mr-2" />
          <SafetyCertificateOutlined />
          <span className="text-xs ml-2">256-bit SSL Encryption</span>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
        EMI Payment Gateway
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <motion.div 
          className="bg-gray-800/60 p-6 rounded-2xl border border-cyan-800/30 backdrop-blur-md"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
            <DollarOutlined className="mr-2" />
            Loan Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Loan ID:</span>
              <span className="font-medium">{loan.loanId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Principal Amount:</span>
              <span className="font-medium">{formatCurrency(loan.principalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Interest Rate:</span>
              <span className="font-medium">{loan.interestRate ? `${loan.interestRate}%` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tenure:</span>
              <span className="font-medium">{loan.tenureMonths ? `${loan.tenureMonths} months` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">EMI Amount:</span>
              <span className="font-medium text-green-400">{formatCurrency(loan.emiAmount)}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Repayment Progress</span>
              <span>{paidInstallments} of {totalInstallments} installments</span>
            </div>
            <Progress 
              percent={Math.round(progressPercent)} 
              strokeColor={{
                '0%': '#06b6d4',
                '100%': '#8b5cf6',
              }}
              showInfo={false}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800/60 p-6 rounded-2xl border border-purple-800/30 backdrop-blur-md"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
            <CalendarOutlined className="mr-2" />
            Payment Details
          </h3>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Select Installment</label>
            <select
              value={installmentNumber}
              onChange={handleInstallmentChange}
              className="w-full bg-gray-700/70 border border-gray-600/50 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-md"
            >
              <option value="">Select an installment</option>
              {pendingInstallments.map(emi => (
                <option key={emi.installmentNumber} value={emi.installmentNumber}>
                  Installment #{emi.installmentNumber} - Due: {emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : 'N/A'}
                  {emi.status === 'LATE' ? ' (Late)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          {selectedInstallment && (
            <motion.div 
              className="bg-purple-900/40 p-5 rounded-xl border border-purple-700/50 backdrop-blur-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300">Amount Due:</span>
                <span className="text-2xl font-bold text-green-400">
                  {formatCurrency(selectedInstallment.amountDue || loan.emiAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Due Date:</span>
                <span className={selectedInstallment.status === 'LATE' ? 'text-red-400' : 'text-yellow-400'}>
                  {selectedInstallment.dueDate ? new Date(selectedInstallment.dueDate).toLocaleDateString() : 'N/A'}
                  {selectedInstallment.status === 'LATE' && ' (Past Due)'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Installment:</span>
                <span className="text-cyan-400">#{selectedInstallment.installmentNumber}</span>
              </div>
            </motion.div>
          )}
          
          <div className="mt-6">
            <h4 className="text-gray-400 mb-3 flex items-center">
              <ScheduleOutlined className="mr-2" />
              Upcoming Installments
            </h4>
            {pendingInstallments.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {pendingInstallments.slice(0, 4).map(emi => (
                  <div key={emi.installmentNumber} className="flex justify-between items-center py-2 border-b border-gray-700/30">
                    <span>#{emi.installmentNumber}</span>
                    <span>{emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : 'N/A'}</span>
                    <Tag color={emi.status === 'LATE' ? 'red' : 'blue'}>
                      {emi.status === 'LATE' ? 'Late' : 'Pending'}
                    </Tag>
                  </div>
                ))}
                {pendingInstallments.length > 4 && (
                  <div className="text-center text-cyan-400 text-sm">
                    +{pendingInstallments.length - 4} more installments
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No pending installments
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {error && (
        <motion.div 
          className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleSubmit}
          disabled={loading || !installmentNumber}
          className={`px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 relative overflow-hidden group ${
            loading || !installmentNumber 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600 to-purple-700 text-white hover:from-cyan-700 hover:to-purple-800'
          }`}
          whileHover={!loading && installmentNumber ? { scale: 1.05 } : {}}
          whileTap={!loading && installmentNumber ? { scale: 0.95 } : {}}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <LockOutlined className="mr-2" />
              Pay Now
            </span>
          )}
        </motion.button>
        
        <p className="text-gray-500 text-sm mt-6 flex items-center justify-center">
          <SafetyCertificateOutlined className="mr-2" />
          Your payment information is encrypted and secure
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EMIPayment;