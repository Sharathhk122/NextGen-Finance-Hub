import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI } from '../../api/loan';
import { accountAPI } from '../../api/account';
import { useAuth } from '../../hooks/useAuth';
import { Card, Input, Select, Button, notification, Progress } from 'antd';
import { UserOutlined, DollarOutlined, CalendarOutlined, AccountBookOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Option } = Select;

const LoanForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    loanType: 'PERSONAL_LOAN',
    loanAmount: '',
    tenureMonths: '12',
    accountNumber: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emiPreview, setEmiPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchUserAccounts();
    initBackgroundAnimation();
    
    return () => {
      if (canvasRef.current) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  let animationFrameId = null;

  const initBackgroundAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const fetchUserAccounts = async () => {
    try {
      const response = await accountAPI.getUserAccounts();
      const accountsData = Array.isArray(response.data) ? response.data : 
                          response.data.data || response.data.content || [];
      setAccounts(accountsData);
      if (accountsData.length > 0) {
        setFormData(prev => ({
          ...prev,
          accountNumber: accountsData[0].accountNumber
        }));
      }
    } catch (err) {
      setError('Failed to fetch accounts');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch your accounts. Please try again.',
        placement: 'topRight',
      });
    }
  };

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / 1200; // Monthly interest rate
    const factor = Math.pow(1 + monthlyRate, tenure);
    return (principal * monthlyRate * factor) / (factor - 1);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate EMI preview when loan details change
    if (name === 'loanAmount' || name === 'tenureMonths' || name === 'loanType') {
      const amount = name === 'loanAmount' ? parseFloat(value) || 0 : parseFloat(formData.loanAmount) || 0;
      const tenure = name === 'tenureMonths' ? parseInt(value) || 12 : parseInt(formData.tenureMonths) || 12;
      const loanType = name === 'loanType' ? value : formData.loanType;
      
      if (amount > 0 && tenure > 0) {
        const interestRates = {
          'PERSONAL_LOAN': 12.0,
          'HOME_LOAN': 8.5,
          'CAR_LOAN': 9.5,
          'EDUCATION_LOAN': 7.5,
          'BUSINESS_LOAN': 11.0
        };
        
        const rate = interestRates[loanType] || 10.0;
        const emi = calculateEMI(amount, rate, tenure);
        const totalPayable = emi * tenure;
        
        setEmiPreview({
          emiAmount: emi.toFixed(2),
          totalPayableAmount: totalPayable.toFixed(2),
          interestRate: rate
        });
      } else {
        setEmiPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        ...formData,
        loanAmount: parseFloat(formData.loanAmount),
        tenureMonths: parseInt(formData.tenureMonths)
      };

      const response = await loanAPI.applyForLoan(submitData);
      setSuccess('Loan application submitted successfully!');
      
      notification.success({
        message: 'Application Submitted',
        description: 'Your loan application has been submitted successfully!',
        placement: 'topRight',
      });
      
      setTimeout(() => {
        navigate('/loans');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit loan application';
      setError(errorMsg);
      notification.error({
        message: 'Application Failed',
        description: errorMsg,
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const loanTypeOptions = [
    { value: 'PERSONAL_LOAN', label: 'Personal Loan', icon: '👤' },
    { value: 'HOME_LOAN', label: 'Home Loan', icon: '🏠' },
    { value: 'CAR_LOAN', label: 'Car Loan', icon: '🚗' },
    { value: 'EDUCATION_LOAN', label: 'Education Loan', icon: '🎓' },
    { value: 'BUSINESS_LOAN', label: 'Business Loan', icon: '💼' },
  ];

  const tenureOptions = [6, 12, 24, 36, 48, 60, 72, 84];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl mx-4"
      >
        <Card 
          className="rounded-2xl shadow-2xl border-0 bg-opacity-90 bg-slate-900 backdrop-blur-md"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Progress and Info */}
            <div className="bg-gradient-to-b from-blue-600 to-purple-700 p-8 rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl text-white md:w-2/5">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-2">Loan Application</h2>
                <p className="text-blue-100 mb-6">Complete your application in just a few steps</p>
                
                <div className="mb-8">
                  <Progress 
                    percent={(currentStep / 3) * 100} 
                    showInfo={false}
                    strokeColor="#fff"
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>Step {currentStep} of 3</span>
                    <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${currentStep >= 1 ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                      1
                    </div>
                    <span>Loan Details</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${currentStep >= 2 ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                      2
                    </div>
                    <span>Account Selection</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${currentStep >= 3 ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                      3
                    </div>
                    <span>Review & Submit</span>
                  </div>
                </div>
                
                {emiPreview && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-8 p-4 bg-blue-800 bg-opacity-50 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">Loan Preview</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>{emiPreview.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly EMI:</span>
                        <span>₹{parseFloat(emiPreview.emiAmount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Payable:</span>
                        <span>₹{parseFloat(emiPreview.totalPayableAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Right Side - Form */}
            <div className="p-8 md:w-3/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {currentStep === 1 && 'Loan Details'}
                    {currentStep === 2 && 'Account Selection'}
                    {currentStep === 3 && 'Review Application'}
                  </h3>
                  
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Loan Details */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Loan Type
                          </label>
                          <Select
                            value={formData.loanType}
                            onChange={(value) => handleChange('loanType', value)}
                            size="large"
                            className="w-full"
                          >
                            {loanTypeOptions.map(option => (
                              <Option key={option.value} value={option.value}>
                                <span className="mr-2">{option.icon}</span> {option.label}
                              </Option>
                            ))}
                          </Select>
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Loan Amount (₹)
                          </label>
                          <Input
                            type="number"
                            value={formData.loanAmount}
                            onChange={(e) => handleChange('loanAmount', e.target.value)}
                            min="1000"
                            step="1000"
                            required
                            size="large"
                            prefix={<DollarOutlined className="text-gray-400" />}
                            className="w-full"
                            placeholder="Enter loan amount"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tenure (Months)
                          </label>
                          <Select
                            value={formData.tenureMonths}
                            onChange={(value) => handleChange('tenureMonths', value)}
                            size="large"
                            className="w-full"
                          >
                            {tenureOptions.map(option => (
                              <Option key={option} value={option.toString()}>
                                {option} months
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Account Selection */}
                    {currentStep === 2 && (
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Linked Account
                        </label>
                        <Select
                          value={formData.accountNumber}
                          onChange={(value) => handleChange('accountNumber', value)}
                          size="large"
                          className="w-full"
                        >
                          {accounts.map(account => (
                            <Option key={account.accountNumber} value={account.accountNumber}>
                              {account.accountNumber} - {account.accountType.replace('_', ' ')} (₹{account.balance.toLocaleString('en-IN')})
                            </Option>
                          ))}
                        </Select>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-6 p-4 bg-blue-50 rounded-lg"
                        >
                          <h4 className="font-semibold text-blue-800 mb-2">Why we need your account?</h4>
                          <p className="text-sm text-blue-700">
                            We need your account information to disburse the loan amount upon approval and set up automatic EMI deductions.
                            Your data is secure and encrypted.
                          </p>
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-800 mb-3">Loan Details</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-gray-600 text-sm">Loan Type</p>
                              <p className="font-medium">
                                {loanTypeOptions.find(opt => opt.value === formData.loanType)?.label}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm">Loan Amount</p>
                              <p className="font-medium">₹{parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm">Tenure</p>
                              <p className="font-medium">{formData.tenureMonths} months</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm">Linked Account</p>
                              <p className="font-medium">{formData.accountNumber}</p>
                            </div>
                          </div>
                        </div>
                        
                        {emiPreview && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-blue-50 p-4 rounded-lg"
                          >
                            <h4 className="font-bold text-blue-800 mb-3">EMI Breakdown</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-blue-600 text-sm">Monthly EMI</p>
                                <p className="font-medium text-blue-800">₹{parseFloat(emiPreview.emiAmount).toLocaleString('en-IN')}</p>
                              </div>
                              <div>
                                <p className="text-blue-600 text-sm">Interest Rate</p>
                                <p className="font-medium text-blue-800">{emiPreview.interestRate}%</p>
                              </div>
                              <div>
                                <p className="text-blue-600 text-sm">Total Payable</p>
                                <p className="font-medium text-blue-800">₹{parseFloat(emiPreview.totalPayableAmount).toLocaleString('en-IN')}</p>
                              </div>
                              <div>
                                <p className="text-blue-600 text-sm">Total Interest</p>
                                <p className="font-medium text-blue-800">
                                  ₹{(parseFloat(emiPreview.totalPayableAmount) - parseFloat(formData.loanAmount || 0)).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-green-800 mb-2">Almost Done!</h4>
                          <p className="text-sm text-green-700">
                            Review your information and click Submit to complete your application.
                            You'll receive a confirmation email shortly.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 ? (
                        <Button
                          size="large"
                          onClick={prevStep}
                          className="flex items-center"
                        >
                          Previous
                        </Button>
                      ) : (
                        <div></div>
                      )}
                      
                      {currentStep < 3 ? (
                        <Button
                          type="primary"
                          size="large"
                          onClick={nextStep}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          loading={loading}
                          className="bg-green-600 hover:bg-green-700 flex items-center"
                        >
                          Submit Application
                        </Button>
                      )}
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoanForm;