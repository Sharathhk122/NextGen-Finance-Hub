// src/pages/transaction/TransactionHistory.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { transactionAPI } from '../../api/transaction';
import { accountAPI } from '../../api/account';
import { useAuth } from '../../hooks/useAuth';
import TransactionCard from '../../components/transaction/TransactionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

// 3D Background Component
const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas>
        <AnimatedSphere position={[0, 0, 0]} color="#10b981" />
        <AnimatedSphere position={[3, 2, -5]} color="#8b5cf6" />
        <AnimatedSphere position={[-4, -1, -7]} color="#0ea5e9" />
        <AnimatedSphere position={[5, -3, -10]} color="#f59e0b" />
      </Canvas>
    </div>
  );
};

const AnimatedSphere = ({ position, color }) => {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });
  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  );
};

// Type animation component
const TypeAnimation = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50 + delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);
  return <span>{displayText}</span>;
};

const TransactionHistory = () => {
  const { accountNumber } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  useAuth();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(accountNumber || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount, searchParams]);

  const fetchUserAccounts = async () => {
    try {
      const response = await accountAPI.getUserAccounts();
      setAccounts(response.data);
      if (response.data.length > 0) {
        const defaultAccount = accountNumber || response.data[0].accountNumber;
        setSelectedAccount(defaultAccount);
        if (accountNumber) {
          setSearchParams({ account: accountNumber });
        }
      }
    } catch (err) {
      setError('Failed to fetch accounts');
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let response;
      const account = selectedAccount;
      if (startDate && endDate) {
        response = await transactionAPI.getTransactionHistoryBetweenDates(account, startDate, endDate);
      } else {
        response = await transactionAPI.getTransactionHistory(account);
      }
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const account = e.target.value;
    setSelectedAccount(account);
    setSearchParams({ account });
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchParams({ account: selectedAccount });
    fetchTransactions();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 relative overflow-hidden flex items-center justify-center">
      <BackgroundAnimation />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Title */}
        <div className="flex items-center justify-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TypeAnimation text="Transaction History" />
          </motion.h1>
        </div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-6 backdrop-blur-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/40 p-6 rounded-2xl shadow-2xl mb-8 backdrop-blur-md border border-gray-700/50"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-cyan-200 text-sm font-semibold mb-3">Select Account</label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={selectedAccount}
                onChange={handleAccountChange}
                className="w-full px-4 py-3 bg-gray-700/60 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
              >
                {accounts.map(account => (
                  <option key={account.accountNumber} value={account.accountNumber}>
                    {account.accountNumber} - {account.accountType.replace('_', ' ')}
                  </option>
                ))}
              </motion.select>
            </div>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleDateFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-cyan-200 text-sm font-semibold mb-3">Start Date</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/60 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
              />
            </div>
            <div>
              <label className="block text-cyan-200 text-sm font-semibold mb-3">End Date</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/60 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
              />
            </div>
            <div className="flex items-end space-x-3 col-span-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Filter
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={clearFilters}
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Clear
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        {/* Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/40 p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700/50"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"
              ></motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="text-cyan-300"
              >
                Loading transactions...
              </motion.span>
            </div>
          ) : transactions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                💸
              </motion.div>
              <p className="text-gray-400 text-xl">No transactions found</p>
              <p className="text-gray-500 mt-2">Try selecting a different account or date range</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
              <AnimatePresence>
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <TransactionCard transaction={transaction} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TransactionHistory;
