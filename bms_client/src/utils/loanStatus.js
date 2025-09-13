export const getLoanStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED': return 'bg-blue-100 text-blue-800';
    case 'DISBURSED': return 'bg-green-100 text-green-800';
    case 'CLOSED': return 'bg-gray-100 text-gray-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    case 'DEFAULTED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getLoanStatusText = (status) => {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'APPROVED': return 'Approved';
    case 'DISBURSED': return 'Disbursed';
    case 'CLOSED': return 'Closed';
    case 'REJECTED': return 'Rejected';
    case 'DEFAULTED': return 'Defaulted';
    default: return 'Unknown';
  }
};

export const getLoanTypeText = (type) => {
  return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const getEMIStatusColor = (status) => {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-800';
    case 'LATE': return 'bg-red-100 text-red-800';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};