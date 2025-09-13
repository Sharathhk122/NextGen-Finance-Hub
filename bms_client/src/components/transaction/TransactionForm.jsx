// src/components/transaction/TransactionForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { accountAPI } from '../../api/account';
import { motion } from 'framer-motion';

const TransactionForm = ({ type, onSubmit, loading }) => {
  useAuth();
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    description: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetchUserAccounts();
  }, []);

  const fetchUserAccounts = async () => {
    try {
      const response = await accountAPI.getUserAccounts();
      setAccounts(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, accountNumber: response.data[0].accountNumber }));
      }
    } catch (err) {
      setError('Failed to fetch accounts');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.accountNumber || !formData.amount) {
      setError('Please fill all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    onSubmit({
      accountNumber: formData.accountNumber,
      amount: parseFloat(formData.amount),
      description: formData.description || `${type} transaction`
    });
  };

  // Animation variants
  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </h2>
            <p className="text-indigo-300 mt-3">
              {type === 'deposit' 
                ? 'Add money to your account' 
                : 'Withdraw money from your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                className="bg-red-900/80 border border-red-700 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {/* Account select */}
            <div className="mb-8">
              <label className="block text-indigo-300 text-sm font-bold mb-3">
                Select Account
              </label>
              <motion.div 
                className="relative"
                whileFocus="focus"
                variants={inputVariants}
              >
                <select
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 text-lg bg-gray-800/70 border-2 border-indigo-500/30 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             text-indigo-100 backdrop-blur-sm transition-all duration-300 h-16"
                >
                  {accounts.map(account => (
                    <option key={account.accountNumber} value={account.accountNumber}>
                      {account.accountNumber} - {account.accountType.replace('_', ' ')} (₹{account.balance.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Amount */}
            <div className="mb-8">
              <label className="block text-indigo-300 text-sm font-bold mb-3">
                Amount (₹)
              </label>
              <motion.div 
                className="relative"
                whileFocus="focus"
                variants={inputVariants}
              >
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-6 py-4 text-lg bg-gray-800/70 border-2 border-indigo-500/30 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             text-indigo-100 backdrop-blur-sm transition-all duration-300 h-16"
                />
              </motion.div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <label className="block text-indigo-300 text-sm font-bold mb-3">
                Description (Optional)
              </label>
              <motion.div 
                className="relative"
                whileFocus="focus"
                variants={inputVariants}
              >
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="w-full px-6 py-4 text-lg bg-gray-800/70 border-2 border-indigo-500/30 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             text-indigo-100 backdrop-blur-sm transition-all duration-300 h-16"
                />
              </motion.div>
            </div>

            {/* Submit button */}
            <div className="mt-12">
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600
                           hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl
                           shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           relative overflow-hidden group"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {type === 'deposit' ? 'Process Deposit' : 'Process Withdrawal'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </span>
                
                {/* Animated background effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                {/* Moving shine effect */}
                <motion.div 
                  className="absolute top-0 -inset-x-12 h-20 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionForm;