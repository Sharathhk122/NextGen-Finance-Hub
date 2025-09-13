import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoanForm from '../../components/loan/LoanForm';
import { useAuth } from '../../hooks/useAuth';

const LoanApplication = () => {
  const navigate = useNavigate();
  useAuth();

  return (
    <div >
    

      <LoanForm />
    </div>
  );
};

export default LoanApplication;