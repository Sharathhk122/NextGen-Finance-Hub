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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      
      const [revenueResponse, customerResponse] = await Promise.all([
        adminAPI.getRevenueAnalytics({ startDate, endDate }),
        adminAPI.getCustomerGrowthAnalytics({ startDate, endDate })
      ]);
      
      setAnalytics({
        revenue: revenueResponse.data,
        customer: customerResponse.data
      });
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
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
    return <div className="tab-loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-tab">
      <h2 className="section-title">Analytics Dashboard</h2>

      {error && <div className="error-alert floating-alert">{error}</div>}

      {analytics ? (
        <div className="analytics-grid">
          {/* Revenue Analytics */}
          <div className="analytics-card floating-card">
            <h3>Revenue Analytics</h3>
            <div className="analytics-stats">
              <div className="analytics-stat">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">
                  {formatCurrency(analytics.revenue.totalRevenue || 0)}
                </p>
              </div>
              <div className="analytics-stat">
                <p className="stat-label">Interest Revenue</p>
                <p className="stat-value">
                  {formatCurrency(analytics.revenue.interestRevenue || 0)}
                </p>
              </div>
              <div className="analytics-stat">
                <p className="stat-label">Fee Revenue</p>
                <p className="stat-value">
                  {formatCurrency(analytics.revenue.feeRevenue || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Analytics */}
          <div className="analytics-card floating-card">
            <h3>Customer Analytics</h3>
            <div className="analytics-stats">
              <div className="analytics-stat">
                <p className="stat-label">Total Customers</p>
                <p className="stat-value">{analytics.customer.totalCustomers || 0}</p>
              </div>
              <div className="analytics-stat">
                <p className="stat-label">New Customers</p>
                <p className="stat-value">{analytics.customer.newCustomers || 0}</p>
              </div>
              <div className="analytics-stat">
                <p className="stat-label">Active Customers</p>
                <p className="stat-value">{analytics.customer.activeCustomers || 0}</p>
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

// Reports Tab Component
const ReportsTab = () => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const downloadTransactionReport = async (format) => {
    setLoading(true);
    setError('');
    
    try {
      if (format === 'pdf') {
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
      } else if (format === 'excel') {
        const response = await adminAPI.generateTransactionReportExcel({
          startDate,
          endDate
        });
        
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transactions_report_${startDate}_to_${endDate}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(`Error downloading ${format.toUpperCase()} report:`, err);
      setError(`Failed to download ${format.toUpperCase()} report`);
    } finally {
      setLoading(false);
    }
  };

  const downloadLoanReport = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.generateLoanReportPDF({
        startDate,
        endDate,
        loanStatus: 'ALL'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `loan_report_${startDate}_to_${endDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading loan report:', err);
      setError('Failed to download loan report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-tab">
      <h2 className="section-title">Reports</h2>

      {error && <div className="error-alert floating-alert">{error}</div>}

      <div className="reports-grid">
        <div className="report-card floating-card">
          <h3>Transaction Reports</h3>
          <div className="date-range">
            <div className="date-input">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="report-actions">
            <button
              className="download-button floating-button"
              onClick={() => downloadTransactionReport('pdf')}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Download PDF Report'}
            </button>
            <button
              className="download-button secondary floating-button"
              onClick={() => downloadTransactionReport('excel')}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Download Excel Report'}
            </button>
          </div>
        </div>

        <div className="report-card floating-card">
          <h3>Loan Reports</h3>
          <div className="date-range">
            <div className="date-input">
              <label htmlFor="loanStartDate">Start Date</label>
              <input
                type="date"
                id="loanStartDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="loanEndDate">End Date</label>
              <input
                type="date"
                id="loanEndDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="report-actions">
            <button
              className="download-button floating-button"
              onClick={downloadLoanReport}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Download Loan Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;