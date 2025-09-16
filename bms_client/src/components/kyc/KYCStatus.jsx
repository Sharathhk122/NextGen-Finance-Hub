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
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">Loading KYC status...</div>
      </div>
    );
  }

  if (error && error !== 'KYC_NOT_FOUND') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="text-center">
          <Link to="/kyc/submit" className="text-blue-500 hover:underline">
            Submit KYC Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">KYC Status</h2>

      {kycData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Status:</label>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(kycData.status)}`}>
                {kycData.status}
              </span>
            </div>
            <div>
              <label className="font-semibold">Document Type:</label>
              <p>{kycData.documentType}</p>
            </div>
            <div>
              <label className="font-semibold">Document Number:</label>
              <p>{kycData.documentNumber}</p>
            </div>
            <div>
              <label className="font-semibold">Submitted At:</label>
              <p>{new Date(kycData.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {kycData.verifiedAt && (
            <div>
              <label className="font-semibold">Verified At:</label>
              <p>{new Date(kycData.verifiedAt).toLocaleDateString()}</p>
            </div>
          )}

          {kycData.verifiedBy && (
            <div>
              <label className="font-semibold">Verified By:</label>
              <p>{kycData.verifiedBy}</p>
            </div>
          )}

          {kycData.rejectionReason && (
            <div>
              <label className="font-semibold">Rejection Reason:</label>
              <p className="text-red-600">{kycData.rejectionReason}</p>
            </div>
          )}

          {kycData.status === 'REJECTED' && (
            <div className="mt-4 text-center">
              <Link
                to="/kyc/submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Resubmit KYC
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">No KYC submission found.</p>
          <Link
            to="/kyc/submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit KYC Documents
          </Link>
        </div>
      )}
    </div>
  );
};

export default KYCStatus;