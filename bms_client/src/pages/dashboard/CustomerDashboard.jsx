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
  notification
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
  CrownOutlined
} from '@ant-design/icons';
import "./customerdashboard.css"
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

  useEffect(() => {
    fetchDashboardData();
    init3DBackground();
    
    // Typewriter effect for header
    if (headerTextRef.current) {
      const text = headerTextRef.current.textContent;
      headerTextRef.current.textContent = '';
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          headerTextRef.current.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      typeWriter();
    }
    
    return () => {
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl');
        if (gl) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }
    };
  }, []);

  const init3DBackground = () => {
    // This would be implemented with Three.js for a real 3D background
    // For this example, we'll use CSS 3D transformations
  };

  const fetchDashboardData = async () => {
    try {
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
      <ArrowDownOutlined className="text-green-500" /> : 
      <ArrowUpOutlined className="text-red-500" />;
  };

  if (loading) {
    return (
      <div className="customer-dashboard-loading">
        <div className="max-w-7xl mx-auto">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard-container">
      {/* Enhanced 3D Background */}
      <div className="dashboard-background-elements">
        <canvas
          ref={canvasRef}
          className="webgl-background"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0
          }} />

        <div className="floating-3d-shapes">
          <div className="shape-1"></div>
          <div className="shape-2"></div>
          <div className="shape-3"></div>
          <div className="shape-4"></div>
        </div>

        <div className="particle-network-animation"></div>

        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="animated-grid-background"></div>

        {/* Additional 3D elements */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                background: `radial-gradient(circle, ${i % 3 === 0 ? 'var(--neon-blue)' : i % 3 === 1 ? 'var(--neon-purple)' : 'var(--neon-green)'}, transparent)`,
                width: `${5 + Math.random() * 15}px`,
                height: `${5 + Math.random() * 15}px`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        {/* Header Section with 3D effect */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="header-title">
                <span className="text-gradient-3d floating-text">Financial Command Center</span>
                <CrownOutlined className="ml-2 text-yellow-400 floating" />
              </h1>
              <p className="header-subtitle" ref={headerTextRef}>
                Your financial ecosystem at a glance - empowered for smart decisions
              </p>
              <div className="flex items-center mt-2">
                <TrophyOutlined className="text-amber-400 mr-2" />
                <span className="text-sm text-amber-300">Elite Banking Member • Level 4</span>
              </div>
            </div>
            <div className="header-actions">
              <Tooltip title="Notifications" placement="bottom">
                <button className="header-action-btn glassmorphism-3d hover-3d">
                  <BellOutlined />
                  <Badge count={3} size="small" className="absolute -top-1 -right-1" />
                </button>
              </Tooltip>
              <Tooltip title="Financial Insights" placement="bottom">
                <button className="header-action-btn glassmorphism-3d hover-3d">
                  <BarChartOutlined />
                </button>
              </Tooltip>
              <Tooltip title="Settings" placement="bottom">
                <Link to="/settings">
                  <button className="header-action-btn glassmorphism-3d hover-3d">
                    <SettingOutlined />
                  </button>
                </Link>
              </Tooltip>
              <div className="user-avatar-3d">
                <Avatar
                  size={44}
                  icon={<UserOutlined />}
                  className="avatar-3d"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    transform: 'translateZ(20px)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                  }} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Status Alert with 3D effect */}
        {(!kycStatus || kycStatus.status !== 'APPROVED') && (
          <div className="kyc-alert-container">
            <div
              className="kyc-alert glassmorphism-3d hover-3d"
              style={{ borderLeftColor: getKYCStatusColor(kycStatus?.status) }}
            >
              <div className="kyc-alert-icon">
                <div
                  className="icon-container floating"
                  style={{ backgroundColor: getKYCStatusColor(kycStatus?.status) + '30' }}
                >
                  <SecurityScanOutlined style={{ color: getKYCStatusColor(kycStatus?.status) }} />
                </div>
              </div>
              <div className="kyc-alert-content">
                <h3 style={{ color: getKYCStatusColor(kycStatus?.status) }}>
                  Identity Verification: {getKYCStatusText(kycStatus?.status || 'NOT_SUBMITTED')}
                </h3>
                <p>
                  {kycStatus?.status === 'PENDING'
                    ? 'Your verification documents are being processed. This typically takes 1-2 business days.'
                    : kycStatus?.status === 'REJECTED'
                      ? `Verification was unsuccessful: ${kycStatus.rejectionReason || 'Please contact our support team for assistance.'}`
                      : 'Complete your identity verification to unlock premium banking features and higher transaction limits.'}
                </p>
                {kycStatus?.status !== 'REJECTED' && (
                  <div className="kyc-alert-action">
                    <Link
                      to="/kyc/submit"
                      className="kyc-action-btn btn-3d"
                      style={{
                        backgroundColor: getKYCStatusColor(kycStatus?.status) + '20',
                        color: getKYCStatusColor(kycStatus?.status)
                      }}
                    >
                      {kycStatus?.status === 'PENDING' ? 'Check Status' : 'Begin Verification'}
                      <RocketOutlined className="ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary Cards with 3D effect */}
        <div className="financial-summary-section">
          <h2 className="section-title floating-text">
            <DashboardOutlined className="mr-2" />
            Wealth Overview
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <div className="summary-card total-balance-card glassmorphism-3d hover-3d-lift">
                <div className="card-header">
                  <div className="card-icon floating">
                    <WalletOutlined />
                  </div>
                  <div>
                    <div className="card-title">Liquid Assets</div>
                    <div className="card-value text-gradient-3d">{formatCurrency(getTotalBalance())}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="card-change positive">
                    <RiseOutlined className="mr-1" />
                    2.3% growth this month
                  </span>
                  <Link to="/accounts" className="card-link btn-3d-text">
                    Explore Details <EyeOutlined />
                  </Link>
                </div>
                <div className="card-sparkle"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <div className="summary-card total-loans-card glassmorphism-3d hover-3d-lift">
                <div className="card-header">
                  <div className="card-icon floating">
                    <CreditCardOutlined />
                  </div>
                  <div>
                    <div className="card-title">Credit Portfolio</div>
                    <div className="card-value text-gradient-3d">{formatCurrency(getTotalLoanBalance())}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="card-change">
                    {loans.filter(loan => loan.status === 'DISBURSED').length} Active Facilities
                  </span>
                  <Link to="/loans" className="card-link btn-3d-text">
                    Manage Loans <EyeOutlined />
                  </Link>
                </div>
                <div className="card-sparkle"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <div className="summary-card monthly-spending-card glassmorphism-3d hover-3d-lift">
                <div className="card-header">
                  <div className="card-icon floating">
                    <DollarOutlined />
                  </div>
                  <div>
                    <div className="card-title">Monthly Expenditure</div>
                    <div className="card-value text-gradient-3d">{formatCurrency(12500)}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="card-change negative">
                    <FallOutlined className="mr-1" />
                    5.2% less than last month
                  </span>
                  <Link to="/transactions" className="card-link btn-3d-text">
                    View Analysis <BarChartOutlined />
                  </Link>
                </div>
                <div className="card-sparkle"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Quick Actions with 3D effect */}
        <div className="quick-actions-section">
          <h2 className="section-title floating-text">
            <RocketOutlined className="mr-2" />
            Instant Access
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6}>
              <Link to="/transactions/transfer" className="quick-action-card glassmorphism-3d hover-3d-lift">
                <div className="action-icon money-transfer floating">
                  <SendOutlined />
                </div>
                <h3>Fund Transfer</h3>
                <p>Seamless money movement</p>
                <div className="action-sparkle"></div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/beneficiaries" className="quick-action-card glassmorphism-3d hover-3d-lift">
                <div className="action-icon beneficiaries floating">
                  <TeamOutlined />
                </div>
                <h3>Beneficiary Hub</h3>
                <p>Manage recipients</p>
                <div className="action-sparkle"></div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/loans/apply" className="quick-action-card glassmorphism-3d hover-3d-lift">
                <div className="action-icon apply-loan floating">
                  <CreditCardOutlined />
                </div>
                <h3>Credit Solutions</h3>
                <p>Personalized lending</p>
                <div className="action-sparkle"></div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/emi-calculator" className="quick-action-card glassmorphism-3d hover-3d-lift">
                <div className="action-icon emi-calculator floating">
                  <CalculatorOutlined />
                </div>
                <h3>Finance Planner</h3>
                <p>Calculate repayments</p>
                <div className="action-sparkle"></div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/transactions/history" className="quick-action-card glassmorphism-3d hover-3d-lift">
                <div className="action-icon transaction-history floating">
                  <HistoryOutlined />
                </div>
                <h3>Transaction Ledger</h3>
                <p>Complete history</p>
                <div className="action-sparkle"></div>
              </Link>
            </Col>

            <Col xs={12} sm={8} md={6}>
              <Link to="/investment" className="quick-action-card glassmorphism-3d hover-3d-lift">
                <div className="action-icon investment floating">
                  <BarChartOutlined />
                </div>
                <h3>Wealth Builder</h3>
                <p>Investment opportunities</p>
                <div className="action-sparkle"></div>
              </Link>
            </Col>
          </Row>
        </div>

        {/* Main Dashboard Content */}
        <div className="dashboard-main-content">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="dashboard-tabs"
            animated
          >
            <TabPane
              tab={<span className="tab-label">
                <DashboardOutlined />
                Financial Overview
              </span>}
              key="overview"
            >
              <Row gutter={[16, 16]}>
                {/* Accounts Section */}
                <Col xs={24} lg={12}>
                  <div className="dashboard-section glassmorphism-3d">
                    <div className="section-header">
                      <h3>
                        <BankOutlined className="mr-2" />
                        Your Accounts
                      </h3>
                      <Link to="/accounts" className="view-all-link btn-3d-text">
                        View All <ArrowRightOutlined />
                      </Link>
                    </div>

                    {accounts.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <BankOutlined />
                        </div>
                        <p>No accounts found</p>
                        <Link to="/accounts/open" className="btn-primary-3d">
                          Open New Account
                        </Link>
                      </div>
                    ) : (
                      <div className="accounts-list">
                        {accounts.map((account, index) => (
                          <div
                            key={account.id || index}
                            className="account-item hover-3d"
                          >
                            <div className="account-icon">
                              <div className="icon-container floating">
                                <BankOutlined />
                              </div>
                            </div>
                            <div className="account-details">
                              <div className="account-name">{account.accountName || 'Primary Account'}</div>
                              <div className="account-number">
                                {account.accountNumber || 'No account number'}
                              </div>
                            </div>
                            <div className="account-balance">
                              <div className="balance-amount">{formatCurrency(account.balance)}</div>
                              <div className="account-type">{account.accountType || 'Savings'}</div>
                            </div>
                            <div className="account-actions">
                              <Tooltip title="View Details">
                                <Link
                                  to={`/accounts/${account.accountNumber}`}
                                  className="action-btn btn-3d"
                                >
                                  <EyeOutlined />
                                </Link>
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>

                {/* Loans Section */}
                <Col xs={24} lg={12}>
                  <div className="dashboard-section glassmorphism-3d">
                    <div className="section-header">
                      <h3>
                        <CreditCardOutlined className="mr-2" />
                        Loan Accounts
                      </h3>
                      <Link to="/loans" className="view-all-link btn-3d-text">
                        View All <ArrowRightOutlined />
                      </Link>
                    </div>

                    {loans.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <CreditCardOutlined />
                        </div>
                        <p>No active loans</p>
                        <Link to="/loans/apply" className="btn-primary-3d">
                          Apply for Loan
                        </Link>
                      </div>
                    ) : (
                      <div className="loans-list">
                        {loans.map((loan, index) => (
                          <div
                            key={loan.id || index}
                            className="loan-item hover-3d"
                          >
                            <div className="loan-icon">
                              <div
                                className="icon-container floating"
                                style={{ backgroundColor: getLoanStatusColor(loan.status) + '20' }}
                              >
                                <CreditCardOutlined style={{ color: getLoanStatusColor(loan.status) }} />
                              </div>
                            </div>
                            <div className="loan-details">
                              <div className="loan-name">{loan.loanType || 'Personal Loan'}</div>
                              <div className="loan-number">
                                {loan.loanAccountNumber || 'No loan number'}
                              </div>
                            </div>
                            <div className="loan-info">
                              <div className="loan-amount">{formatCurrency(loan.loanAmount)}</div>
                              <div className="loan-status">
                                <Tag color={getLoanStatusColor(loan.status)}>
                                  {loan.status || 'UNKNOWN'}
                                </Tag>
                              </div>
                            </div>
                            <div className="loan-actions">
                              <Tooltip title="View Details">
                                <Link
                                  to={`/loans/${loan.id}`}
                                  className="action-btn btn-3d"
                                >
                                  <EyeOutlined />
                                </Link>
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>

                {/* Recent Transactions */}
                <Col xs={24}>
                  <div className="dashboard-section glassmorphism-3d">
                    <div className="section-header">
                      <h3>
                        <HistoryOutlined className="mr-2" />
                        Recent Transactions
                      </h3>
                      <Link to="/transactions" className="view-all-link btn-3d-text">
                        View All <ArrowRightOutlined />
                      </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <TransactionOutlined />
                        </div>
                        <p>No recent transactions</p>
                      </div>
                    ) : (
                      <div className="transactions-list">
                        {recentTransactions.map((transaction, index) => (
                          <div
                            key={transaction.id || index}
                            className="transaction-item hover-3d"
                          >
                            <div className="transaction-icon">
                              <div className="icon-container floating">
                                {getTransactionIcon(transaction.transactionType)}
                              </div>
                            </div>
                            <div className="transaction-details">
                              <div className="transaction-description">
                                {transaction.description || 'Transaction'}
                              </div>
                              <div className="transaction-date">
                                {transaction.transactionDate
                                  ? new Date(transaction.transactionDate).toLocaleDateString()
                                  : 'Date not available'}
                              </div>
                            </div>
                            <div className="transaction-amount">
                              <span
                                className={`amount ${transaction.transactionType === 'CREDIT' ? 'credit' : 'debit'}`}
                              >
                                {transaction.transactionType === 'CREDIT' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </span>
                            </div>
                            <div className="transaction-actions">
                              <Tooltip title="View Details">
                                <Link
                                  to={`/transactions/${transaction.id}`}
                                  className="action-btn btn-3d"
                                >
                                  <FileTextOutlined />
                                </Link>
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={<span className="tab-label">
                <BarChartOutlined />
                Financial Analytics
              </span>}
              key="analytics"
            >
              <div className="analytics-container">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <div className="analytics-card glassmorphism-3d">
                      <h4>Spending by Category</h4>
                      <div className="spending-chart">
                        <div className="chart-placeholder">
                          <PieChartOutlined />
                          <p>Monthly spending visualization</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div className="analytics-card glassmorphism-3d">
                      <h4>Income vs Expenses</h4>
                      <div className="income-expense-chart">
                        <div className="chart-placeholder">
                          <BarChartOutlined />
                          <p>Income vs expense comparison</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Premium Features Banner */}
        <div className="premium-banner-section mt-6">
          <div className="premium-banner glassmorphism-3d hover-3d-lift">
            <div className="banner-content">
              <div className="banner-text">
                <StarOutlined className="text-yellow-400 text-2xl mr-3 floating" />
                <div>
                  <h3 className="text-white font-semibold">Unlock Premium Features</h3>
                  <p className="text-blue-100">Enhanced limits, priority support, and exclusive benefits</p>
                </div>
              </div>
              <Button type="primary" className="btn-3d">
                Upgrade Now <ArrowRightOutlined />
              </Button>
            </div>
            <div className="banner-sparkles">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="banner-sparkle"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                    left: `${20 + i * 15}%`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;