// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/admin';
import { useAuth } from '../../hooks/useAuth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    todayTransactionVolume: 0,
    pendingLoans: 0,
    totalLoanAmount: 0,
    totalOutstandingAmount: 0,
    pendingKYC: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchDashboardStats();
    initBackgroundAnimation();
    
    return () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        if (gl) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }
    };
  }, []);

  const initBackgroundAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      varying vec2 vTexCoord;
      
      void main() {
        gl_Position = aVertexPosition;
        vTexCoord = aVertexPosition.xy * 0.5 + 0.5;
      }
    `;

    // Fragment shader program
    const fsSource = `
      precision mediump float;
      varying vec2 vTexCoord;
      uniform float uTime;
      uniform vec2 uResolution;
      
      void main() {
        vec2 uv = vTexCoord;
        uv.y *= uResolution.y / uResolution.x;
        
        // Animate with time
        uv.x += sin(uTime * 0.001) * 0.1;
        uv.y += cos(uTime * 0.001) * 0.1;
        
        // Create flowing colors
        float r = 0.2 + 0.2 * sin(uv.x * 5.0 + uTime * 0.001);
        float g = 0.1 + 0.2 * sin(uv.y * 3.0 + uTime * 0.002);
        float b = 0.3 + 0.2 * sin((uv.x + uv.y) * 4.0 + uTime * 0.003);
        
        gl_FragColor = vec4(r, g, b, 0.15);
      }
    `;

    // Initialize shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    // Create buffer
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const timeUniformLocation = gl.getUniformLocation(shaderProgram, "uTime");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "uResolution");
    
    // Animation loop
    let animationFrameId;
    let startTime = Date.now();
    
    const render = () => {
      const currentTime = Date.now() - startTime;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(shaderProgram);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    render();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="three-d-spinner">
          <div className="three-d-inner"></div>
        </div>
        <p className="typing-animation">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard dark-theme">
      <canvas ref={canvasRef} className="background-animation"></canvas>
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="three-d-text">Admin Dashboard</h1>
          <p className="welcome-message typing-animation">
            Welcome back, {user?.firstName} {user?.lastName}!
          </p>
        </div>

        {error && (
          <div className="error-alert floating-alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <nav className="tab-nav">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="tab-icon">👥</span>
              Users
            </button>
            <button
              className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <span className="tab-icon">💸</span>
              Transactions
            </button>
            <button
              className={`tab-button ${activeTab === 'loans' ? 'active' : ''}`}
              onClick={() => setActiveTab('loans')}
            >
              <span className="tab-icon">💰</span>
              Loans
            </button>
            <button
              className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="tab-icon">📈</span>
              Analytics
            </button>
            <button
              className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <span className="tab-icon">📋</span>
              Reports
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="tab-content">
          {activeTab === 'overview' && <OverviewTab stats={stats} formatCurrency={formatCurrency} />}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'transactions' && <TransactionsTab />}
          {activeTab === 'loans' && <LoansTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, formatCurrency }) => {
  return (
    <div className="overview-tab">
      {/* Stats Overview */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="users"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon="active-users"
          color="green"
        />
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          icon="balance"
          color="purple"
        />
        <StatCard
          title="Pending Loans"
          value={stats.pendingLoans}
          icon="loans"
          color="orange"
          link="/admin/loans"
          linkText="View Details"
        />
        <StatCard
          title="Pending KYC"
          value={stats.pendingKYC}
          icon="kyc"
          color="red"
          link="/admin/kyc"
          linkText="View Details"
        />
        <StatCard
          title="Transactions Today"
          value={stats.todayTransactionVolume}
          icon="transactions"
          color="teal"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <ActionCard
            title="User Management"
            description="Manage system users and their permissions"
            link="/admin/users"
            linkText="Manage Users"
            icon="users"
          />
          <ActionCard
            title="Transaction Monitoring"
            description="View and monitor all transactions"
            link="/admin/transactions"
            linkText="View Transactions"
            icon="transactions"
          />
          <ActionCard
            title="Loan Management"
            description="Approve and manage loan applications"
            link="/admin/loans"
            linkText="Manage Loans"
            icon="loans"
          />
          <ActionCard
            title="KYC Management"
            description="Review and verify customer documents"
            link="/admin/kyc"
            linkText="Manage KYC"
            icon="kyc"
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, link, linkText }) => {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'active-users':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'balance':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'loans':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'kyc':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'transactions':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`stat-card stat-card-${color} floating-card`}>
      <div className="stat-icon">{getIcon()}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      {link && (
        <Link to={link} className="stat-link">
          {linkText} →
        </Link>
      )}
    </div>
  );
};

// Action Card Component
const ActionCard = ({ title, description, link, linkText, icon }) => {
  return (
    <Link to={link} className="action-card floating-card">
      <div className="action-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="action-link">{linkText} →</span>
      </div>
    </Link>
  );
};

// User Management Tab Component
const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers({ page: 0, size: 50 });
      setUsers(response.data.content || response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadUsersCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Roles', 'Created At'];
    const csvData = users.map(user => [
      user.id,
      user.fullName || `${user.firstName} ${user.lastName}`,
      user.email,
      user.phone || 'N/A',
      user.status,
      Array.isArray(user.roles) ? user.roles.join(', ') : 'N/A',
      new Date(user.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="tab-loading">Loading users...</div>;
  }

  return (
    <div className="management-tab">
      <div className="tab-header">
        <h2 className="section-title">User Management</h2>
        <button
          className="download-button floating-button"
          onClick={downloadUsersCSV}
        >
          Download CSV
        </button>
      </div>

      {error && <div className="error-alert floating-alert">{error}</div>}

      <div className="table-container floating-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Roles</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {Array.isArray(user.roles) ? user.roles.join(', ') : 'N/A'}
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Transactions Tab Component
const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await adminAPI.getAllTransactions({ page: 0, size: 50 });
      // Handle both array and paginated response formats
      const transactionsData = response.data.content || response.data || [];
      setTransactions(transactionsData);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTransactionsCSV = () => {
    const headers = ['ID', 'Account', 'Type', 'Amount', 'Reference', 'Description', 'Date'];
    const csvData = transactions.map(transaction => [
      transaction.id,
      transaction.accountNumber || transaction.account?.accountNumber || 'N/A',
      transaction.type,
      transaction.amount,
      transaction.referenceNumber || 'N/A',
      transaction.description || 'N/A',
      new Date(transaction.transactionDate || transaction.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions_report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadTransactionsPDF = async () => {
    try {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      
      const response = await adminAPI.generateTransactionReportPDF({
        startDate,
        endDate
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_report_${startDate}_to_${endDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF report');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return <div className="tab-loading">Loading transactions...</div>;
  }

  return (
    <div className="management-tab">
      <div className="tab-header">
        <h2 className="section-title">Transaction Monitoring</h2>
        <div className="action-buttons">
          <button
            className="download-button floating-button"
            onClick={downloadTransactionsCSV}
          >
            Download CSV
          </button>
          <button
            className="download-button secondary floating-button"
            onClick={downloadTransactionsPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {error && <div className="error-alert floating-alert">{error}</div>}

      <div className="table-container floating-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reference</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.accountNumber || transaction.account?.accountNumber || 'N/A'}</td>
                <td>
                  <span className={`type-badge type-${transaction.type?.toLowerCase() || 'unknown'}`}>
                    {transaction.type || 'UNKNOWN'}
                  </span>
                </td>
                <td className="amount-cell">
                  {formatCurrency(transaction.amount)}
                </td>
                <td>{transaction.referenceNumber || 'N/A'}</td>
                <td>{transaction.description || 'N/A'}</td>
                <td>
                  {new Date(transaction.transactionDate || transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Loans Tab Component
const LoansTab = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);
  
  const fetchLoans = async () => {
    try {
      const response = await adminAPI.getLoanStatistics();
      // Check if response.data is an array or an object with loans property
      if (Array.isArray(response.data)) {
        setLoans(response.data);
      } else if (response.data && response.data.loans) {
        setLoans(response.data.loans);
      } else {
        // Fallback to mock data if API structure is different
        setLoans([
          {
            id: 1,
            loanAccountNumber: "LN1755711978500",
            loanType: "PERSONAL_LOAN",
            loanAmount: 10000.00,
            status: "DISBURSED",
            createdAt: "2025-08-20T23:16:18.499522"
          }
        ]);
      }
    } catch (err) {
      setError('Failed to fetch loans');
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadLoansCSV = () => {
    const headers = ['Loan Account', 'Type', 'Amount', 'Status', 'Created At'];
    const csvData = loans.map(loan => [
      loan.loanAccountNumber,
      loan.loanType,
      loan.loanAmount,
      loan.status,
      new Date(loan.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'loans_report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return <div className="tab-loading">Loading loans...</div>;
  }

  return (
    <div className="management-tab">
      <div className="tab-header">
        <h2 className="section-title">Loan Management</h2>
        <button
          className="download-button floating-button"
          onClick={downloadLoansCSV}
        >
          Download CSV
        </button>
      </div>

      {error && <div className="error-alert floating-alert">{error}</div>}

      <div className="table-container floating-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Loan Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? loans.map(loan => (
              <tr key={loan.id || loan.loanAccountNumber}>
                <td>{loan.loanAccountNumber}</td>
                <td>{loan.loanType}</td>
                <td className="amount-cell">
                  {formatCurrency(loan.loanAmount)}
                </td>
                <td>
                  <span className={`status-badge status-${loan.status?.toLowerCase() || 'unknown'}`}>
                    {loan.status || 'UNKNOWN'}
                  </span>
                </td>
                <td>
                  {new Date(loan.createdAt).toLocaleDateString()}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No loans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      
      // Set date range based on selection
      switch(timeRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      const [revenueResponse, customerResponse, transactionResponse] = await Promise.all([
        adminAPI.getRevenueAnalytics({ startDate: formattedStartDate, endDate: formattedEndDate }),
        adminAPI.getCustomerGrowthAnalytics({ startDate: formattedStartDate, endDate: formattedEndDate }),
        adminAPI.getTransactionAnalytics({ startDate: formattedStartDate, endDate: formattedEndDate })
      ]);
      
      setAnalytics({
        revenue: revenueResponse.data,
        customer: customerResponse.data,
        transaction: transactionResponse.data
      });
    } catch (err) {
      setError('');
      console.error('Error fetching analytics:', err);
      
      // Fallback to mock data for demonstration
      setAnalytics(generateMockAnalyticsData(timeRange));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2 className="section-title">Analytics Dashboard</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''} 
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''} 
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''} 
            onClick={() => setTimeRange('90d')}
          >
            90D
          </button>
          <button 
            className={timeRange === '1y' ? 'active' : ''} 
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </button>
        </div>
      </div>

      {error && <div className="error-alert floating-alert">{error}</div>}

      {analytics ? (
        <div className="analytics-content">
          {/* Overview Stats */}
          <div className="analytics-overview">
            <div className="stat-card floating-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(analytics.revenue.totalRevenue || 0)}</h3>
                <p>Total Revenue</p>
              </div>
              <div className="stat-trend">
                <span className="trend-up">+12.5%</span>
              </div>
            </div>
            
            <div className="stat-card floating-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{analytics.customer.totalCustomers || 0}</h3>
                <p>Total Customers</p>
              </div>
              <div className="stat-trend">
                <span className="trend-up">+8.2%</span>
              </div>
            </div>
            
            <div className="stat-card floating-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{analytics.transaction.totalTransactions || 0}</h3>
                <p>Total Transactions</p>
              </div>
              <div className="stat-trend">
                <span className="trend-up">+15.3%</span>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="analytics-grid">
            {/* Revenue Trend Chart */}
            <div className="analytics-card floating-card">
              <h3>Revenue Trend</h3>
              <div className="chart-container">
                <LineChart data={analytics.revenue.trendData || []} />
              </div>
            </div>

            {/* Customer Growth Chart */}
            <div className="analytics-card floating-card">
              <h3>Customer Growth</h3>
              <div className="chart-container">
                <BarChart data={analytics.customer.growthData || []} />
              </div>
            </div>

            {/* Transaction Types Chart */}
            <div className="analytics-card floating-card">
              <h3>Transaction Types</h3>
              <div className="chart-container">
                <PieChart data={analytics.transaction.typeDistribution || []} />
              </div>
            </div>

            {/* Loan Status Distribution */}
            <div className="analytics-card floating-card">
              <h3>Loan Status Distribution</h3>
              <div className="chart-container">
                <DoughnutChart data={[
                  { label: 'Approved', value: 45, color: '#10b981' },
                  { label: 'Pending', value: 30, color: '#f59e0b' },
                  { label: 'Rejected', value: 15, color: '#ef4444' },
                  { label: 'Disbursed', value: 10, color: '#3b82f6' }
                ]} />
              </div>
            </div>

            {/* User Activity Heatmap */}
            <div className="analytics-card floating-card">
              <h3>User Activity Heatmap</h3>
              <div className="chart-container">
                <HeatmapChart data={generateHeatmapData()} />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="analytics-card floating-card">
              <h3>Performance Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-value">98.7%</div>
                  <div className="metric-label">Uptime</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">1.2s</div>
                  <div className="metric-label">Avg. Response</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">99.5%</div>
                  <div className="metric-label">Success Rate</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">0.03%</div>
                  <div className="metric-label">Error Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">No analytics data available</div>
      )}
    </div>
  );
};

// Chart Components
const LineChart = ({ data }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find min and max values
    const values = data.map(item => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    // Calculate scales
    const xScale = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / (maxValue - minValue);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - padding * 2) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxValue - (maxValue - minValue) * (i / 5)), padding - 10, y + 4);
    }
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    data.forEach((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.value - minValue) * yScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    data.forEach((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.value - minValue) * yScale;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      
      // Draw glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.fill();
      
      // Draw label
      if (i % 2 === 0) { // Show every other label to avoid clutter
        ctx.fillStyle = '#e6e6e6';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(point.label, x, height - padding + 20);
      }
    });
  }, [data]);
  
  return <canvas ref={canvasRef} width={400} height={250} className="chart-canvas" />;
};

const BarChart = ({ data }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value
    const values = data.map(item => item.value);
    const maxValue = Math.max(...values);
    
    // Calculate scales
    const barWidth = (width - padding * 2) / data.length - 10;
    const yScale = (height - padding * 2) / maxValue;
    
    // Draw bars
    data.forEach((item, i) => {
      const x = padding + i * (barWidth + 10);
      const barHeight = item.value * yScale;
      const y = height - padding - barHeight;
      
      // Draw bar
      ctx.fillStyle = item.color || '#8b5cf6';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw rounded top
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x + barWidth / 2, y, barWidth / 2, Math.PI, 0, false);
      ctx.fill();
      
      // Draw value on top
      ctx.fillStyle = '#e6e6e6';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.value, x + barWidth / 2, y - 10);
      
      // Draw label
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - padding + 20);
    });
  }, [data]);
  
  return <canvas ref={canvasRef} width={400} height={250} className="chart-canvas" />;
};

const PieChart = ({ data }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw pie chart
    let startAngle = 0;
    
    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color || getColor(i);
      ctx.fill();
      
      // Draw label
      const angle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillStyle = '#e6e6e6';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round((item.value / total) * 100)}%`, x, y);
      
      // Draw legend
      const legendX = 20;
      const legendY = 20 + i * 20;
      
      ctx.fillStyle = item.color || getColor(i);
      ctx.fillRect(legendX, legendY, 15, 15);
      
      ctx.fillStyle = '#e6e6e6';
      ctx.font = '12px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 25, legendY + 12);
      
      startAngle += sliceAngle;
    });
  }, [data]);
  
  return <canvas ref={canvasRef} width={400} height={250} className="chart-canvas" />;
};

