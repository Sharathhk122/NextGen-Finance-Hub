import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { beneficiaryAPI } from '../../api/beneficiary';
import BeneficiaryCard from './BeneficiaryCard';
import { useAuth } from '../../hooks/useAuth';

const BeneficiaryList = () => {
  useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await beneficiaryAPI.getUserBeneficiaries();
      setBeneficiaries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await beneficiaryAPI.deleteBeneficiary(id);
      setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete beneficiary');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-300"></div>
            <div className="absolute top-0 left-0 rounded-full h-16 w-16 border-r-4 border-l-4 border-pink-300 animate-pulse"></div>
          </div>
          <span className="ml-2 text-white text-xl mt-4 font-light">
            Loading beneficiaries...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6 flex items-center justify-center">
      {/* Subtle background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="relative z-10">
          {/* Header section */}
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl font-bold text-white text-center mb-4">
              My Beneficiaries
            </h1>
            <div className="h-1 w-20 bg-white rounded-full mb-6"></div>
            
            <Link
              to="/beneficiaries/new"
              className="bg-white text-indigo-900 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add Beneficiary
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white px-6 py-4 rounded-lg mb-8 text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {beneficiaries.length === 0 ? (
            <div className="flex justify-center w-full"> {/* Added this wrapper div */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-center max-w-2xl w-full">
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-white">No Beneficiaries Found</h2>
                <p className="text-white opacity-80 mb-6">You haven't added any beneficiaries yet. Add beneficiaries to make quick transfers.</p>
                <Link
                  to="/beneficiaries/new"
                  className="inline-block bg-white text-indigo-900 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Add Your First Beneficiary
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {beneficiaries.map(beneficiary => (
                <BeneficiaryCard 
                  key={beneficiary.id} 
                  beneficiary={beneficiary} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryList;