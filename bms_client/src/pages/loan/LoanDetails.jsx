import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loanAPI } from '../../api/loan';
import { useAuth } from '../../hooks/useAuth';
import { getLoanStatusColor, getLoanTypeText } from '../../utils/loanStatus';

const LoanDetails = () => {
  const { loanId } = useParams();
  useAuth();
  const [loan, setLoan] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const typewriterTimeoutRef = useRef(null);

  useEffect(() => {
    fetchLoanDetails();
    
    // Initialize 3D card effect
    if (cardRef.current) {
      const handleMouseMove = (e) => {
        const card = cardRef.current;
        const cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        const glowX = (x / cardRect.width) * 100;
        const glowY = (y / cardRect.height) * 100;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(76, 29, 149, 0.2), rgba(30, 30, 40, 0.8))`;
      };
      
      const handleMouseLeave = () => {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        cardRef.current.style.background = 'rgba(30, 30, 40, 0.8)';
      };
      
      cardRef.current.addEventListener('mousemove', handleMouseMove);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener('mousemove', handleMouseMove);
          cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, [loanId]);

  // 5D Background animation with particles
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles = [];
    const particleCount = 20;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      
      const size = Math.random() * 20 + 5;
      const colors = [
        'rgba(101, 84, 192, 0.6)',
        'rgba(126, 58, 191, 0.6)',
        'rgba(76, 29, 149, 0.6)',
        'rgba(58, 12, 163, 0.6)',
        'rgba(92, 107, 192, 0.6)'
      ];
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.boxShadow = '0 0 15px 5px rgba(126, 58, 191, 0.5)';
      particle.style.opacity = '0';
      
      container.appendChild(particle);
      particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        angleSpeed: (Math.random() - 0.5) * 0.05
      });
    }
    
    // Animate particles
    let animationId;
    const animate = () => {
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.angle += particle.angleSpeed;
        
        // Wrap around edges
        if (particle.x > 100) particle.x = 0;
        if (particle.x < 0) particle.x = 100;
        if (particle.y > 100) particle.y = 0;
        if (particle.y < 0) particle.y = 100;
        
        // Apply movement with 3D depth effect
        const depth = 0.5 + 0.5 * Math.sin(particle.angle);
        const zIndex = Math.floor(depth * 10);
        const scale = 0.5 + depth * 0.5;
        const opacity = 0.3 + depth * 0.7;
        
        particle.element.style.left = `${particle.x}%`;
        particle.element.style.top = `${particle.y}%`;
        particle.element.style.transform = `scale(${scale}) translateZ(${depth * 20}px)`;
        particle.element.style.opacity = opacity;
        particle.element.style.zIndex = zIndex;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      particles.forEach(particle => {
        if (particle.element.parentNode === container) {
          container.removeChild(particle.element);
        }
      });
    };
  }, []);

  // Type animation effect with cleanup
  useEffect(() => {
    if (textRef.current && loan) {
      // Clear any existing timeouts
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      
      const text = `Loan ${loan.loanAccountNumber}`;
      let i = 0;
      textRef.current.innerHTML = '';
      
      const typeWriter = () => {
        if (i < text.length) {
          // Add characters with random color
          const char = text.charAt(i);
          const hue = 260 + Math.random() * 40;
          textRef.current.innerHTML += `<span style="color: hsl(${hue}, 80%, 70%)">${char}</span>`;
          i++;
          typewriterTimeoutRef.current = setTimeout(typeWriter, 50 + Math.random() * 50);
        }
      };
      
      typeWriter();
    }
    
    // Cleanup function to clear timeout on unmount or re-run
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [loan]);

  const fetchLoanDetails = async () => {
    try {
      const [loanResponse, scheduleResponse] = await Promise.all([
        loanAPI.getLoanDetails(loanId),
        loanAPI.getEMISchedule(loanId).catch(err => ({ data: null }))
      ]);
      
      let emiSchedule = null;
      
      if (Array.isArray(scheduleResponse.data)) {
        emiSchedule = scheduleResponse.data;
      } else if (scheduleResponse.data && Array.isArray(scheduleResponse.data.schedule)) {
        emiSchedule = scheduleResponse.data.schedule;
      } else if (scheduleResponse.data && Array.isArray(scheduleResponse.data.data)) {
        emiSchedule = scheduleResponse.data.data;
      } else if (scheduleResponse.data && Array.isArray(scheduleResponse.data.content)) {
        emiSchedule = scheduleResponse.data.content;
      } else if (scheduleResponse.data && typeof scheduleResponse.data === 'object') {
        emiSchedule = [scheduleResponse.data];
      }
      
      setLoan(loanResponse.data);
      setEmiSchedule(emiSchedule);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch loan details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-pulse"></div>
        <div className="flex flex-col items-center relative z-10">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-blue-500 border-b-transparent animate-spin reverse"></div>
            <div className="absolute inset-8 rounded-full border-4 border-indigo-500 border-l-transparent animate-ping"></div>
          </div>
          <span className="mt-6 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 animate-pulse font-bold tracking-wider">
            Loading loan details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"></div>
        <div className="bg-red-900/30 backdrop-blur-lg border border-red-700/50 text-red-200 px-8 py-6 rounded-2xl mb-8 transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-red-500/10 relative z-10">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-lg">{error}</span>
          </div>
        </div>
        <Link 
          to="/loans" 
          className="text-blue-400 hover:text-blue-300 transition-all duration-500 flex items-center group relative z-10 transform hover:-translate-x-2"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300 text-2xl">←</span>
          <span className="ml-2 text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Back to Loans</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 relative overflow-hidden" ref={containerRef}>
      {/* Animated 5D background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-0"></div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern bg-cover bg-center animate-grid-move"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center mb-8">
          <Link 
            to="/loans" 
            className="text-blue-400 hover:text-blue-300 transition-all duration-500 flex items-center group mr-6 transform hover:-translate-x-2"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300 text-2xl">←</span>
            <span className="ml-2 text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Back to Loans</span>
          </Link>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 tracking-tight">
            Loan Details
          </h1>
        </div>

        {loan && (
          <div 
            ref={cardRef}
            className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-700/30 shadow-2xl transition-all duration-500 ease-out relative overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(92, 107, 192, 0.2), 0 0 30px 0 rgba(92, 107, 192, 0.3)'
            }}
          >
            {/* Card glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-20 blur-xl"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h2 
                  ref={textRef}
                  className="text-4xl font-bold mb-2 tracking-wide"
                ></h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getLoanStatusColor(loan.status)} transform transition-all duration-300 hover:scale-105 inline-block border border-opacity-30 shadow-lg`}>
                  {loan.status}
                </span>
              </div>
              <span className="px-4 py-2 rounded-full text-sm bg-purple-900/40 text-purple-300 border border-purple-700/50 transform transition-all duration-300 hover:scale-105 shadow-lg">
                {getLoanTypeText(loan.loanType)}
              </span>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-700/50 mb-8 relative z-10">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-400 bg-blue-900/20 rounded-t-lg'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="relative">
                    Details
                    {activeTab === 'details' && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></span>
                    )}
                  </span>
                </button>
                {emiSchedule && emiSchedule.length > 0 && (
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === 'schedule'
                        ? 'border-blue-500 text-blue-400 bg-blue-900/20 rounded-t-lg'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="relative">
                      EMI Schedule
                      {activeTab === 'schedule' && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></span>
                      )}
                    </span>
                  </button>
                )}
              </nav>
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-6">
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-purple-500/30 relative overflow-hidden">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 opacity-10 blur"></div>
                    <p className="text-gray-400 text-sm mb-2">Loan Amount</p>
                    <p className="text-3xl font-bold text-green-400 drop-shadow-lg">
                      {formatCurrency(loan.loanAmount)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-cyan-500/30 relative overflow-hidden">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-10 blur"></div>
                    <p className="text-gray-400 text-sm mb-2">Interest Rate</p>
                    <p className="text-2xl font-semibold text-cyan-400 drop-shadow-lg">{loan.interestRate}%</p>
                  </div>
                  
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-gray-500/30 relative overflow-hidden">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 opacity-10 blur"></div>
                    <p className="text-gray-400 text-sm mb-2">Tenure</p>
                    <p className="text-2xl font-semibold text-gray-300 drop-shadow-lg">{loan.tenureMonths} months</p>
                  </div>
                  
                  {loan.startDate && (
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-purple-500/30 relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10 blur"></div>
                      <p className="text-gray-400 text-sm mb-2">Start Date</p>
                      <p className="text-xl font-semibold text-gray-300 drop-shadow-lg">
                        {new Date(loan.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  {loan.emiAmount && (
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-amber-500/30 relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 opacity-10 blur"></div>
                      <p className="text-gray-400 text-sm mb-2">EMI Amount</p>
                      <p className="text-2xl font-semibold text-amber-400 drop-shadow-lg">
                        {formatCurrency(loan.emiAmount)}
                      </p>
                    </div>
                  )}
                  
                  {loan.totalPayableAmount && (
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-purple-500/30 relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-10 blur"></div>
                      <p className="text-gray-400 text-sm mb-2">Total Payable Amount</p>
                      <p className="text-2xl font-semibold text-purple-400 drop-shadow-lg">
                        {formatCurrency(loan.totalPayableAmount)}
                      </p>
                    </div>
                  )}
                  
                  {loan.paidAmount > 0 && (
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-emerald-500/30 relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-10 blur"></div>
                      <p className="text-gray-400 text-sm mb-2">Paid Amount</p>
                      <p className="text-2xl font-semibold text-emerald-400 drop-shadow-lg">
                        {formatCurrency(loan.paidAmount)}
                      </p>
                    </div>
                  )}
                  
                  {loan.endDate && (
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/30 relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-10 blur"></div>
                      <p className="text-gray-400 text-sm mb-2">End Date</p>
                      <p className="text-xl font-semibold text-gray-300 drop-shadow-lg">
                        {new Date(loan.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EMI Schedule Tab */}
            {activeTab === 'schedule' && emiSchedule && emiSchedule.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-gray-700/50 shadow-2xl relative z-10">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-800/80 backdrop-blur-md">
                    <tr>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Installment
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Principal
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Interest
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Remaining Principal
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/40 divide-y divide-gray-700/30">
                    {emiSchedule.map((emi, index) => (
                      <tr 
                        key={emi.installmentNumber} 
                        className="transition-all duration-500 hover:bg-gray-700/40 hover:shadow-lg"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          #{emi.installmentNumber}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-400">
                          {emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatCurrency(emi.principalAmount)}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatCurrency(emi.interestAmount)}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-semibold text-gray-200">
                          {formatCurrency(emi.totalAmount)}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatCurrency(emi.remainingPrincipal)}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 text-xs rounded-full font-medium ${
                            emi.status === 'PAID' 
                              ? 'bg-green-900/40 text-green-300 border border-green-700/50 shadow-lg shadow-green-500/10'
                              : emi.status === 'LATE'
                              ? 'bg-red-900/40 text-red-300 border border-red-700/50 shadow-lg shadow-red-500/10'
                              : 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50 shadow-lg shadow-yellow-500/10'
                          }`}>
                            {emi.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {loan?.status === 'DISBURSED' && (
          <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl transform transition-all duration-500 hover:scale-[1.01] relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-10 blur-xl"></div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-6 relative z-10">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              <Link
                to={`/loans/${loanId}/pay-emi`}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-gray-200 px-6 py-3 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-500 transform hover:-translate-y-1 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center group justify-center"
              >
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Pay EMI
              </Link>
              <button
                onClick={() => setActiveTab('schedule')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-gray-200 px-6 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-500 transform hover:-translate-y-1 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center group justify-center"
              >
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                View EMI Schedule
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        
        @keyframes grid-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(92, 107, 192, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(92, 107, 192, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .animate-float {
          animation: float infinite linear;
        }
        
        tr {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default LoanDetails;