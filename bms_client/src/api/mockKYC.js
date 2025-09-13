// src/api/mockKYC.js
// Mock data for KYC when backend endpoints are not available
export const mockKYCAPI = {
  getAllKYCSubmissions: () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          status: "PENDING",
          documentNumber: "123456789012",
          documentType: "AADHAAR",
          documentFrontImageUrl: "/uploads/front.jpg",
          documentBackImageUrl: "/uploads/back.jpg",
          selfieImageUrl: "/uploads/selfie.jpg",
          submittedAt: "2025-08-20T22:41:30.413821",
          verifiedAt: null,
          verifiedBy: null,
          rejectionReason: null,
          user: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com"
          }
        },
        {
          id: 2,
          status: "APPROVED",
          documentNumber: "ABCDE1234F",
          documentType: "PAN",
          documentFrontImageUrl: "/uploads/pan_front.jpg",
          documentBackImageUrl: null,
          selfieImageUrl: "/uploads/selfie2.jpg",
          submittedAt: "2025-08-19T15:30:45.123456",
          verifiedAt: "2025-08-20T10:15:30.789012",
          verifiedBy: "admin@example.com",
          rejectionReason: null,
          user: {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com"
          }
        },
        {
          id: 3,
          status: "REJECTED",
          documentNumber: "DL1234567890123",
          documentType: "DRIVING_LICENSE",
          documentFrontImageUrl: "/uploads/dl_front.jpg",
          documentBackImageUrl: "/uploads/dl_back.jpg",
          selfieImageUrl: "/uploads/selfie3.jpg",
          submittedAt: "2025-08-18T09:12:34.567890",
          verifiedAt: "2025-08-19T14:22:11.334455",
          verifiedBy: "admin@example.com",
          rejectionReason: "Document image is blurry and not readable",
          user: {
            id: 3,
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com"
          }
        }
      ]
    });
  },

  updateKYCStatus: (kycId, statusData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          id: kycId,
          status: statusData.status,
          documentNumber: "123456789012",
          documentType: "AADHAAR",
          documentFrontImageUrl: "/uploads/front.jpg",
          documentBackImageUrl: "/uploads/back.jpg",
          selfieImageUrl: "/uploads/selfie.jpg",
          submittedAt: "2025-08-20T22:41:30.413821",
          verifiedAt: statusData.status !== "PENDING" ? new Date().toISOString() : null,
          verifiedBy: statusData.status !== "PENDING" ? "admin@example.com" : null,
          rejectionReason: statusData.rejectionReason || null,
          user: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com"
          }
        };
        resolve({ data: mockResponse });
      }, 1000); // Simulate network delay
    });
  }
};