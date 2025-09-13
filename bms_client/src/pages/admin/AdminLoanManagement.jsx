// src/pages/admin/AdminLoanManagement.jsx
import React, { useState, useEffect } from 'react';
import { loanAPI } from '../../api/loan';
import { useAuth } from '../../hooks/useAuth';
import {
  Table,
  Tag,
  Card,
  Tabs,
  Button,
  Modal,
  Input,
  message,
  Spin,
  Statistic,
  Progress,
  Row,
  Col,
  Tooltip,
  Badge,
  Avatar
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EyeOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useSpring, animated, config } from "@react-spring/web";

import './AdminLoanManagement.css'; // Custom CSS file

const { TabPane } = Tabs;
const { TextArea } = Input;

// Animated components
const AnimatedCard = animated(Card);
const AnimatedStatistic = animated(Statistic);

const AdminLoanManagement = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, disbursed: 0 });

  // Animation springs
  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.molasses
  });

  const cardSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 200,
    config: config.gentle
  });

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingLoans();
    } else {
      fetchApprovedLoans();
    }
    
    // Fetch stats
    fetchLoanStats();
  }, [activeTab]);

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);
      const response = await loanAPI.getPendingLoans();
      setLoans(response.data);
      setStats(prev => ({ ...prev, pending: response.data.length }));
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch pending loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedLoans = async () => {
    try {
      setLoading(true);
      const response = await loanAPI.getApprovedLoans();
      setLoans(response.data);
      setStats(prev => ({ ...prev, approved: response.data.length }));
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch approved loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanStats = async () => {
    try {
      // In a real app, you'd have an API endpoint for stats
      const pendingResponse = await loanAPI.getPendingLoans();
      const approvedResponse = await loanAPI.getApprovedLoans();
      
      setStats({
        pending: pendingResponse.data.length,
        approved: approvedResponse.data.length,
        disbursed: Math.floor(Math.random() * 20) // Mock data for demonstration
      });
    } catch (err) {
      console.error('Failed to fetch loan stats', err);
    }
  };

  const handleApproveLoan = async (loanId) => {
    try {
      setLoading(true);
      await loanAPI.approveLoan(loanId);
      message.success('Loan approved successfully');
      fetchPendingLoans();
      fetchLoanStats();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to approve loan');
    } finally {
      setLoading(false);
    }
  };

  const showRejectModal = (loan) => {
    setSelectedLoan(loan);
    setRejectModalVisible(true);
  };

  const handleRejectLoan = async () => {
    if (!rejectReason || rejectReason.trim() === '') {
      message.error('Please provide a rejection reason');
      return;
    }

    try {
      setLoading(true);
      await loanAPI.rejectLoan(selectedLoan.id, { reason: rejectReason });
      message.success('Loan rejected successfully');
      setRejectModalVisible(false);
      setRejectReason('');
      fetchPendingLoans();
      fetchLoanStats();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to reject loan');
    } finally {
      setLoading(false);
    }
  };

  const handleDisburseLoan = async (loanId) => {
    try {
      setLoading(true);
      await loanAPI.disburseLoan(loanId);
      message.success('Loan disbursed successfully');
      fetchApprovedLoans();
      fetchLoanStats();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to disburse loan');
    } finally {
      setLoading(false);
    }
  };

  const getLoanTypeColor = (type) => {
    const colors = {
      PERSONAL_LOAN: 'purple',
      HOME_LOAN: 'cyan',
      CAR_LOAN: 'green',
      EDUCATION_LOAN: 'orange',
      BUSINESS_LOAN: 'red',
      MEDICAL_LOAN: 'pink',
      DEBT_CONSOLIDATION: 'blue'
    };
    return colors[type] || 'default';
  };

  const getLoanTypeText = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const viewLoanDetails = (loan) => {
    Modal.info({
      title: 'Loan Application Details',
      width: 800,
      content: (
        <div className="loan-details-modal">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="section-title">Basic Information</h3>
              <p><span className="label">Account Number:</span> <span className="value">{loan.loanAccountNumber}</span></p>
              <p><span className="label">Applicant:</span> <span className="value">{loan.user?.name} ({loan.user?.email})</span></p>
              <p><span className="label">Loan Type:</span> <Tag color={getLoanTypeColor(loan.loanType)}>{getLoanTypeText(loan.loanType)}</Tag></p>
            </div>
            <div>
              <h3 className="section-title">Financial Details</h3>
              <p><span className="label">Amount:</span> <span className="amount-value">₹{loan.loanAmount.toLocaleString('en-IN')}</span></p>
              <p><span className="label">Interest Rate:</span> <span className="value">{loan.interestRate}%</span></p>
              <p><span className="label">Tenure:</span> <span className="value">{loan.tenureMonths} months</span></p>
            </div>
          </div>
          <div className="timeline-section">
            <h3 className="section-title">Application Timeline</h3>
            <p><span className="label">Applied On:</span> <span className="value">{new Date(loan.createdAt).toLocaleString()}</span></p>
            {loan.updatedAt !== loan.createdAt && (
              <p><span className="label">Last Updated:</span> <span className="value">{new Date(loan.updatedAt).toLocaleString()}</span></p>
            )}
          </div>
        </div>
      ),
      okText: 'Close',
      okButtonProps: { className: 'modal-ok-btn' },
      bodyStyle: { backgroundColor: '#1f2937' },
      maskStyle: { backdropFilter: 'blur(5px)' }
    });
  };

  const columns = {
    pending: [
      {
        title: 'Applicant',
        dataIndex: 'user',
        key: 'user',
        render: (user, record) => (
          <div className="applicant-info">
            <Avatar 
              src={user?.avatar} 
              icon={<UserOutlined />} 
              className="applicant-avatar"
            />
            <div className="applicant-details">
              <div className="applicant-name">{user?.name || 'Unknown User'}</div>
              <div className="applicant-email">{user?.email}</div>
              <div className="account-number">{record.loanAccountNumber}</div>
            </div>
          </div>
        )
      },
      {
        title: 'Type',
        dataIndex: 'loanType',
        key: 'loanType',
        render: (type) => (
          <Tag color={getLoanTypeColor(type)} className="loan-type-tag">
            {getLoanTypeText(type)}
          </Tag>
        )
      },
      {
        title: 'Amount',
        dataIndex: 'loanAmount',
        key: 'loanAmount',
        render: (amount) => (
          <span className="loan-amount">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        )
      },
      {
        title: 'Tenure',
        dataIndex: 'tenureMonths',
        key: 'tenureMonths',
        render: (tenure) => (
          <div className="tenure-display">
            <div className="tenure-value">{tenure}</div>
            <div className="tenure-label">months</div>
          </div>
        )
      },
      {
        title: 'Interest',
        dataIndex: 'interestRate',
        key: 'interestRate',
        render: (rate) => (
          <div className="interest-display">
            <div className="interest-value">{rate}%</div>
            <Progress 
              percent={rate} 
              showInfo={false} 
              size="small" 
              strokeColor={{
                '0%': '#10b981',
                '100%': '#3b82f6',
              }}
            />
          </div>
        )
      },
      {
        title: 'Applied On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => (
          <div className="date-display">
            {new Date(date).toLocaleDateString()}
            <div className="time-display">{new Date(date).toLocaleTimeString()}</div>
          </div>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="action-buttons">
            <Tooltip title="View Details">
              <Button 
                icon={<EyeOutlined />} 
                onClick={() => viewLoanDetails(record)}
                className="view-btn"
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="Approve Loan">
              <Button 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleApproveLoan(record.id)}
                className="approve-btn"
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="Reject Loan">
              <Button 
                icon={<CloseCircleOutlined />} 
                onClick={() => showRejectModal(record)}
                className="reject-btn"
                shape="circle"
                danger
              />
            </Tooltip>
          </div>
        )
      }
    ],
    approved: [
      {
        title: 'Applicant',
        dataIndex: 'user',
        key: 'user',
        render: (user, record) => (
          <div className="applicant-info">
            <Avatar 
              src={user?.avatar} 
              icon={<UserOutlined />} 
              className="applicant-avatar"
            />
            <div className="applicant-details">
              <div className="applicant-name">{user?.name || 'Unknown User'}</div>
              <div className="applicant-email">{user?.email}</div>
              <div className="account-number">{record.loanAccountNumber}</div>
            </div>
          </div>
        )
      },
      {
        title: 'Type',
        dataIndex: 'loanType',
        key: 'loanType',
        render: (type) => (
          <Tag color={getLoanTypeColor(type)} className="loan-type-tag">
            {getLoanTypeText(type)}
          </Tag>
        )
      },
      {
        title: 'Amount',
        dataIndex: 'loanAmount',
        key: 'loanAmount',
        render: (amount) => (
          <span className="loan-amount">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        )
      },
      {
        title: 'Tenure',
        dataIndex: 'tenureMonths',
        key: 'tenureMonths',
        render: (tenure) => (
          <div className="tenure-display">
            <div className="tenure-value">{tenure}</div>
            <div className="tenure-label">months</div>
          </div>
        )
      },
      {
        title: 'Interest',
        dataIndex: 'interestRate',
        key: 'interestRate',
        render: (rate) => (
          <div className="interest-display">
            <div className="interest-value">{rate}%</div>
            <Progress 
              percent={rate} 
              showInfo={false} 
              size="small" 
              strokeColor={{
                '0%': '#10b981',
                '100%': '#3b82f6',
              }}
            />
          </div>
        )
      },
      {
        title: 'Approved On',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (date) => (
          <div className="date-display">
            {new Date(date).toLocaleDateString()}
            <div className="time-display">{new Date(date).toLocaleTimeString()}</div>
          </div>
        )
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Tooltip title="Disburse Loan Amount">
            <Button
              type="primary"
              icon={<DollarCircleOutlined />}
              onClick={() => handleDisburseLoan(record.id)}
              className="disburse-btn"
              size="large"
            >
              Disburse
            </Button>
          </Tooltip>
        )
      }
    ]
  };

  return (
    <div className="admin-loan-management">
      {/* Animated background elements */}
      <div className="animated-background">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              width: Math.random() * 200 + 50 + 'px',
              height: Math.random() * 200 + 50 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              background: `linear-gradient(45deg, 
                hsl(${Math.random() * 360}, 70%, 60%), 
                hsl(${Math.random() * 360}, 70%, 60%))`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="content-wrapper">
        <animated.div style={headerSpring}>
          <div className="header-section">
            <div>
              <h1 className="page-title">
                Loan Management Dashboard
              </h1>
              <p className="page-subtitle">Manage and monitor all loan applications</p>
            </div>
            <Badge count={stats.pending + stats.approved} showZero={false} offset={[-10, 10]} size="small">
              <Avatar 
                size="large" 
                src={user?.avatar} 
                icon={<UserOutlined />}
                className="user-avatar"
              />
            </Badge>
          </div>
        </animated.div>

        {/* Stats Overview */}
        <Row gutter={16} className="stats-row">
          <Col span={8}>
            <AnimatedCard 
              style={cardSpring}
              className="stat-card pending-card"
              bodyStyle={{ padding: '16px' }}
            >
              <Statistic
                title={<span className="stat-title">Pending Loans</span>}
                value={stats.pending}
                valueStyle={{ color: '#93c5fd' }}
                prefix={<SyncOutlined spin={loading && activeTab === 'pending'} />}
                suffix={<span className="stat-suffix">applications</span>}
              />
              <Progress 
                percent={(stats.pending / (stats.pending + stats.approved + stats.disbursed || 1)) * 100} 
                showInfo={false} 
                strokeColor="#93c5fd"
                trailColor="#1e3a8a"
                size="small"
              />
            </AnimatedCard>
          </Col>
          <Col span={8}>
            <AnimatedCard 
              style={cardSpring}
              className="stat-card approved-card"
              bodyStyle={{ padding: '16px' }}
            >
              <Statistic
                title={<span className="stat-title">Approved Loans</span>}
                value={stats.approved}
                valueStyle={{ color: '#d8b4fe' }}
                prefix={<CheckCircleOutlined />}
                suffix={<span className="stat-suffix">ready for disbursement</span>}
              />
              <Progress 
                percent={(stats.approved / (stats.pending + stats.approved + stats.disbursed || 1)) * 100} 
                showInfo={false} 
                strokeColor="#d8b4fe"
                trailColor="#4c1d95"
                size="small"
              />
            </AnimatedCard>
          </Col>
          <Col span={8}>
            <AnimatedCard 
              style={cardSpring}
              className="stat-card disbursed-card"
              bodyStyle={{ padding: '16px' }}
            >
              <Statistic
                title={<span className="stat-title">Disbursed Loans</span>}
                value={stats.disbursed}
                valueStyle={{ color: '#86efac' }}
                prefix={<DollarCircleOutlined />}
                suffix={<span className="stat-suffix">this month</span>}
              />
              <Progress 
                percent={(stats.disbursed / (stats.pending + stats.approved + stats.disbursed || 1)) * 100} 
                showInfo={false} 
                strokeColor="#86efac"
                trailColor="#065f46"
                size="small"
              />
            </AnimatedCard>
          </Col>
        </Row>

        <AnimatedCard 
          style={cardSpring}
          className="main-content-card"
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="loan-tabs"
            tabBarStyle={{ margin: 0 }}
            renderTabBar={(props, DefaultTabBar) => (
              <div className="tabs-header">
                <DefaultTabBar {...props} className="custom-tab-bar" />
              </div>
            )}
          >
            <TabPane
              tab={
                <span className="tab-label">
                  <SyncOutlined spin={loading && activeTab === 'pending'} className="tab-icon" />
                  Pending Loans
                  {stats.pending > 0 && <Badge count={stats.pending} className="tab-badge" />}
                </span>
              }
              key="pending"
            >
              <div className="tab-content">
                {loading ? (
                  <div className="loading-state">
                    <Spin size="large" indicator={<SyncOutlined spin className="spinner" />} />
                    <p className="loading-text">Loading pending loans...</p>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="empty-state">
                    <FileTextOutlined className="empty-icon" />
                    <h3 className="empty-title">No Pending Loans</h3>
                    <p className="empty-description">There are no pending loan applications at this time.</p>
                  </div>
                ) : (
                  <Table
                    dataSource={loans}
                    columns={columns.pending}
                    rowKey="id"
                    pagination={{ 
                      pageSize: 8, 
                      className: "table-pagination",
                      itemRender: (_, type, originalElement) => {
                        if (type === 'prev' || type === 'next') {
                          return <Button className="pagination-btn">{originalElement}</Button>;
                        }
                        return originalElement;
                      }
                    }}
                    className="loans-table"
                    rowClassName={() => 'table-row'}
                  />
                )}
              </div>
            </TabPane>
            <TabPane
              tab={
                <span className="tab-label">
                  <CheckCircleOutlined className="tab-icon" />
                  Approved Loans
                  {stats.approved > 0 && <Badge count={stats.approved} className="tab-badge" />}
                </span>
              }
              key="approved"
            >
              <div className="tab-content">
                {loading ? (
                  <div className="loading-state">
                    <Spin size="large" className="spinner" />
                    <p className="loading-text">Loading approved loans...</p>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="empty-state">
                    <BarChartOutlined className="empty-icon" />
                    <h3 className="empty-title">No Approved Loans</h3>
                    <p className="empty-description">There are no approved loans ready for disbursement.</p>
                  </div>
                ) : (
                  <Table
                    dataSource={loans}
                    columns={columns.approved}
                    rowKey="id"
                    pagination={{ 
                      pageSize: 8, 
                      className: "table-pagination",
                      itemRender: (_, type, originalElement) => {
                        if (type === 'prev' || type === 'next') {
                          return <Button className="pagination-btn">{originalElement}</Button>;
                        }
                        return originalElement;
                      }
                    }}
                    className="loans-table"
                    rowClassName={() => 'table-row'}
                  />
                )}
              </div>
            </TabPane>
          </Tabs>
        </AnimatedCard>

        <Modal
          title={<span className="modal-title"><CloseCircleOutlined className="modal-title-icon" /> Reject Loan Application</span>}
          visible={rejectModalVisible}
          onOk={handleRejectLoan}
          onCancel={() => {
            setRejectModalVisible(false);
            setRejectReason('');
          }}
          okText="Reject Loan"
          cancelText="Cancel"
          okButtonProps={{ 
            danger: true, 
            icon: <CloseCircleOutlined />,
            className: "reject-modal-ok-btn"
          }}
          cancelButtonProps={{
            className: "reject-modal-cancel-btn"
          }}
          className="reject-modal"
          bodyStyle={{ backgroundColor: '#1f2937', borderRadius: '8px' }}
          headerStyle={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}
          footerStyle={{ backgroundColor: '#1f2937', borderTop: '1px solid #374151' }}
          maskStyle={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="reject-modal-content">
            <p className="reject-modal-text">
              Please provide a reason for rejecting the loan application for{' '}
              <span className="loan-account-number">
                {selectedLoan?.loanAccountNumber}
              </span>
              .
            </p>
            <TextArea
              rows={4}
              placeholder="Enter detailed rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="reject-textarea"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminLoanManagement;