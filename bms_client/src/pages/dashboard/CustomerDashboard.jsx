// CustomerDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI } from '../../api/account';
import { kycAPI } from '../../api/kyc';
import { loanAPI } from '../../api/loan';
import { transactionAPI } from '../../api/transaction';
import { useAuth } from '../../hooks/useAuth';
import { 
  Card, 
  Progress, 
  Tag, 
  Alert, 
  Skeleton, 
  Row, 
  Col, 
  Statistic, 
  Tabs, 
  List, 
  Badge,
  Tooltip,
  Divider,
  Button,
  Avatar,
  notification,
  Space,
  Typography
} from 'antd';
import { 
  BankOutlined, 
  DollarOutlined, 
  CreditCardOutlined, 
  UserOutlined,
  SendOutlined,
  TeamOutlined,
  CalculatorOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HistoryOutlined,
  FileTextOutlined,
  BarChartOutlined,
  WalletOutlined,
  SettingOutlined,
  BellOutlined,
  CalendarOutlined,
  TransactionOutlined,
  RiseOutlined,
  FallOutlined,
  IdcardOutlined,
  SecurityScanOutlined,
  MoreOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  DashboardOutlined,
  StarOutlined,
  TrophyOutlined,
  GiftOutlined,
  CrownOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  RadarChartOutlined,
  ClusterOutlined,
  FundOutlined,
  ApiOutlined,
  PartitionOutlined,
  NodeIndexOutlined,
  GatewayOutlined,
  DeploymentUnitOutlined,
  CodeSandboxOutlined,
  BoxPlotOutlined,
  BlockOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loans, setLoans] = useState([]);
  const [kycStatus, setKycStatus] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const canvasRef = useRef(null);
  const headerTextRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const threeDContainerRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Typewriter effect for header
    if (headerTextRef.current) {
      const text = "Welcome to your Quantum Banking Experience";
      headerTextRef.current.textContent = '';
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          headerTextRef.current.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 80);
        }
      };
      typeWriter();
    }

    // Initialize 3D background
    init3DBackground();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const init3DBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Enhanced Particle system
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsla(${Math.random() * 360}, 80%, 60%, ${Math.random() * 0.5 + 0.2})`;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.05;
        this.orbitRadius = Math.random() * 50 + 10;
        this.originalX = this.x;
        this.originalY = this.y;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.05 + 0.01;
        this.trail = [];
        this.maxTrail = 5;
        this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: triangle, 2: square
      }
      
      update() {
        // Save current position to trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrail) {
          this.trail.shift();
        }
        
        // Orbital motion with drift
        this.angle += this.angleSpeed;
        this.originalX += this.speedX * 0.1;
        this.originalY += this.speedY * 0.1;
        
        this.x = this.originalX + Math.cos(this.angle) * this.orbitRadius;
        this.y = this.originalY + Math.sin(this.angle) * this.orbitRadius;
        
        // Pulsing effect
        this.pulse += this.pulseSpeed;
        const pulseSize = this.size + Math.sin(this.pulse) * 2;
        
        // Boundary check with wrap-around
        if (this.x > canvas.width + 50) this.x = -50;
        else if (this.x < -50) this.x = canvas.width + 50;
        
        if (this.y > canvas.height + 50) this.y = -50;
        else if (this.y < -50) this.y = canvas.height + 50;
        
        // Draw with pulsing effect
        this.draw(pulseSize);
        
        // Draw trail
        this.drawTrail();
      }
      
      draw(size) {
        ctx.beginPath();
        
        if (this.shape === 0) {
          // Circle
          ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        } else if (this.shape === 1) {
          // Triangle
          ctx.moveTo(this.x, this.y - size);
          ctx.lineTo(this.x - size, this.y + size);
          ctx.lineTo(this.x + size, this.y + size);
          ctx.closePath();
        } else {
          // Square
          ctx.rect(this.x - size, this.y - size, size * 2, size * 2);
        }
        
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
      }
      
      drawTrail() {
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const alpha = i / this.trail.length * 0.3;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.color.split(',')[0].split('(')[1]}, 80%, 60%, ${alpha})`;
          ctx.fill();
        }
      }
    }
    
    // Create particles
    particlesRef.current = [];
    const particleCount = Math.min(200, Math.floor((canvas.width * canvas.height) / 6000));
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background with multiple color stops
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.2
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      gradient.addColorStop(0.3, 'rgba(30, 41, 59, 0.8)');
      gradient.addColorStop(0.6, 'rgba(15, 23, 42, 0.7)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.9)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid pattern in background
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
      });
      
      // Connect particles with lines
      connectParticles();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Connect particles with lines
    const connectParticles = () => {
      const maxDistance = 150;
      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a + 1; b < particlesRef.current.length; b++) {
          const dx = particlesRef.current[a].x - particlesRef.current[b].x;
          const dy = particlesRef.current[a].y - particlesRef.current[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 0.2 * (1 - distance/maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${(particlesRef.current[a].color.split(',')[0].split('(')[1] + particlesRef.current[b].color.split(',')[0].split('(')[1]) / 2}, 70%, 60%, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y);
            ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Start animation
    animate();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [accountsResponse, loansResponse, kycResponse] = await Promise.all([
        accountAPI.getUserAccounts(),
        loanAPI.getUserLoans().catch(err => ({ data: [] })),
        kycAPI.getKYCStatus().catch(err => ({ data: { status: 'NOT_SUBMITTED' } }))
      ]);
      
      // Handle accounts data
      let accountsData = [];
      if (accountsResponse && accountsResponse.data) {
        if (Array.isArray(accountsResponse.data)) {
          accountsData = accountsResponse.data;
        } else if (accountsResponse.data.data && Array.isArray(accountsResponse.data.data)) {
          accountsData = accountsResponse.data.data;
        } else if (accountsResponse.data.content && Array.isArray(accountsResponse.data.content)) {
          accountsData = accountsResponse.data.content;
        }
      }
      
      // Handle loans data
      let loansData = [];
      if (loansResponse && loansResponse.data) {
        if (Array.isArray(loansResponse.data)) {
          loansData = loansResponse.data;
        } else if (loansResponse.data.data && Array.isArray(loansResponse.data.data)) {
          loansData = loansResponse.data.data;
        } else if (loansResponse.data.content && Array.isArray(loansResponse.data.content)) {
          loansData = loansResponse.data.content;
        }
      }
      
      // Get transactions for the primary account if available
      let transactionsData = [];
      if (accountsData.length > 0) {
        const primaryAccount = accountsData[0];
        try {
          const transactionsResponse = await transactionAPI.getTransactionHistory(primaryAccount.accountNumber);
          
          if (transactionsResponse && transactionsResponse.data) {
            if (Array.isArray(transactionsResponse.data)) {
              transactionsData = transactionsResponse.data.slice(0, 5);
            } else if (transactionsResponse.data.data && Array.isArray(transactionsResponse.data.data)) {
              transactionsData = transactionsResponse.data.data.slice(0, 5);
            } else if (transactionsResponse.data.content && Array.isArray(transactionsResponse.data.content)) {
              transactionsData = transactionsResponse.data.content.slice(0, 5);
            }
          }
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
          notification.warning({
            message: 'Transaction History',
            description: 'Could not load recent transactions',
          });
        }
      }
      
      setAccounts(accountsData);
      setLoans(loansData);
      setRecentTransactions(transactionsData);
      setKycStatus(kycResponse.data);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      notification.error({
        message: 'Dashboard Error',
        description: 'Failed to load dashboard data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalBalance = () => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((total, account) => {
      const balance = parseFloat(account.balance) || 0;
      return total + balance;
    }, 0);
  };

  const getTotalLoanBalance = () => {
    if (!loans || loans.length === 0) return 0;
    return loans
      .filter(loan => loan.status === 'DISBURSED')
      .reduce((total, loan) => {
        const outstandingBalance = parseFloat(loan.outstandingBalance) || 0;
        return total + outstandingBalance;
      }, 0);
  };

  const getKYCStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getKYCStatusText = (status) => {
    switch (status) {
      case 'APPROVED': return 'Verified';
      case 'REJECTED': return 'Rejected';
      case 'PENDING': return 'Pending';
      default: return 'Not Submitted';
    }
  };

  const getLoanStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#3b82f6';
      case 'DISBURSED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'REJECTED': return '#ef4444';
      case 'CLOSED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₹0.00';
    }
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  const getTransactionIcon = (type) => {
    return type === 'CREDIT' ? 
      <ArrowDownOutlined /> : 
      <ArrowUpOutlined />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      {/* 3D Animated Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 opacity-80"
      />
      
      {/* Floating 3D Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl animate-pulse-medium"></div>
      <div className="absolute top-2/3 left-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl animate-pulse-fast"></div>
      <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl animate-pulse-slower"></div>
      
      <div className="relative z-10 p-4 md:p-6 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 transform transition-all duration-700 hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-cyan-900/30 rounded-2xl backdrop-blur-xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-float-reverse"></div>
            <div className="absolute top-10 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-xl animate-float-slow"></div>
            
            <div className="flex-1 z-10">
              <h1 className="dashboard-title text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-text-shimmer">
                <span>NextGen Finance Hub</span>
                <CrownOutlined className="ml-2 text-yellow-400 animate-spin-slow" />
              </h1>
              <p ref={headerTextRef} className="text-indigo-200 mb-3 font-light text-sm md:text-base">
                {/* Text will be filled by typewriter effect */}
              </p>
              <div className="flex items-center text-sm text-cyan-300">
                <TrophyOutlined className="mr-2" />
                <span>Quantum Banking Member • Level 7</span>
                <span className="ml-3 px-2 py-1 bg-cyan-900/40 rounded-md text-xs border border-cyan-700/50 flex items-center">
                  <SyncOutlined spin className="mr-1" /> Live Sync Active
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 z-10">
              <Tooltip title="Notifications" placement="bottom">
                <button className="p-2 rounded-full bg-gray-800/50 hover:bg-indigo-700/50 transition-all duration-300 transform hover:scale-110 border border-gray-700/50 shadow-lg hover:shadow-cyan-400/20">
                  <BellOutlined className="text-cyan-400" />
                  <Badge count={3} size="small" className="ml-1" />
                </button>
              </Tooltip>
              <Tooltip title="Financial Insights" placement="bottom">
                <button className="p-2 rounded-full bg-gray-800/50 hover:bg-indigo-700/50 transition-all duration-300 transform hover:scale-110 border border-gray-700/50 shadow-lg hover:shadow-green-400/20">
                  <BarChartOutlined className="text-green-400" />
                </button>
              </Tooltip>
              <Tooltip title="Settings" placement="bottom">
                <Link to="/settings">
                  <button className="p-2 rounded-full bg-gray-800/50 hover:bg-indigo-700/50 transition-all duration-300 transform hover:scale-110 border border-gray-700/50 shadow-lg hover:shadow-purple-400/20">
                    <SettingOutlined className="text-purple-400" />
                  </button>
                </Link>
              </Tooltip>
              <div className="flex items-center ml-2">
                <Avatar
                  size={44}
                  icon={<UserOutlined />}
                  className="border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 animate-border-pulse"
                />
                <div className="ml-3">
                  <div className="font-medium text-cyan-100">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-400 flex items-center">
                    Quantum Account 
                    <ThunderboltOutlined className="text-yellow-400 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Status Alert */}
        {(!kycStatus || kycStatus.status !== 'APPROVED') && (
          <div className="mb-8 animate-fade-in-up">
            <div className="p-5 bg-gradient-to-r from-amber-900/30 to-orange-800/30 rounded-2xl backdrop-blur-md border border-amber-500/30 shadow-lg transform transition-all duration-500 hover:scale-[1.01] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/10 rounded-full blur-xl"></div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-amber-500/20 rounded-xl mr-4">
                  <SecurityScanOutlined className="text-2xl text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-200 mb-1">
                    Identity Verification: {getKYCStatusText(kycStatus?.status || 'NOT_SUBMITTED')}
                  </h3>
                  <p className="text-amber-100/80 mb-4">
                    {kycStatus?.status === 'PENDING'
                      ? 'Your verification documents are being processed. This typically takes 1-2 business days.'
                      : kycStatus?.status === 'REJECTED'
                        ? `Verification was unsuccessful: ${kycStatus.rejectionReason || 'Please contact our support team for assistance.'}`
                        : 'Complete your identity verification to unlock premium banking features and higher transaction limits.'}
                  </p>
                  {kycStatus?.status !== 'REJECTED' && (
                    <div>
                      <Link
                        to="/kyc/submit"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25"
                      >
                        {kycStatus?.status === 'PENDING' ? 'Check Status' : 'Begin Verification'}
                        <RocketOutlined className="ml-2" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-cyan-300 animate-pulse-slow">
            <DashboardOutlined className="mr-3 text-cyan-400" />
            Quantum Wealth Overview
          </h2>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-2xl p-6 backdrop-blur-md border border-cyan-500/20 shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/40 hover:shadow-cyan-500/10 relative overflow-hidden group">
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 p-3 bg-cyan-900/30 rounded-xl mr-4">
                    <WalletOutlined className="text-2xl text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm">Liquid Assets</div>
                    <div className="text-2xl font-bold text-cyan-300">{formatCurrency(getTotalBalance())}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cyan-300/80 flex items-center">
                    <RiseOutlined className="mr-1" />
                    2.3% growth this month
                  </span>
                  <Link to="/accounts" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center transition-all duration-300 transform hover:translate-x-1">
                    Explore Details <EyeOutlined className="ml-1" />
                  </Link>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-2xl p-6 backdrop-blur-md border border-purple-500/20 shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/40 hover:shadow-purple-500/10 relative overflow-hidden group">
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 p-3 bg-purple-900/30 rounded-xl mr-4">
                    <CreditCardOutlined className="text-2xl text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm">Credit Portfolio</div>
                    <div className="text-2xl font-bold text-purple-300">{formatCurrency(getTotalLoanBalance())}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-300/80">
                    {loans.filter(loan => loan.status === 'DISBURSED').length} Active Facilities
                  </span>
                  <Link to="/loans" className="text-purple-400 hover:text-purple-300 text-sm flex items-center transition-all duration-300 transform hover:translate-x-1">
                    Manage Loans <EyeOutlined className="ml-1" />
                  </Link>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-2xl p-6 backdrop-blur-md border border-rose-500/20 shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:border-rose-500/40 hover:shadow-rose-500/10 relative overflow-hidden group">
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 p-3 bg-rose-900/30 rounded-xl mr-4">
                    <DollarOutlined className="text-2xl text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm">Monthly Expenditure</div>
                    <div className="text-2xl font-bold text-rose-300">{formatCurrency(12500)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-rose-300/80 flex items-center">
                    <FallOutlined className="mr-1" />
                    5.2% less than last month
                  </span>
                  <Link to="/transactions" className="text-rose-400 hover:text-rose-300 text-sm flex items-center transition-all duration-300 transform hover:translate-x-1">
                    View Analysis <BarChartOutlined className="ml-1" />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-purple-300">
            <RocketOutlined className="mr-3 text-purple-400" />
            Quantum Access Portal
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6}>
              <Link to="/transactions/transfer">
                <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl p-5 text-center backdrop-blur-md border border-cyan-500/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-cyan-500/40 hover:shadow-cyan-500/10 h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-16 h-16 bg-cyan-500/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="p-3 bg-cyan-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <SendOutlined className="text-2xl text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-cyan-300 mb-1 relative z-10">Fund Transfer</h3>
                  <p className="text-gray-400 text-sm relative z-10">Seamless money movement</p>
                </div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/beneficiaries">
                <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl p-5 text-center backdrop-blur-md border border-emerald-500/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-emerald-500/40 hover:shadow-emerald-500/10 h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-16 h-16 bg-emerald-500/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="p-3 bg-emerald-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <TeamOutlined className="text-2xl text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-emerald-300 mb-1 relative z-10">Beneficiary Hub</h3>
                  <p className="text-gray-400 text-sm relative z-10">Manage recipients</p>
                </div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/loans/apply">
                <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl p-5 text-center backdrop-blur-md border border-violet-500/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-violet-500/40 hover:shadow-violet-500/10 h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-16 h-16 bg-violet-500/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="p-3 bg-violet-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <CreditCardOutlined className="text-2xl text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-violet-300 mb-1 relative z-10">Credit Solutions</h3>
                  <p className="text-gray-400 text-sm relative z-10">Personalized lending</p>
                </div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/emi-calculator">
                <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl p-5 text-center backdrop-blur-md border border-amber-500/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-amber-500/40 hover:shadow-amber-500/10 h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-16 h-16 bg-amber-500/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="p-3 bg-amber-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <CalculatorOutlined className="text-2xl text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-amber-300 mb-1 relative z-10">Finance Planner</h3>
                  <p className="text-gray-400 text-sm relative z-10">Calculate repayments</p>
                </div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/transactions/history">
                <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl p-5 text-center backdrop-blur-md border border-blue-500/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-blue-500/40 hover:shadow-blue-500/10 h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-16 h-16 bg-blue-500/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="p-3 bg-blue-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <HistoryOutlined className="text-2xl text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-300 mb-1 relative z-10">Transaction Log</h3>
                  <p className="text-gray-400 text-sm relative z-10">View all activity</p>
                </div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/cards">
                <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl p-5 text-center backdrop-blur-md border border-pink-500/20 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-pink-500/40 hover:shadow-pink-500/10 h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-16 h-16 bg-pink-500/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="p-3 bg-pink-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <IdcardOutlined className="text-2xl text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-pink-300 mb-1 relative z-10">Card Services</h3>
                  <p className="text-gray-400 text-sm relative z-10">Manage your cards</p>
                </div>
              </Link>
            </Col>
          </Row>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 rounded-2xl backdrop-blur-xl border border-indigo-500/20 shadow-2xl overflow-hidden">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="dashboard-tabs"
            tabBarStyle={{
              padding: '0 24px',
              background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4))',
              borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
              margin: 0
            }}
            items={[
              {
                key: 'overview',
                label: (
                  <span className="flex items-center text-cyan-300">
                    <DashboardOutlined className="mr-2" />
                    Quantum Overview
                  </span>
                ),
                children: (
                  <div className="p-6">
                    <Row gutter={[24, 24]}>
                      {/* Account Summary */}
                      <Col xs={24} lg={16}>
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 backdrop-blur-md border border-cyan-500/20 shadow-xl mb-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-cyan-300 flex items-center">
                              <BankOutlined className="mr-3 text-cyan-400" />
                              Quantum Account Matrix
                            </h3>
                            <Link to="/accounts">
                              <Button 
                                type="primary" 
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-none shadow-lg hover:shadow-cyan-500/25 flex items-center"
                                onClick={() => console.log('View All Accounts clicked')}
                              >
                                View All Accounts <ArrowRightOutlined className="ml-2" />
                              </Button>
                            </Link>
                          </div>
                          
                          {accounts.length === 0 ? (
                            <div className="text-center py-10">
                              <div className="text-gray-400 mb-4">No accounts found</div>
                              <Link to="/accounts/open">
                                <Button type="primary" className="bg-indigo-600 hover:bg-indigo-500 border-none">
                                  Open New Account
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <Row gutter={[16, 16]}>
                              {accounts.slice(0, 3).map((account, index) => (
                                <Col xs={24} md={12} key={account.accountNumber}>
                                  <div className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-indigo-900/30 to-purple-900/30' : 'from-cyan-900/30 to-blue-900/30'} rounded-xl p-4 border ${index % 2 === 0 ? 'border-purple-500/30' : 'border-cyan-500/30'} shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-cyan-500/10 h-full`}>
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="font-semibold text-gray-200">{account.accountName}</h4>
                                        <div className="text-sm text-gray-400">•••• •••• •••• {account.accountNumber.slice(-4)}</div>
                                      </div>
                                      <Tag color={account.status === 'ACTIVE' ? 'green' : 'red'} className="m-0">
                                        {account.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                      </Tag>
                                    </div>
                                    <div className="text-2xl font-bold text-cyan-300 mb-2">{formatCurrency(account.balance)}</div>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-gray-400">Available Balance</span>
                                      <Link to={`/accounts/${account.accountNumber}`} className="text-cyan-400 hover:text-cyan-300 flex items-center">
                                        Details <EyeOutlined className="ml-1" />
                                      </Link>
                                    </div>
                                  </div>
                                </Col>
                              ))}
                              
                              {accounts.length > 3 && (
                                <Col xs={24}>
                                  <div className="text-center pt-4">
                                    <Text type="secondary" className="text-gray-400">
                                      +{accounts.length - 3} more accounts
                                    </Text>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          )}
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 backdrop-blur-md border border-purple-500/20 shadow-xl">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-purple-300 flex items-center">
                              <TransactionOutlined className="mr-3 text-purple-400" />
                              Quantum Transaction Stream
                            </h3>
                            <Link to="/transactions">
                              <Button 
                                type="primary" 
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-none shadow-lg hover:shadow-purple-500/25 flex items-center"
                                onClick={() => console.log('View All Transactions clicked')}
                              >
                                View All Transactions <ArrowRightOutlined className="ml-2" />
                              </Button>
                            </Link>
                          </div>
                          
                          {recentTransactions.length === 0 ? (
                            <div className="text-center py-10">
                              <div className="text-gray-400 mb-4">No recent transactions</div>
                              <Link to="/transactions/transfer">
                                <Button type="primary" className="bg-indigo-600 hover:bg-indigo-500 border-none">
                                  Make a Transfer
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {recentTransactions.map((transaction, index) => (
                                <div 
                                  key={transaction.id || index} 
                                  className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10"
                                >
                                  <div className="flex items-center">
                                    <div className={`p-2 rounded-full mr-4 ${transaction.type === 'CREDIT' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                      {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-200">{transaction.description || 'Funds Transfer'}</div>
                                      <div className="text-sm text-gray-400">
                                        {transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : 'Today'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`text-right ${transaction.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'}`}>
                                    <div className="font-semibold">
                                      {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {transaction.type === 'CREDIT' ? 'Received' : 'Sent'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Col>

                      {/* Loan Summary */}
                      <Col xs={24} lg={8}>
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 backdrop-blur-md border border-amber-500/20 shadow-xl mb-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-amber-300 flex items-center">
                              <CreditCardOutlined className="mr-3 text-amber-400" />
                              Credit Facilities
                            </h3>
                            <Link to="/loans">
                              <Button 
                                type="primary" 
                                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-none shadow-lg hover:shadow-amber-500/25 flex items-center"
                                onClick={() => console.log('View All Loans clicked')}
                              >
                                View All <ArrowRightOutlined className="ml-2" />
                              </Button>
                            </Link>
                          </div>
                          
                          {loans.length === 0 ? (
                            <div className="text-center py-6">
                              <div className="text-gray-400 mb-4">No active loans</div>
                              <Link to="/loans/apply">
                                <Button type="primary" className="bg-amber-600 hover:bg-amber-500 border-none">
                                  Apply for Loan
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {loans.slice(0, 3).map((loan, index) => (
                                <div 
                                  key={loan.id || index} 
                                  className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-amber-500/30 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/10"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <div className="font-semibold text-gray-200">{loan.productName || 'Personal Loan'}</div>
                                      <div className="text-xs text-gray-400">Disbursed: {loan.disbursementDate ? new Date(loan.disbursementDate).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                    <Tag color={getLoanStatusColor(loan.status)} className="m-0">
                                      {loan.status || 'PENDING'}
                                    </Tag>
                                  </div>
                                  <div className="mb-3">
                                    <div className="text-amber-300 font-bold text-lg">
                                      {formatCurrency(loan.outstandingBalance || loan.loanAmount)}
                                    </div>
                                    <div className="text-xs text-gray-400">Outstanding Balance</div>
                                  </div>
                                  <Progress 
                                    percent={Math.min(100, Math.round(((loan.loanAmount - (loan.outstandingBalance || 0)) / loan.loanAmount) * 100))} 
                                    size="small" 
                                    strokeColor={{
                                      from: '#f59e0b',
                                      to: '#10b981',
                                    }}
                                    showInfo={false}
                                  />
                                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Paid: {formatCurrency(loan.loanAmount - (loan.outstandingBalance || 0))}</span>
                                    <span>Total: {formatCurrency(loan.loanAmount)}</span>
                                  </div>
                                </div>
                              ))}
                              
                              {loans.length > 3 && (
                                <div className="text-center pt-2">
                                  <Text type="secondary" className="text-gray-400">
                                    +{loans.length - 3} more loans
                                  </Text>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Financial Health */}
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 backdrop-blur-md border border-green-500/20 shadow-xl">
                          <h3 className="text-xl font-bold text-green-300 flex items-center mb-6">
                            <PieChartOutlined className="mr-3 text-green-400" />
                            Quantum Financial Health
                          </h3>
                          
                          <div className="text-center mb-6">
                            <div className="relative inline-block">
                              <Progress
                                type="circle"
                                percent={78}
                                strokeWidth={10}
                                strokeColor={{
                                  '0%': '#10b981',
                                  '100%': '#3b82f6',
                                }}
                                format={() => (
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-300">78%</div>
                                    <div className="text-xs text-gray-400">Score</div>
                                  </div>
                                )}
                                width={120}
                              />
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full border-4 border-green-500/30 animate-ping opacity-75"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Income vs Expenses</span>
                              <Tag color="green">Excellent</Tag>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Debt-to-Income Ratio</span>
                              <Tag color="green">Good</Tag>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Savings Rate</span>
                              <Tag color="blue">Average</Tag>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Credit Utilization</span>
                              <Tag color="green">Excellent</Tag>
                            </div>
                          </div>
                          
                          <Divider className="my-4 bg-gray-700/50" />
                          
                          <div className="text-center">
                            <Button 
                              type="primary" 
                              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 border-none shadow-lg hover:shadow-green-500/25 w-full"
                            >
                              View Detailed Report
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'analytics',
                label: (
                  <span className="flex items-center text-purple-300">
                    <BarChartOutlined className="mr-2" />
                    Quantum Analytics
                  </span>
                ),
                children: (
                  <div className="p-6">
                    <div className="text-center py-10">
                      <Title level={3} className="text-purple-300">
                        Advanced Financial Analytics
                      </Title>
                      <Text className="text-gray-400">
                        Deep insights and predictive analytics coming soon
                      </Text>
                    </div>
                  </div>
                )
              },
              {
                key: 'insights',
                label: (
                  <span className="flex items-center text-cyan-300">
                    <FundOutlined className="mr-2" />
                    Wealth Insights
                  </span>
                ),
                children: (
                  <div className="p-6">
                    <div className="text-center py-10">
                      <Title level={3} className="text-cyan-300">
                        Personalized Wealth Insights
                      </Title>
                      <Text className="text-gray-400">
                        AI-powered financial recommendations coming soon
                      </Text>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Quantum Banking Platform • Secure • Advanced • Next Generation</p>
          <p className="mt-2">© {new Date().getFullYear()} Quantum Bank. All rights reserved.</p>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-slow {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-10px) translateX(5px) rotate(2deg); }
          66% { transform: translateY(5px) translateX(-5px) rotate(-2deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 0.5; transform: scale(1); }
        }
        
        @keyframes pulse-medium {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        
        @keyframes pulse-fast {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        
        @keyframes pulse-slower {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.03); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        
        @keyframes text-shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes border-pulse {
          0% { border-color: rgba(6, 182, 212, 0.5); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
          100% { border-color: rgba(6, 182, 212, 0.3); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 4s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 3s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          background: linear-gradient(
            to right,
            rgba(6, 182, 212, 0.8) 0%,
            rgba(139, 92, 246, 0.8) 20%,
            rgba(6, 182, 212, 0.8) 40%,
            rgba(6, 182, 212, 0.8) 100%
          );
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          animation: text-shimmer 3s linear infinite;
        }
        
        .animate-border-pulse {
          animation: border-pulse 2s infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .dashboard-title {
          position: relative;
          display: inline-block;
        }
        
        .dashboard-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, rgba(6, 182, 212, 0), rgba(6, 182, 212, 0.8), rgba(6, 182, 212, 0));
          border-radius: 2px;
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .dashboard-tabs .ant-tabs-tab {
          padding: 16px 24px;
          margin: 0 4px;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-bottom: none;
          transition: all 0.3s ease;
        }
        
        .dashboard-tabs .ant-tabs-tab-active {
          background: rgba(79, 70, 229, 0.2);
          border-color: rgba(99, 102, 241, 0.4);
          border-bottom: none;
        }
        
        .dashboard-tabs .ant-tabs-ink-bar {
          background: linear-gradient(to right, rgba(6, 182, 212, 0.8), rgba(139, 92, 246, 0.8));
          height: 3px;
          border-radius: 3px;
        }
        
        .dashboard-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }
        
        .dashboard-tabs .ant-tabs-content-holder {
          border-top: 1px solid rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;