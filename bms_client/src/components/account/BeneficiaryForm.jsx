import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { beneficiaryAPI } from '../../api/beneficiary';
import { useAuth } from '../../hooks/useAuth';

const BeneficiaryForm = () => {
  const navigate = useNavigate();
  useAuth();
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountHolderName: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    nickname: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await beneficiaryAPI.addBeneficiary(formData);
      setSuccess('Beneficiary added successfully!');
      
      setTimeout(() => {
        navigate('/beneficiaries');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add beneficiary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `linear-gradient(${Math.random() * 360}deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-3xl mx-auto transform transition-all duration-500 hover:scale-[1.01]">
        {/* 3D Card Container */}
        <div className="relative">
          {/* 3D shadow effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 rounded-2xl blur-2xl opacity-60 -z-10"></div>
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-10 transform transition-transform duration-700 hover:translate-y-[-5px]">
            {/* 3D top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            
            <h2 className="text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Add Beneficiary
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl mb-8 transform transition-all duration-300 animate-pulse text-lg">
                <div className="flex items-center">
                  <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-200 px-6 py-4 rounded-xl mb-8 transform transition-all duration-300 text-lg">
                <div className="flex items-center">
                  <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {success}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-cyan-300 text-lg font-bold mb-3">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-lg"
                  placeholder="Enter beneficiary account number"
                />
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-cyan-300 text-lg font-bold mb-3">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-lg"
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-cyan-300 text-lg font-bold mb-3">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-lg"
                  placeholder="Enter bank name"
                />
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-cyan-300 text-lg font-bold mb-3">
                  Branch Name
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-lg"
                  placeholder="Enter branch name"
                />
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-cyan-300 text-lg font-bold mb-3">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-lg"
                  placeholder="Enter IFSC code"
                />
              </div>

              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-cyan-300 text-lg font-bold mb-3">
                  Nickname *
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 text-lg"
                  placeholder="Enter a nickname for this beneficiary"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center text-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Beneficiary...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Beneficiary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BeneficiaryForm;