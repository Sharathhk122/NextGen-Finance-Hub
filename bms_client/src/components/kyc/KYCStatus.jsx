// src/pages/kyc/KYCStatus.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kycAPI } from '../../api/kyc';

const KYCStatus = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const response = await kycAPI.getKYCStatus();
      setKycData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('KYC_NOT_FOUND');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch KYC status');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-green-500/30';
      case 'REJECTED': return 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-lg shadow-red-500/30';
      case 'PENDING': return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30';
      default: return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-lg shadow-gray-500/30';
    }
  };

  const getDocumentTypeText = (type) => {
    if (!type) return 'N/A';
    return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 animate-gradient-x">
        <div className="relative max-w-2xl w-full mx-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-700 hover:scale-105">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full animate-ping absolute"></div>
              </div>
            </div>
            <div className="text-center text-white text-xl font-semibold">Loading KYC status...</div>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error !== 'KYC_NOT_FOUND') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="relative max-w-2xl w-full mx-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-500">
          <div className="bg-red-400/20 border border-red-500/30 text-white px-6 py-4 rounded-2xl mb-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>{error}</p>
            </div>
          </div>
          <div className="text-center">
            <Link to="/kyc/submit" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
              Submit KYC Documents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 animate-gradient-x">
      <div className="relative max-w-2xl mx-auto px-4">
        {/* 3D Animated Background Elements */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            KYC Status
          </h2>

          {kycData ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-cyan-100">Status:</label>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(kycData.status)} animate-pulse`}>
                    {kycData.status}
                  </span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-cyan-100">Document Type:</label>
                  <p className="text-white">{getDocumentTypeText(kycData.documentType)}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-cyan-100">Document Number:</label>
                  <p className="text-white">{kycData.documentNumber || 'N/A'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-cyan-100">Submitted At:</label>
                  <p className="text-white">{new Date(kycData.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {kycData.verifiedAt && (
                <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-cyan-100">Verified At:</label>
                  <p className="text-white">{new Date(kycData.verifiedAt).toLocaleDateString()}</p>
                </div>
              )}

              {kycData.verifiedBy && (
                <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-cyan-100">Verified By:</label>
                  <p className="text-white">{kycData.verifiedBy}</p>
                </div>
              )}

              {kycData.rejectionReason && (
                <div className="p-4 bg-red-500/10 rounded-2xl backdrop-blur-sm border border-red-500/20 transform transition-all duration-300 hover:scale-105">
                  <label className="font-semibold block mb-2 text-red-200">Rejection Reason:</label>
                  <p className="text-red-100 bg-red-500/10 p-3 rounded-xl">{kycData.rejectionReason}</p>
                </div>
              )}

              {kycData.status === 'REJECTED' && (
                <div className="mt-8 text-center">
                  <Link
                    to="/kyc/submit"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Resubmit KYC
                  </Link>
                </div>
              )}

              {kycData.status === 'PENDING' && (
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 text-blue-100 rounded-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center animate-spin">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Your KYC is under review</p>
                      <p>Please check back later for updates.</p>
                    </div>
                  </div>
                </div>
              )}

              {kycData.status === 'APPROVED' && (
                <div className="p-6 bg-green-500/10 border border-green-500/30 text-green-100 rounded-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Your KYC has been approved!</p>
                      <p>You can now access all banking services.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="mb-6 text-white/80">No KYC submission found.</p>
              <Link
                to="/kyc/submit"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Submit KYC Documents
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCStatus;