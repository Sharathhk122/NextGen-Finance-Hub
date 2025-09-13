import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountAPI } from '../../api/account';
import { useAuth } from '../../hooks/useAuth';
import { Card, Input, Select, Button, Checkbox, Alert, message } from 'antd';
import { 
  BankOutlined, 
  DollarOutlined, 
  HomeOutlined, 
  PercentageOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const AccountForm = () => {
  const navigate = useNavigate();
  useAuth();
  const [formData, setFormData] = useState({
    accountType: 'SAVINGS',
    initialDeposit: '',
    branchCode: 'BR001',
    branchName: 'Main Branch',
    ifscCode: 'BKID0001234',
    minimumBalance: '500',
    interestRate: '3.5',
    allowOverdraft: false,
    overdraftLimit: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create animated particles
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create new particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const size = Math.random() * 15 + 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      
      particle.style.setProperty('--size', `${size}px`);
      particle.style.setProperty('--x', `${x}%`);
      particle.style.setProperty('--y', `${y}%`);
      particle.style.setProperty('--duration', `${duration}s`);
      particle.style.setProperty('--delay', `-${delay}s`);
      
      particlesContainer.appendChild(particle);
    }
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert string values to numbers where needed
      const submitData = {
        ...formData,
        initialDeposit: formData.initialDeposit ? parseFloat(formData.initialDeposit) : 0,
        minimumBalance: parseFloat(formData.minimumBalance),
        interestRate: parseFloat(formData.interestRate),
        overdraftLimit: parseFloat(formData.overdraftLimit)
      };

      const response = await accountAPI.createAccount(submitData);
      setSuccess('Account created successfully!');
      message.success('Account created successfully!');
      
      setTimeout(() => {
        navigate('/accounts');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create account. Please try again.';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cosmic-bg min-h-screen flex items-center justify-center p-4">
      {/* Animated particles background */}
      <div className="particles"></div>
      
      <div className="cosmic-card w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center cosmic-text typing-animation">
          Create New Account
        </h2>
        <p className="text-center text-gray-400 mb-8">Open a new bank account with cosmic features</p>
        
        <div className="cosmic-underline h-1 w-24 mx-auto mb-8 rounded-full"></div>

        {error && (
          <Alert 
            message={error} 
            type="error" 
            className="cosmic-alert cosmic-alert-error mb-6" 
            showIcon
            closable
          />
        )}

        {success && (
          <Alert 
            message={success} 
            type="success" 
            className="cosmic-alert cosmic-alert-success mb-6" 
            showIcon
          />
        )}

        <form onSubmit={handleSubmit} className="cosmic-form space-y-6">
          <div className="cosmic-input-group">
            <label className="cosmic-label">Account Type *</label>
            <Select
              name="accountType"
              value={formData.accountType}
              onChange={(value) => handleChange('accountType', value)}
              className="w-full cosmic-select"
              suffixIcon={<BankOutlined className="text-purple-400" />}
              size="large"
            >
              <Select.Option value="SAVINGS">Savings Account</Select.Option>
              <Select.Option value="CURRENT">Current Account</Select.Option>
              <Select.Option value="SALARY">Salary Account</Select.Option>
              <Select.Option value="FIXED_DEPOSIT">Fixed Deposit</Select.Option>
              <Select.Option value="RECURRING_DEPOSIT">Recurring Deposit</Select.Option>
            </Select>
          </div>

          <div className="cosmic-input-group">
            <label className="cosmic-label">Initial Deposit (₹)</label>
            <Input
              type="number"
              name="initialDeposit"
              value={formData.initialDeposit}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="cosmic-input"
              placeholder="Enter initial deposit amount"
              prefix={<DollarOutlined className="text-purple-400" />}
              size="large"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cosmic-input-group">
              <label className="cosmic-label">Branch Code *</label>
              <Input
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
                className="cosmic-input"
                prefix={<IdcardOutlined className="text-purple-400" />}
                size="large"
              />
            </div>

            <div className="cosmic-input-group">
              <label className="cosmic-label">Branch Name *</label>
              <Input
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                className="cosmic-input"
                prefix={<HomeOutlined className="text-purple-400" />}
                size="large"
              />
            </div>
          </div>

          <div className="cosmic-input-group">
            <label className="cosmic-label">IFSC Code</label>
            <Input
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              className="cosmic-input"
              prefix={<SafetyCertificateOutlined className="text-purple-400" />}
              size="large"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cosmic-input-group">
              <label className="cosmic-label">Minimum Balance (₹)</label>
              <Input
                type="number"
                name="minimumBalance"
                value={formData.minimumBalance}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="cosmic-input"
                prefix="₹"
                size="large"
              />
            </div>

            <div className="cosmic-input-group">
              <label className="cosmic-label">Interest Rate (%)</label>
              <Input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="cosmic-input"
                prefix={<PercentageOutlined className="text-purple-400" />}
                size="large"
              />
            </div>
          </div>

          <div className="cosmic-checkbox flex items-center">
            <Checkbox
              name="allowOverdraft"
              checked={formData.allowOverdraft}
              onChange={(e) => handleChange('allowOverdraft', e.target.checked)}
              className="cosmic-toggle-bg"
            >
              <span className="text-gray-300">Allow Overdraft</span>
            </Checkbox>
          </div>

          {formData.allowOverdraft && (
            <div className="cosmic-input-group">
              <label className="cosmic-label">Overdraft Limit (₹)</label>
              <Input
                type="number"
                name="overdraftLimit"
                value={formData.overdraftLimit}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="cosmic-input"
                prefix="₹"
                size="large"
              />
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full cosmic-button cosmic-button-bg h-12 text-lg font-semibold"
          >
            <span className="relative z-10">
              {loading ? 'Creating Account...' : 'Create Cosmic Account'}
            </span>
            <span className="cosmic-button-shine absolute inset-0"></span>
          </Button>
        </form>
      </div>
      
      <style jsx global>{`
        /* AccountForm.css */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .cosmic-bg {
          background: linear-gradient(125deg, #0a081f, #1a173b, #0f0c29);
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .cosmic-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 15% 25%, rgba(120, 40, 200, 0.15) 0%, transparent 25%),
            radial-gradient(circle at 85% 75%, rgba(0, 180, 255, 0.15) 0%, transparent 25%),
            radial-gradient(circle at 50% 50%, rgba(150, 50, 250, 0.1) 0%, transparent 30%);
          animation: cosmic-move 25s infinite alternate;
          z-index: 0;
        }
        
        @keyframes cosmic-move {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0.8;
          }
        }
        
        /* 3D Particles */
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .particle {
          position: absolute;
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 50%;
          opacity: 0.6;
          animation: float-particle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          width: var(--size);
          height: var(--size);
          top: var(--y);
          left: var(--x);
          filter: blur(1px);
          box-shadow: 0 0 10px currentColor;
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate3d(100px, -100px, 0) scale(1.5);
            opacity: 0.8;
          }
        }
        
        .cosmic-card {
          background: rgba(10, 8, 24, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 25px rgba(99, 102, 241, 0.5),
            0 0 40px rgba(139, 92, 246, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          transform: perspective(1000px) rotateX(5deg) translateY(0);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          z-index: 2;
          animation: cosmic-float 8s ease-in-out infinite;
        }
        
        @keyframes cosmic-float {
          0%, 100% {
            transform: perspective(1000px) rotateX(5deg) translateY(0);
          }
          50% {
            transform: perspective(1000px) rotateX(5deg) translateY(-10px);
          }
        }
        
        .cosmic-card:hover {
          transform: perspective(1000px) rotateX(0deg) translateY(-5px);
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.6),
            0 0 30px rgba(99, 102, 241, 0.6),
            0 0 50px rgba(139, 92, 246, 0.5),
            inset 0 0 25px rgba(255, 255, 255, 0.1);
        }
        
        .cosmic-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transform: rotate(45deg);
          animation: cosmic-shine 4s infinite;
          z-index: -1;
        }
        
        @keyframes cosmic-shine {
          0% {
            left: -50%;
          }
          100% {
            left: 150%;
          }
        }
        
        .typing-animation {
          overflow: hidden;
          border-right: 2px solid rgba(99, 102, 241, 0.8);
          white-space: nowrap;
          animation: typing-cursor 1s steps(40, end) infinite;
        }
        
        @keyframes typing-cursor {
          from { border-right-color: rgba(99, 102, 241, 0.8); }
          to { border-right-color: transparent; }
        }
        
        .cosmic-text {
          background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
          background-size: 300% auto;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .cosmic-underline {
          background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #ec4899, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .cosmic-alert {
          backdrop-filter: blur(5px);
          animation: alert-pulse 3s infinite;
          border-width: 1px;
          border-style: solid;
          box-shadow: 0 0 15px currentColor;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .cosmic-alert-error {
          background: rgba(127, 29, 29, 0.3);
          border-color: #f87171;
          color: #fecaca;
        }
        
        .cosmic-alert-success {
          background: rgba(6, 78, 59, 0.3);
          border-color: #34d399;
          color: #a7f3d0;
        }
        
        @keyframes alert-pulse {
          0%, 100% { 
            box-shadow: 0 0 5px currentColor;
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 20px currentColor;
            transform: scale(1.01);
          }
        }
        
        .cosmic-form {
          position: relative;
          z-index: 2;
        }
        
        .cosmic-input-group {
          position: relative;
        }
        
        .cosmic-label {
          color: #d1d5db;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
          text-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
          letter-spacing: 0.5px;
        }
        
        .cosmic-input, .cosmic-select {
          background: rgba(20, 18, 40, 0.7);
          border: 1px solid rgba(99, 102, 241, 0.4);
          border-radius: 12px;
          padding: 0.875rem 1.25rem;
          color: #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.05);
          font-size: 0.95rem;
        }
        
        .cosmic-input:focus, .cosmic-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 
            0 0 20px rgba(99, 102, 241, 0.5),
            inset 0 0 15px rgba(99, 102, 241, 0.1);
          transform: translateY(-3px) scale(1.01);
        }
        
        .cosmic-input::placeholder {
          color: #94a3b8;
        }
        
        .cosmic-checkbox {
          padding: 1rem 0;
        }
        
        .cosmic-toggle-bg {
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
        }
        
        .cosmic-toggle-dot {
          background: linear-gradient(to right, #e2e8f0, #cbd5e1);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        }
        
        .cosmic-button {
          position: relative;
          padding: 1.125rem 2rem;
          border-radius: 14px;
          font-weight: 600;
          color: white;
          border: none;
          overflow: hidden;
          transition: all 0.4s ease;
          transform: perspective(500px) translateZ(0);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
          font-size: 1.05rem;
          letter-spacing: 0.5px;
        }
        
        .cosmic-button:hover:not(:disabled) {
          transform: perspective(500px) translateZ(25px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .cosmic-button:active:not(:disabled) {
          transform: perspective(500px) translateZ(15px);
        }
        
        .cosmic-button-bg {
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #f97316);
          background-size: 300% 300%;
          animation: gradient-move 4s ease infinite;
        }
        
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .cosmic-button-shine {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: skewX(-45deg) translateX(-150%);
          animation: shine 2.5s infinite;
        }
        
        @keyframes shine {
          0% { transform: skewX(-45deg) translateX(-150%); }
          100% { transform: skewX(-45deg) translateX(150%); }
        }
        
        /* 3D depth effect for inputs on focus */
        .cosmic-input-group {
          perspective: 1000px;
        }
        
        .cosmic-input-group .cosmic-input:focus,
        .cosmic-input-group .cosmic-select:focus {
          transform: translateZ(20px);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cosmic-card {
            padding: 1.75rem;
            margin: 1rem;
          }
          
          h2 {
            font-size: 1.75rem;
          }
          
          .cosmic-button {
            padding: 1rem 1.5rem;
          }
        }
        
        /* Ant Design customizations */
        .ant-select-selector {
          background: rgba(20, 18, 40, 0.7) !important;
          border: 1px solid rgba(99, 102, 241, 0.4) !important;
          border-radius: 12px !important;
          color: #e2e8f0 !important;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.05) !important;
        }
        
        .ant-select-arrow {
          color: #6366f1 !important;
        }
        
        .ant-select-focused .ant-select-selector {
          border-color: #6366f1 !important;
          box-shadow: 
            0 0 20px rgba(99, 102, 241, 0.5),
            inset 0 0 15px rgba(99, 102, 241, 0.1) !important;
        }
        
        .ant-checkbox-inner {
          background: rgba(20, 18, 40, 0.7) !important;
          border-color: rgba(99, 102, 241, 0.4) !important;
        }
        
        .ant-checkbox-checked .ant-checkbox-inner {
          background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
          border-color: #6366f1 !important;
        }
        
        .ant-input-affix-wrapper {
          background: rgba(20, 18, 40, 0.7) !important;
          border: 1px solid rgba(99, 102, 241, 0.4) !important;
          border-radius: 12px !important;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.05) !important;
        }
        
        .ant-input-affix-wrapper-focused {
          border-color: #6366f1 !important;
          box-shadow: 
            0 0 20px rgba(99, 102, 241, 0.5),
            inset 0 0 15px rgba(99, 102, 241, 0.1) !important;
        }
        
        .ant-input {
          background: transparent !important;
          color: #e2e8f0 !important;
        }
        
        .ant-input::placeholder {
          color: #94a3b8 !important;
        }
        
        .ant-alert {
          border: none !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
};

export default AccountForm;