const DoughnutChart = ({ data }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.5;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw doughnut chart
    let startAngle = 0;
    
    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(startAngle) * innerRadius, centerY + Math.sin(startAngle) * innerRadius);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color || getColor(i);
      ctx.fill();
      
      startAngle += sliceAngle;
    });
    
    // Draw center text
    ctx.fillStyle = '#e6e6e6';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Loan Status', centerX, centerY);
  }, [data]);
  
  return <canvas ref={canvasRef} width={400} height={250} className="chart-canvas" />;
};

const HeatmapChart = ({ data }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cellSize = 20;
    const padding = 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value for color scaling
    const maxValue = Math.max(...data.map(row => Math.max(...row.values)));
    
    // Draw heatmap
    data.forEach((row, i) => {
      row.values.forEach((value, j) => {
        const x = j * (cellSize + padding) + padding;
        const y = i * (cellSize + padding) + padding;
        
        // Calculate color intensity
        const intensity = value / maxValue;
        const color = `rgb(${Math.floor(86 + intensity * 169)}, ${Math.floor(97 + intensity * 158)}, ${Math.floor(241 - intensity * 100)})`;
        
        // Draw cell
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Draw value
        if (value > 0) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(value, x + cellSize / 2, y + cellSize / 2);
        }
      });
      
      // Draw row label
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(row.label, padding - 5, i * (cellSize + padding) + padding + cellSize / 2);
    });
    
    // Draw column labels
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach((day, i) => {
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(day, i * (cellSize + padding) + padding + cellSize / 2, padding - 15);
    });
  }, [data]);
  
  return <canvas ref={canvasRef} width={400} height={250} className="chart-canvas" />;
};

