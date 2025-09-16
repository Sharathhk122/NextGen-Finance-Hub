import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kycAPI } from '../../api/kyc';
import './KYCStatus.css'; // We'll create this CSS file for advanced animations

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
      case 'APPROVED': return 'bg-gradient-to-r from-emerald-700 to-green-500 text-emerald-50';
      case 'REJECTED': return 'bg-gradient-to-r from-rose-700 to-red-500 text-rose-50';
      case 'PENDING': return 'bg-gradient-to-r from-amber-700 to-yellow-500 text-amber-50';
      default: return 'bg-gradient-to-r from-slate-700 to-gray-500 text-slate-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return '✓';
      case 'REJECTED': return '✗';
      case 'PENDING': return '⏳';
      default: return '?';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+PC9zdmc+')] opacity-20 animate-pulse-slow"></div>
        <div className="floating-animation bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 w-80 h-80 rounded-full absolute -top-40 -left-40"></div>
        <div className="floating-animation-delayed bg-gradient-to-br from-amber-600/10 via-transparent to-rose-600/10 w-96 h-96 rounded-full absolute -bottom-40 -right-40"></div>
        
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/50 w-full max-w-2xl mx-4 transform-style-3d rotate-x-5">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 animate-spin-slow flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-animation"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent typewriter-animation">
              Loading KYC status...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error && error !== 'KYC_NOT_FOUND') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+PC9zdmc+')] opacity-20"></div>
        <div className="floating-animation bg-gradient-to-br from-rose-600/10 via-transparent to-amber-600/10 w-80 h-80 rounded-full absolute -top-40 -left-40"></div>
        
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/50 w-full max-w-2xl mx-4 transform-style-3d rotate-x-5">
          <div className="bg-rose-900/40 border border-rose-700/50 text-rose-200 px-6 py-4 rounded-2xl mb-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-4 text-2xl">⚠️</div>
              <div>{error}</div>
            </div>
          </div>
          <div className="text-center">
            <Link 
              to="/kyc/submit" 
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-purple-500/20"
            >
              Submit KYC Documents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+PC9zdmc+')] opacity-20"></div>
      <div className="floating-animation bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 w-80 h-80 rounded-full absolute -top-40 -left-40"></div>
      <div className="floating-animation-delayed bg-gradient-to-br from-amber-600/10 via-transparent to-rose-600/10 w-96 h-96 rounded-full absolute -bottom-40 -right-40"></div>
      
      <div className="relative z-10 bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/50 w-full max-w-2xl mx-4 transform-style-3d rotate-x-5">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
          KYC Status
        </h2>

        {kycData ? (
          <div className="space-y-6">
            {/* Status Card with 3D effect */}
            <div className={`${getStatusColor(kycData.status)} p-5 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-102 hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Verification Status</h3>
                  <p className="text-sm opacity-90">Current KYC verification status</p>
                </div>
                <div className="text-3xl font-bold flex items-center">
                  <span className="mr-2">{getStatusIcon(kycData.status)}</span>
                  <span className="px-3 py-1 rounded-full text-sm uppercase tracking-wider shadow-inner">
                    {kycData.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/70 transition-colors duration-300">
                <label className="font-semibold text-slate-300 block mb-2">Document Type</label>
                <p className="text-cyan-300">{kycData.documentType}</p>
              </div>
              
              <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/70 transition-colors duration-300">
                <label className="font-semibold text-slate-300 block mb-2">Document Number</label>
                <p className="text-cyan-300">{kycData.documentNumber}</p>
              </div>
              
              <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/70 transition-colors duration-300">
                <label className="font-semibold text-slate-300 block mb-2">Submitted At</label>
                <p className="text-cyan-300">{new Date(kycData.submittedAt).toLocaleDateString()}</p>
              </div>
              
              {kycData.verifiedAt && (
                <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/70 transition-colors duration-300">
                  <label className="font-semibold text-slate-300 block mb-2">Verified At</label>
                  <p className="text-cyan-300">{new Date(kycData.verifiedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {kycData.verifiedBy && (
              <div className="bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/70 transition-colors duration-300">
                <label className="font-semibold text-slate-300 block mb-2">Verified By</label>
                <p className="text-cyan-300">{kycData.verifiedBy}</p>
              </div>
            )}

            {kycData.rejectionReason && (
              <div className="bg-rose-900/30 p-5 rounded-2xl border border-rose-700/50 backdrop-blur-sm">
                <label className="font-semibold text-rose-300 block mb-2">Rejection Reason</label>
                <p className="text-rose-200">{kycData.rejectionReason}</p>
              </div>
            )}

            {kycData.status === 'REJECTED' && (
              <div className="text-center mt-6">
                <Link
                  to="/kyc/submit"
                  className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-purple-500/20"
                >
                  Resubmit KYC
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center shadow-inner">
                <div className="text-4xl">📄</div>
              </div>
            </div>
            <p className="text-slate-300 mb-6 text-lg">No KYC submission found.</p>
            <Link
              to="/kyc/submit"
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-purple-500/20"
            >
              Submit KYC Documents
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCStatus;