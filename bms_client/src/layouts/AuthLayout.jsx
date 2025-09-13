// src/layouts/AuthLayout.jsx
import React from 'react';
import Footer from '../components/common/Footer';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout flex flex-col bg-gray-50">
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;