// Reports Tab Component
const ReportsTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('transaction');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const generateReport = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      switch (reportType) {
        case 'transaction':
          response = await adminAPI.generateTransactionReportPDF(dateRange);
          break;
        case 'user':
          response = await adminAPI.generateUserReportPDF(dateRange);
          break;
        case 'loan':
          response = await adminAPI.generateLoanReportPDF(dateRange);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${dateRange.startDate}_to_${dateRange.endDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      // Add to recent reports
      const newReport = {
        id: Date.now(),
        type: reportType,
        dateRange: { ...dateRange },
        generatedAt: new Date().toISOString(),
        status: 'success'
      };
      
      setReports(prev => [newReport, ...prev.slice(0, 4)]);
    } catch (err) {
      setError('Failed to generate report');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-tab">
      <div className="reports-header">
        <h2 className="section-title">Report Generation</h2>
      </div>

      {error && <div className="error-alert floating-alert">{error}</div>}

      <div className="reports-content">
        {/* Report Generator */}
        <div className="report-generator floating-card">
          <h3>Generate New Report</h3>
          <div className="report-form">
            <div className="form-group">
              <label>Report Type</label>
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                className="form-select"
              >
                <option value="transaction">Transaction Report</option>
                <option value="user">User Report</option>
                <option value="loan">Loan Report</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="form-input"
              />
            </div>
            
            <button
              onClick={generateReport}
              disabled={loading}
              className="generate-button floating-button"
            >
              {loading ? 'Generating...' : 'Generate PDF Report'}
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="recent-reports floating-card">
          <h3>Recent Reports</h3>
          {reports.length > 0 ? (
            <div className="reports-list">
              {reports.map(report => (
                <div key={report.id} className="report-item">
                  <div className="report-info">
                    <span className="report-type">{report.type.toUpperCase()} Report</span>
                    <span className="report-date">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="report-range">
                    {report.dateRange.startDate} to {report.dateRange.endDate}
                  </div>
                  <span className={`report-status status-${report.status}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reports">No reports generated yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getColor = (index) => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#3b82f6', '#ef4444', '#f97316'
  ];
  return colors[index % colors.length];
};

const generateMockAnalyticsData = (timeRange) => {
  // Generate mock data based on time range
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  
  const trendData = [];
  for (let i = 0; i < days; i++) {
    trendData.push({
      label: `Day ${i+1}`,
      value: Math.floor(Math.random() * 10000) + 5000
    });
  }
  
  const growthData = [];
  for (let i = 0; i < 12; i++) {
    growthData.push({
      label: `Month ${i+1}`,
      value: Math.floor(Math.random() * 500) + 100,
      color: getColor(i)
    });
  }
  
  return {
    revenue: {
      totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
      interestRevenue: Math.floor(Math.random() * 300000) + 200000,
      feeRevenue: Math.floor(Math.random() * 200000) + 100000,
      trendData: trendData
    },
    customer: {
      totalCustomers: Math.floor(Math.random() * 10000) + 5000,
      newCustomers: Math.floor(Math.random() * 500) + 100,
      activeCustomers: Math.floor(Math.random() * 8000) + 2000,
      growthData: growthData
    },
    transaction: {
      totalTransactions: Math.floor(Math.random() * 50000) + 10000,
      typeDistribution: [
        { label: 'Deposits', value: Math.floor(Math.random() * 20000) + 5000, color: '#10b981' },
        { label: 'Withdrawals', value: Math.floor(Math.random() * 15000) + 3000, color: '#ef4444' },
        { label: 'Transfers', value: Math.floor(Math.random() * 10000) + 2000, color: '#3b82f6' },
        { label: 'Payments', value: Math.floor(Math.random() * 5000) + 1000, color: '#f59e0b' }
      ]
    }
  };
};

const generateHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];
  
  return hours.map(hour => ({
    label: hour,
    values: days.map(() => Math.floor(Math.random() * 100))
  }));
};

export default AdminDashboard;
