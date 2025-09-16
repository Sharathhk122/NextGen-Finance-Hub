// src/api/mockKYC.js
// Mock API for development when backend is not available
export const mockKYCAPI = {
  submitKYC: async (formData) => {
    console.log('Mock KYC submission:', formData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 'mock-kyc-id',
            status: 'PENDING',
            submittedAt: new Date().toISOString(),
            message: 'KYC submitted successfully (mock)'
          }
        });
      }, 1500);
    });
  },

  getKYCStatus: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 404 for no KYC found
        const error = new Error('KYC not found');
        error.response = { status: 404 };
        reject(error);
      }, 1000);
    });
  },

  getAllKYCSubmissions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              userId: 'user1',
              documentType: 'PASSPORT',
              documentNumber: 'A12345678',
              status: 'APPROVED',
              submittedAt: '2023-01-15T10:30:00Z',
              verifiedAt: '2023-01-16T14:20:00Z',
              verifiedBy: 'admin1'
            },
            {
              id: '2',
              userId: 'user2',
              documentType: 'DRIVERS_LICENSE',
              documentNumber: 'DL987654',
              status: 'REJECTED',
              submittedAt: '2023-01-16T11:45:00Z',
              verifiedAt: '2023-01-17T09:15:00Z',
              verifiedBy: 'admin2',
              rejectionReason: 'Document image is blurry'
            }
          ]
        });
      }, 1000);
    });
  },

  updateKYCStatus: async (kycId, statusData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: kycId,
            ...statusData,
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'mock-admin'
          }
        });
      }, 1000);
    });
  }
};