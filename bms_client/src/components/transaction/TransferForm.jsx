// src/components/transaction/TransferForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { accountAPI } from '../../api/account';
import { beneficiaryAPI } from '../../api/beneficiary';
import { motion, useAnimation } from 'framer-motion';
import { Input, Select, Checkbox, Button } from 'antd';
import { 
  UserOutlined, 
  AccountBookOutlined, 
  DollarOutlined, 
  FileTextOutlined,
  SafetyCertificateOutlined,
  SwapOutlined
} from '@ant-design/icons';

const { Option, OptGroup } = Select;

const TransferForm = ({ onSubmit, loading, fromAccount, toAccount }) => {
  useAuth();
  const [formData, setFormData] = useState({
    fromAccountNumber: fromAccount || '',
    toAccountNumber: toAccount || '',
    amount: '',
    description: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isExternal, setIsExternal] = useState(false);
  const [error, setError] = useState('');
  const controls = useAnimation();

  useEffect(() => {
    fetchUserAccounts();
    fetchUserBeneficiaries();
  }, []);

  useEffect(() => {
    if (fromAccount) {
      setFormData(prev => ({ ...prev, fromAccountNumber: fromAccount }));
    }
    if (toAccount) {
      setFormData(prev => ({ ...prev, toAccountNumber: toAccount }));
    }
  }, [fromAccount, toAccount]);

  useEffect(() => {
    const animateBackground = async () => {
      while (true) {
        await controls.start({
          backgroundPosition: ['0% 0%', '100% 100%'],
          transition: { duration: 20, ease: 'linear' }
        });
        await controls.start({
          backgroundPosition: ['100% 100%', '0% 0%'],
          transition: { duration: 20, ease: 'linear' }
        });
      }
    };
    
    animateBackground();
  }, [controls]);

  const fetchUserAccounts = async () => {
    try {
      const response = await accountAPI.getUserAccounts();
      setAccounts(response.data);
      if (response.data.length > 0 && !fromAccount) {
        setFormData(prev => ({ ...prev, fromAccountNumber: response.data[0].accountNumber }));
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to fetch accounts');
    }
  };

  const fetchUserBeneficiaries = async () => {
    try {
      const response = await beneficiaryAPI.getUserBeneficiaries();
      setBeneficiaries(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error('Failed to fetch beneficiaries');
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fromAccountNumber || !formData.toAccountNumber || !formData.amount) {
      setError('Please fill all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (formData.fromAccountNumber === formData.toAccountNumber) {
      setError('Cannot transfer to the same account');
      return;
    }

    onSubmit({
      fromAccountNumber: formData.fromAccountNumber,
      toAccountNumber: formData.toAccountNumber,
      amount: parseFloat(formData.amount),
      description: formData.description || 'Fund transfer'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const glowAnimation = {
    boxShadow: [
      "0 0 5px rgba(6, 182, 212, 0.5)",
      "0 0 20px rgba(6, 182, 212, 0.8)",
      "0 0 5px rgba(6, 182, 212, 0.5)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      className="relative p-8 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={controls}
        style={{
          background: `linear-gradient(
            45deg, 
            rgba(6, 182, 212, 0.1) 0%, 
            rgba(192, 38, 211, 0.1) 25%, 
            rgba(6, 182, 212, 0.1) 50%, 
            rgba(192, 38, 211, 0.1) 75%, 
            rgba(6, 182, 212, 0.1) 100%
          )`,
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* 3D border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-clip-padding backdrop-filter backdrop-blur-sm" 
           style={{
            backgroundImage: `linear-gradient(135deg, 
              rgba(6, 182, 212, 0.5), 
              rgba(192, 38, 211, 0.5),
              rgba(6, 182, 212, 0.5)
            )`,
            boxShadow: `
              0 10px 30px rgba(6, 182, 212, 0.3),
              0 15px 35px rgba(192, 38, 211, 0.2),
              inset 0 1px 1px rgba(255, 255, 255, 0.1)
            `
           }} 
      />
      
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-cyan-300"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.span
          animate={{ 
            textShadow: [
              "0 0 5px rgba(6, 182, 212, 0.5)",
              "0 0 15px rgba(6, 182, 212, 0.8)",
              "0 0 5px rgba(6, 182, 212, 0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block"
        >
          Fund Transfer
        </motion.span>
      </motion.h2>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-6 relative"
      >
        {/* Floating elements for 3D effect */}
        <motion.div
          className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-cyan-500/10 blur-xl"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-purple-500/10 blur-xl"
          animate={{
            ...floatingAnimation,
            y: [0, 10, 0],
            transition: { ...floatingAnimation.transition, delay: 1 }
          }}
        />

        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-900/40 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative">
          <label className="block text-cyan-300 text-sm font-bold mb-2 bg-gray-900/50 px-2 py-1 rounded-t-lg inline-block">
            From Account
          </label>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <Select
              placeholder="Select account"
              value={formData.fromAccountNumber}
              onChange={(value) => handleChange('fromAccountNumber', value)}
              required
              className="w-full transfer-select"
              suffixIcon={<AccountBookOutlined className="text-cyan-400" />}
              dropdownClassName="bg-gray-900 border border-cyan-500/30 backdrop-blur-md"
              variant="filled"
            >
              {accounts.map(account => (
                <Option 
                  key={account.accountNumber} 
                  value={account.accountNumber}
                  className="bg-gray-800 hover:bg-cyan-900/30 text-gray-200"
                >
                  {account.accountNumber} - {account.accountType.replace('_', ' ')} (₹{account.balance.toLocaleString('en-IN')})
                </Option>
              ))}
            </Select>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex justify-center my-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <SwapOutlined className="text-cyan-400/60 text-xl" />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div className="flex items-center mb-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Checkbox
                id="externalTransfer"
                checked={isExternal}
                onChange={() => setIsExternal(!isExternal)}
                className="text-cyan-400 [&>.ant-checkbox-inner]:bg-gray-800"
              >
                <span className="text-cyan-300">Transfer to external account</span>
              </Checkbox>
            </motion.div>
          </div>

          <label className="block text-cyan-300 text-sm font-bold mb-2 bg-gray-900/50 px-2 py-1 rounded-t-lg inline-block">
            {isExternal ? 'Recipient Account Number' : 'To Account'}
          </label>
          
          {isExternal ? (
            <motion.div 
              whileHover={{ scale: 1.01 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Input
                prefix={<UserOutlined className="text-cyan-400" />}
                type="text"
                value={formData.toAccountNumber}
                onChange={(e) => handleChange('toAccountNumber', e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 text-cyan-100 h-12"
                placeholder="Enter recipient account number"
                variant="filled"
              />
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.01 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Select
                placeholder="Select recipient account"
                value={formData.toAccountNumber}
                onChange={(value) => handleChange('toAccountNumber', value)}
                required
                className="w-full transfer-select"
                suffixIcon={<UserOutlined className="text-cyan-400" />}
                dropdownClassName="bg-gray-900 border border-cyan-500/30 backdrop-blur-md"
                variant="filled"
              >
                <Option value="" className="bg-gray-800 text-gray-400" disabled>
                  Select an account
                </Option>
                <OptGroup label="My Accounts" className="text-cyan-300 [&>.ant-select-item-group-label]:bg-gray-900">
                  {accounts.map(account => (
                    <Option 
                      key={account.accountNumber} 
                      value={account.accountNumber}
                      className="bg-gray-800 hover:bg-cyan-900/30 text-gray-200"
                    >
                      {account.accountNumber} - {account.accountType.replace('_', ' ')}
                    </Option>
                  ))}
                </OptGroup>
                {beneficiaries.length > 0 && (
                  <OptGroup label="Beneficiaries" className="text-purple-300 [&>.ant-select-item-group-label]:bg-gray-900">
                    {beneficiaries.map(beneficiary => (
                      <Option 
                        key={beneficiary.id} 
                        value={beneficiary.accountNumber}
                        className="bg-gray-800 hover:bg-purple-900/30 text-gray-200"
                      >
                        {beneficiary.nickname} - {beneficiary.accountNumber}
                      </Option>
                    ))}
                  </OptGroup>
                )}
              </Select>
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <label className="block text-cyan-300 text-sm font-bold mb-2 bg-gray-900/50 px-2 py-1 rounded-t-lg inline-block">
            Amount (₹)
          </label>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <Input
              prefix={<DollarOutlined className="text-cyan-400" />}
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              min="0.01"
              step="0.01"
              required
              className="bg-gray-800/50 border-gray-700 text-cyan-100 h-12"
              placeholder="Enter amount"
              variant="filled"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <label className="block text-cyan-300 text-sm font-bold mb-2 bg-gray-900/50 px-2 py-1 rounded-t-lg inline-block">
            Description (Optional)
          </label>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <Input
              prefix={<FileTextOutlined className="text-cyan-400" />}
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-cyan-100 h-12"
              placeholder="Enter description"
              variant="filled"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 25px rgba(6, 182, 212, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            animate={glowAnimation}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-14 bg-gradient-to-r from-cyan-600 to-purple-600 border-0 font-bold text-lg shadow-lg backdrop-blur-sm"
              size="large"
              icon={loading ? null : <SafetyCertificateOutlined />}
            >
              {loading ? 'Processing...' : 'Transfer Funds'}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center pt-4 text-cyan-400 text-xs flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center"
          >
            <SafetyCertificateOutlined className="mr-1" />
            Secure & Encrypted Transaction
          </motion.div>
        </motion.div>
      </motion.form>

      <style jsx>{`
        :global(.transfer-select .ant-select-selector) {
          background-color: rgba(31, 41, 55, 0.5) !important;
          border-color: rgba(75, 85, 99, 0.5) !important;
          color: rgb(207, 250, 254) !important;
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
        }
        
        :global(.transfer-select .ant-select-selection-placeholder) {
          color: rgba(207, 250, 254, 0.6) !important;
        }
        
        :global(.ant-input-affix-wrapper) {
          background-color: rgba(31, 41, 55, 0.5) !important;
          border-color: rgba(75, 85, 99, 0.5) !important;
          color: rgb(207, 250, 254) !important;
        }
        
        :global(.ant-input) {
          background-color: transparent !important;
          color: rgb(207, 250, 254) !important;
        }
        
        :global(.ant-input::placeholder) {
          color: rgba(207, 250, 254, 0.6) !important;
        }
        
        :global(.ant-select-dropdown) {
          backdrop-filter: blur(10px) !important;
        }
        
        :global(.ant-checkbox-checked .ant-checkbox-inner) {
          background-color: rgba(6, 182, 212) !important;
          border-color: rgba(6, 182, 212) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default TransferForm;