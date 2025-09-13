// src/components/auth/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  
  const { verifyEmail, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state
  const email = location.state?.email || '';

  // Typewriter effect for the heading
  useEffect(() => {
    const text = "Verify Your Identity";
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    
    return () => clearInterval(typing);
  }, []);

  // 3D card rotation effect
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((y - centerY) / centerY) * -10;
    
    setCardRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setCardRotation({ x: 0, y: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email not found. Please try registering again.');
      setLoading(false);
      return;
    }

    if (!otp || otp.length !== 8) {
      setError('Please enter a valid 8-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmail(email, otp);
      
      if (result.status === 'success') {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    
    if (!email) {
      setError('Email not found. Please try registering again.');
      setResendLoading(false);
      return;
    }

    try {
      const result = await resendOTP(email);
      
      if (result.status === 'success') {
        setSuccess('OTP has been resent to your email');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse-medium"></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse-fast"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-animation"></div>
        </div>

        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${15 + i * 2}s`,
              '--size': `${5 + i % 10}px`,
              '--opacity': `${0.1 + (i % 5) * 0.05}`,
              '--startX': `${Math.random() * 100}%`,
              '--startY': `${Math.random() * 100}%`,
            }}></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* 3D Card */}
        <div 
          className="perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="relative transform-3d transition-all duration-500"
            style={{
              transform: `rotateY(${cardRotation.y}deg) rotateX(${cardRotation.x}deg)`
            }}
          >
            {/* Card front */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 backface-hidden border border-gray-700">
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full animate-ping-slow opacity-75"></div>
                  <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-2 h-10">
                  {typedText}<span className="animate-blink">|</span>
                </h1>
                
                <p className="text-sm text-gray-400 mb-4">
                  Enter the 8-digit verification code sent to your email
                </p>
                
                {email && (
                  <p className="text-sm font-medium text-purple-400 mb-4 text-center truncate">
                    {email}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 animate-shake">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={8}
                      className="w-full px-5 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-lg tracking-widest text-center transition-all duration-300"
                      placeholder="Enter 8-digit code"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-all duration-300 flex items-center justify-center mx-auto"
                >
                  {resendLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Resend Verification Code
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.03); }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.22; transform: scale(1.01); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes grid-move {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-40px) translateX(-40px); }
        }
        @keyframes particle-float {
          0% { 
            transform: translate(var(--startX), var(--startY)) rotate(0deg); 
          }
          25% { 
            transform: translate(calc(var(--startX) + 50px), calc(var(--startY) - 60px)) rotate(90deg); 
          }
          50% { 
            transform: translate(calc(var(--startX) + 100px), calc(var(--startY) + 30px)) rotate(180deg); 
          }
          75% { 
            transform: translate(calc(var(--startX) - 30px), calc(var(--startY) + 80px)) rotate(270deg); 
          }
          100% { 
            transform: translate(var(--startX), var(--startY)) rotate(360deg); 
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 4s infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 2s infinite;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .grid-animation {
          background-image: linear-gradient(to right, rgba(55, 65, 81, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(55, 65, 81, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
          height: 100%;
          width: 100%;
          animation: grid-move 20s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .transform-3d {
          transform: rotateY(0deg) rotateX(0deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          background: linear-gradient(45deg, #8B5CF6, #6366F1);
          border-radius: 50%;
          opacity: var(--opacity);
          width: var(--size);
          height: var(--size);
          animation: particle-float var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
        .particle:nth-child(odd) {
          background: linear-gradient(45deg, #EC4899, #8B5CF6);
        }
        .particle:nth-child(3n) {
          background: linear-gradient(45deg, #3B82F6, #10B981);
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;