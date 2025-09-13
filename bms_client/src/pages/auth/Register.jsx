import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
};

export default Register;