// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Input, 
  Card, 
  Space, 
  Spin, 
  Alert,
  Pagination,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  ReloadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { adminAPI } from '../../api/admin';
import './UserManagement.css';

const { Title, Text } = Typography;
const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [searchText, setSearchText] = useState('');
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetchUsers();
    
    // 3D mouse move effect
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      containerRef.current.style.transform = `
        perspective(1000px)
        rotateX(${y * -5}deg)
        rotateY(${x * 5}deg)
        translateZ(0)
      `;

      // 3D effect for cards
      cardRefs.current.forEach(card => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardX = (e.clientX - cardRect.left) / cardRect.width - 0.5;
          const cardY = (e.clientY - cardRect.top) / cardRect.height - 0.5;
          
          card.style.transform = `
            perspective(1000px)
            rotateX(${cardY * -3}deg)
            rotateY(${cardX * 3}deg)
            translateZ(10px)
          `;
          
          // Add glow effect
          card.style.boxShadow = `
            ${cardX * 20}px ${cardY * 20}px 30px rgba(0, 0, 0, 0.3),
            inset 0 0 20px rgba(100, 100, 255, 0.1)
          `;
        }
      });
    };
    
    const handleMouseLeave = () => {
      if (containerRef.current) {
        containerRef.current.style.transform = '';
      }
      
      cardRefs.current.forEach(card => {
        if (card) {
          card.style.transform = '';
          card.style.boxShadow = '';
        }
      });
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers({
        page: currentPage - 1,
        size: 10,
        search: searchText
      });
      
      let usersData = [];
      let totalPagesData = 0;
      
      if (response.data && response.data.content) {
        usersData = response.data.content;
        totalPagesData = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
        totalPagesData = 1;
      } else {
        usersData = [];
        totalPagesData = 1;
      }
      
      setUsers(usersData);
      setTotalPages(totalPagesData);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. Please check your admin privileges.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, status, reason = '') => {
    try {
      await adminAPI.updateUserStatus(userId, {
        status,
        reason
      });
      setIsModalVisible(false);
      setSelectedUser(null);
      setSuspensionReason('');
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user:', err);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchUsers();
  };

  const showSuspendModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    setSuspensionReason('');
  };

  const handleModalOk = () => {
    if (selectedUser) {
      handleStatusUpdate(selectedUser.id, 'SUSPENDED', suspensionReason);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'SUSPENDED': return 'red';
      case 'PENDING_VERIFICATION': return 'gold';
      case 'INACTIVE': return 'gray';
      default: return 'blue';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircleOutlined />;
      case 'SUSPENDED': return <CloseCircleOutlined />;
      case 'PENDING_VERIFICATION': return <ExclamationCircleOutlined />;
      default: return <ExclamationCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'USER',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge 
            count={getStatusIcon(record.status)} 
            offset={[-5, 30]}
            style={{ backgroundColor: getStatusColor(record.status) }}
          >
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              src={record.avatar}
              style={{ 
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                boxShadow: '0 0 15px rgba(100, 100, 255, 0.3)'
              }}
            />
          </Badge>
          <div style={{ marginLeft: 12 }}>
            <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
              {record.fullName || `${record.firstName} ${record.lastName}` || record.email}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'CONTACT',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
          <PhoneOutlined style={{ marginRight: 8, color: '#6366f1' }} />
          {phone || 'N/A'}
        </div>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)} 
          icon={getStatusIcon(status)}
          style={{ 
            padding: '4px 8px', 
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'ROLES',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <div>
          {Array.isArray(roles) ? roles.map((role, index) => (
            <Tag 
              key={index} 
              color="cyan" 
              style={{ 
                margin: '2px', 
                background: 'rgba(6, 182, 212, 0.15)', 
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '6px'
              }}
            >
              {role}
            </Tag>
          )) : 'N/A'}
        </div>
      ),
    },
    {
      title: 'CREATED',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
          <CalendarOutlined style={{ marginRight: 8, color: '#6366f1' }} />
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              style={{ color: '#60a5fa' }}
            />
          </Tooltip>
          
          <Tooltip title="Edit User">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              style={{ color: '#fbbf24' }}
            />
          </Tooltip>

          {record.status === 'PENDING_VERIFICATION' && (
            <Popconfirm
              title="Approve User"
              description="Are you sure you want to approve this user?"
              onConfirm={() => handleStatusUpdate(record.id, 'ACTIVE')}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { background: '#10b981', borderColor: '#10b981' } }}
            >
              <Tooltip title="Approve User">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />} 
                  style={{ color: '#10b981' }}
                />
              </Tooltip>
            </Popconfirm>
          )}
          
          {record.status === 'ACTIVE' && (
            <Tooltip title="Suspend User">
              <Button 
                type="text" 
                icon={<CloseCircleOutlined />} 
                onClick={() => showSuspendModal(record)}
                style={{ color: '#ef4444' }}
              />
            </Tooltip>
          )}
          
          {record.status === 'SUSPENDED' && (
            <Popconfirm
              title="Reactivate User"
              description="Are you sure you want to reactivate this user?"
              onConfirm={() => handleStatusUpdate(record.id, 'ACTIVE')}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { background: '#10b981', borderColor: '#10b981' } }}
            >
              <Tooltip title="Reactivate User">
                <Button 
                  type="text" 
                  icon={<RocketOutlined />} 
                  style={{ color: '#10b981' }}
                />
              </Tooltip>
            </Popconfirm>
          )}
          
          <Tooltip title="Delete User">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              style={{ color: '#f87171' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="admin-container">
        <div className="animated-background">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#10b981' : '#f59e0b',
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="loading-center">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-center">
              <Spin size="large" indicator={<RocketOutlined spin />} />
            </div>
          </div>
          <Title level={4} style={{ color: '#e2e8f0', marginTop: '20px' }}>
            LOADING USER DATA...
          </Title>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Animated background */}
      <div className="animated-background">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#10b981' : '#f59e0b',
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="admin-content" ref={containerRef}>
        <div className="admin-header">
          <div className="header-title">
            <Title 
              level={2} 
              style={{ 
                color: 'transparent',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                margin: 0
              }}
            >
              USER MANAGEMENT DASHBOARD
            </Title>
            <Text type="secondary" style={{ color: '#94a3b8' }}>
              Manage all system users with advanced controls
            </Text>
          </div>
          
          <div className="header-actions">
            <Search
              placeholder="Search users..."
              allowClear
              enterButton
              size="large"
              onSearch={handleSearch}
              style={{ width: 300, marginRight: 16 }}
              className="search-input"
            />
            
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              size="large"
              onClick={fetchUsers}
              className="refresh-button"
            >
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24, borderRadius: 12 }}
            className="error-alert"
          />
        )}

        <Card 
          className="users-table-card"
          bodyStyle={{ padding: 0 }}
        >
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={users.map(user => ({ ...user, key: user.id }))}
              loading={loading}
              pagination={false}
              scroll={{ x: 1000 }}
              className="users-table"
            />
          </div>
        </Card>

        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={totalPages * 10}
            pageSize={10}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
            className="users-pagination"
          />
        </div>
      </div>

      {/* Suspension Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
            <span>Suspend User</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Confirm Suspend"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        className="suspension-modal"
      >
        {selectedUser && (
          <>
            <p style={{ color: '#94a3b8', marginBottom: 16 }}>
              You are about to suspend the following user:
            </p>
            
            <div style={{ 
              background: 'rgba(30, 41, 59, 0.5)', 
              padding: 16, 
              borderRadius: 8, 
              marginBottom: 16 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  src={selectedUser.avatar}
                  style={{ marginRight: 12 }}
                />
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                    {selectedUser.fullName || selectedUser.email}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {selectedUser.email}
                  </div>
                </div>
              </div>
            </div>
            
            <Input.TextArea
              placeholder="Enter reason for suspension"
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              rows={4}
              style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155', color: '#e2e8f0' }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;