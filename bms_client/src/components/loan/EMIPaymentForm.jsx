import React, { useState, useEffect } from 'react';

const EMIPaymentForm = ({ loan, onSubmit, loading }) => {
  const [installmentNumber, setInstallmentNumber] = useState('');
  const [error, setError] = useState('');
  const [pendingInstallments, setPendingInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(null);

  useEffect(() => {
    if (loan && loan.emiSchedule) {
      // Filter pending installments
      const pending = loan.emiSchedule.filter(emi => 
        emi && (emi.status === 'PENDING' || emi.status === 'LATE')
      );
      
      setPendingInstallments(pending);
      
      // Auto-select the first pending installment
      if (pending.length > 0 && !installmentNumber) {
        setInstallmentNumber(pending[0].installmentNumber.toString());
        setSelectedInstallment(pending[0]);
      }
    }
  }, [loan, installmentNumber]);

  const handleInstallmentChange = (e) => {
    const selectedNumber = e.target.value;
    setInstallmentNumber(selectedNumber);
    
    const installment = pendingInstallments.find(
      emi => emi.installmentNumber === parseInt(selectedNumber)
    );
    setSelectedInstallment(installment);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!installmentNumber) {
      setError('Please select an installment to pay');
      return;
    }
    
    setError('');
    onSubmit({ installmentNumber: parseInt(installmentNumber) });
  };

  // Safe function to format currency with fallback
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Pay EMI</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Loan Account: {loan.loanAccountNumber}</p>
        <p className="text-gray-600">Outstanding Amount: {formatCurrency(loan.totalPayableAmount - (loan.paidAmount || 0))}</p>
      </div>

      {pendingInstallments.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-yellow-800">Next Due Installment</h3>
          <p>Installment #{pendingInstallments[0].installmentNumber}</p>
          <p>Due Date: {pendingInstallments[0].dueDate ? new Date(pendingInstallments[0].dueDate).toLocaleDateString() : 'N/A'}</p>
          <p className="font-bold">Amount: {formatCurrency(pendingInstallments[0].totalAmount)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Installment Number to Pay *
          </label>
          <select
            value={installmentNumber}
            onChange={handleInstallmentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Installment</option>
            {pendingInstallments.map(emi => (
              <option key={emi.installmentNumber} value={emi.installmentNumber}>
                Installment #{emi.installmentNumber} - 
                Due: {emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : 'N/A'} - 
                {formatCurrency(emi.totalAmount)} - 
                {emi.status || 'N/A'}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        {selectedInstallment && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Payment Details</h3>
            <p>You are about to pay Installment #{selectedInstallment.installmentNumber}</p>
            <p>Due Date: {selectedInstallment.dueDate ? new Date(selectedInstallment.dueDate).toLocaleDateString() : 'N/A'}</p>
            <p className="font-bold">Amount: {formatCurrency(selectedInstallment.totalAmount)}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !installmentNumber || pendingInstallments.length === 0}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Payment...' : 'Pay EMI'}
        </button>
      </form>

      {pendingInstallments.length === 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-gray-600 text-center">No pending installments found for this loan.</p>
        </div>
      )}
    </div>
  );
};

export default EMIPaymentForm;