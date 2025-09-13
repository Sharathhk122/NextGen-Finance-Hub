// src/pages/admin/Transactions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../../api/admin';
import { Card, Table, Tag, Button, DatePicker, Select, Spin, Alert, Space, Input, Modal, Statistic, Row, Col } from 'antd';
import { 
  DownloadOutlined, 
  FilterOutlined, 
  ReloadOutlined,
  EyeOutlined,
  SearchOutlined,
  BarChartOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { useSpring, animated, config } from '@react-spring/web';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text } from 'troika-three-text';
import moment from 'moment';

// Extend THREE with Text
extend({ Text });

// 3D Floating Text Component
const FloatingText = ({ text, position, color = '#3b82f6', fontSize = 0.5 }) => {
  const textRef = useRef();
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      maxWidth={10}
    >
      {text}
    </text>
  );
};

// 3D Particle System with Gradient Colors
const ParticleSystem = () => {
  const particlesRef = useRef();
  const particlesMatRef = useRef();
  const particlesPosition = useRef([]);
  const particlesVelocity = useRef([]);
  const particlesColor = useRef([]);
  
  useEffect(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Cement-like dark colors with blue accents
    const colorPalette = [
      new THREE.Color(0.2, 0.2, 0.25), // Dark gray
      new THREE.Color(0.15, 0.15, 0.2), // Darker gray
      new THREE.Color(0.1, 0.1, 0.15),  // Almost black
      new THREE.Color(0.23, 0.35, 0.5), // Blue-gray
      new THREE.Color(0.15, 0.3, 0.45), // Dark blue
    ];
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    particlesPosition.current = positions;
    particlesVelocity.current = velocities;
    particlesColor.current = colors;
    
    if (particlesRef.current) {
      particlesRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPosition.current, 3)
      );
      particlesRef.current.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(particlesColor.current, 3)
      );
    }
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const velocities = particlesVelocity.current;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Update positions with velocities
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Boundary check with soft wrapping
        if (Math.abs(positions[i]) > 15) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 15) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 15) velocities[i + 2] *= -1;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} scale={1}>
      <bufferGeometry />
      <pointsMaterial 
        ref={particlesMatRef}
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// 3D Background Component with floating elements
const ThreeDBackground = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
      <ParticleSystem />
      <FloatingText text="TRANSACTIONS" position={[0, 3, 0]} color="#3b82f6" fontSize={0.8} />
      <FloatingText text="MONITORING" position={[0, 2, 0]} color="#60a5fa" fontSize={0.7} />
      <FloatingText text="ADMIN" position={[0, 1, 0]} color="#93c5fd" fontSize={0.6} />
    </Canvas>
  );
};

// Animated Number Component
const AnimatedNumber = ({ value, format = null, delay = 0, className = "" }) => {
  const props = useSpring({
    from: { number: 0 },
    to: { number: value },
    delay: delay,
    config: config.molasses
  });

  return (
    <animated.div className={className}>
      {props.number.to(n => format ? format(n) : Math.floor(n))}
    </animated.div>
  );
};

// Animated Text Component with Typewriter effect
const AnimatedText = ({ text, delay = 0, className = "", typewriter = false }) => {
  const [displayText, setDisplayText] = useState(typewriter ? "" : text);
  
  useEffect(() => {
    if (typewriter) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [text, typewriter]);

  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: delay,
    config: config.molasses
  });

  return (
    <animated.div style={props} className={className}>
      {displayText}
    </animated.div>
  );
};

// Main Component
const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    status: ''
  });
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateStats();
    }
  }, [transactions]);

  const calculateStats = () => {
    const completed = transactions.filter(t => t.status === 'COMPLETED').length;
    const pending = transactions.filter(t => t.status === 'PENDING').length;
    const failed = transactions.filter(t => t.status === 'FAILED').length;
    
    setStats({
      total: transactions.length,
      completed,
      pending,
      failed
    });
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllTransactions({ 
        page: 0, 
        size: 50,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status })
      });
      
      const transactionsData = response.data.content || response.data || [];
      setTransactions(transactionsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      status: ''
    });
    setSearchText('');
    fetchTransactions();
  };

  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <span className="text-blue-300 font-mono">#{id}</span>,
    },
    {
      title: 'Account',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (_, record) => (
        <span className="text-blue-300">
          {record.accountNumber || record.account?.accountNumber || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag 
          color={
            type === 'DEPOSIT' ? 'green' : 
            type === 'WITHDRAWAL' ? 'red' : 
            type === 'TRANSFER' ? 'blue' : 'purple'
          }
          className="px-2 py-1 rounded-full font-semibold"
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-mono font-bold text-lg text-yellow-400">
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      render: (ref) => <span className="text-blue-300 font-mono">{ref || 'N/A'}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <span className="text-blue-200">{desc || 'N/A'}</span>,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={
            status === 'COMPLETED' ? 'green' : 
            status === 'PENDING' ? 'orange' : 'red'
          }
          className="rounded-full px-2 py-1 font-semibold"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'date',
      render: (date, record) => (
        <span className="text-blue-200">
          {moment(date || record.createdAt).format('DD MMM YYYY, hh:mm A')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          className="text-blue-400 hover:text-blue-300"
          onClick={() => showTransactionDetails(record)}
        />
      ),
    },
  ];

  const filteredTransactions = transactions.filter(transaction => 
    transaction.id.toString().includes(searchText) ||
    (transaction.accountNumber || '').includes(searchText) ||
    (transaction.referenceNumber || '').includes(searchText) ||
    (transaction.description || '').toLowerCase().includes(searchText.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" className="text-blue-500" />
          <p className="mt-4 text-blue-300 text-lg">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-950 text-blue-100 relative overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <ThreeDBackground />
      </div>

      <div className="relative z-10 px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8 text-center">
          <AnimatedText 
            text="Transaction Monitoring Dashboard" 
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-2"
            delay={100}
            typewriter={true}
          />
          <AnimatedText 
            text="Real-time monitoring of all financial transactions" 
            className="text-lg text-blue-300 mt-2"
            delay={800}
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-xl overflow-hidden">
            <Statistic
              title="Total Transactions"
              value={stats.total}
              prefix={<TransactionOutlined className="text-blue-400" />}
              valueStyle={{ color: '#93c5fd' }}
              className="p-4"
            />
          </Card>
          <Card className="bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-xl overflow-hidden">
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#86efac' }}
              className="p-4"
            />
          </Card>
          <Card className="bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-xl overflow-hidden">
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#fdba74' }}
              className="p-4"
            />
          </Card>
          <Card className="bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-xl overflow-hidden">
            <Statistic
              title="Failed"
              value={stats.failed}
              valueStyle={{ color: '#fca5a5' }}
              className="p-4"
            />
          </Card>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            closable
            onClose={() => setError('')}
            className="mb-6 rounded-lg border-red-800 bg-red-900/50 text-red-200 backdrop-blur-md"
          />
        )}

        {/* Filters Card */}
        <Card 
          className="mb-6 bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-xl"
          title={
            <div className="flex items-center text-blue-300">
              <FilterOutlined className="mr-2" />
              <span>Filters & Search</span>
            </div>
          }
          extra={
            <Button 
              icon={<ReloadOutlined />} 
              onClick={clearFilters}
              className="text-blue-300 border-blue-600 hover:bg-blue-700/50"
            >
              Reset
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-blue-300 mb-2">Start Date</label>
              <DatePicker
                className="w-full bg-blue-800 border-blue-600 text-blue-100 rounded-lg"
                onChange={(date, dateString) => handleFilterChange('startDate', dateString)}
                value={filters.startDate ? moment(filters.startDate) : null}
              />
            </div>
            <div>
              <label className="block text-blue-300 mb-2">End Date</label>
              <DatePicker
                className="w-full bg-blue-800 border-blue-600 text-blue-100 rounded-lg"
                onChange={(date, dateString) => handleFilterChange('endDate', dateString)}
                value={filters.endDate ? moment(filters.endDate) : null}
              />
            </div>
            <div>
              <label className="block text-blue-300 mb-2">Type</label>
              <Select
                className="w-full bg-blue-800 text-blue-100 rounded-lg"
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'DEPOSIT', label: 'Deposit' },
                  { value: 'WITHDRAWAL', label: 'Withdrawal' },
                  { value: 'TRANSFER', label: 'Transfer' },
                  { value: 'LOAN', label: 'Loan' },
                ]}
              />
            </div>
            <div>
              <label className="block text-blue-300 mb-2">Status</label>
              <Select
                className="w-full bg-blue-800 text-blue-100 rounded-lg"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'FAILED', label: 'Failed' },
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Input
              prefix={<SearchOutlined className="text-blue-400" />}
              placeholder="Search by ID, account, reference, or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full md:w-1/2 bg-blue-800 border-blue-600 text-blue-100 placeholder-blue-400 rounded-lg"
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={applyFilters}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 rounded-lg"
            >
              Apply Filters
            </Button>
          </div>
        </Card>

        {/* Transactions Table Card */}
        <Card
          className="flex-1 bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-xl shadow-xl flex flex-col"
          bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: 0 }}
          title={
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
              <span className="text-blue-300 text-lg font-semibold">
                <BarChartOutlined className="mr-2" />
                Transaction Records
              </span>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <Button 
                  icon={<DownloadOutlined />}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 rounded-lg"
                >
                  Export CSV
                </Button>
                <Button 
                  icon={<DownloadOutlined />}
                  className="bg-gradient-to-r from-blue-700 to-blue-600 border-0 rounded-lg"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          }
        >
          <div className="p-4 border-b border-blue-700">
            <span className="text-blue-300">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table
              columns={columns}
              dataSource={filteredTransactions}
              rowSelection={rowSelection}
              rowKey="id"
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                className: "px-4 py-2"
              }}
              scroll={{ x: 'max-content' }}
              className="custom-table"
              loading={loading}
              locale={{
                emptyText: (
                  <div className="text-center py-16 text-blue-300">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-xl mb-2">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </div>
                )
              }}
            />
          </div>
        </Card>
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        title="Transaction Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
        className="transaction-modal"
      >
        {selectedTransaction && (
          <div className="space-y-4 mt-4">
            <Row gutter={16}>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Transaction ID</div>
                  <div className="font-semibold text-blue-900">#{selectedTransaction.id}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Reference Number</div>
                  <div className="font-semibold text-blue-900">{selectedTransaction.referenceNumber || 'N/A'}</div>
                </div>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Account Number</div>
                  <div className="font-semibold text-blue-900">{selectedTransaction.accountNumber || 'N/A'}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Type</div>
                  <div>
                    <Tag color={
                      selectedTransaction.type === 'DEPOSIT' ? 'green' : 
                      selectedTransaction.type === 'WITHDRAWAL' ? 'red' : 'blue'
                    }>
                      {selectedTransaction.type}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Amount</div>
                  <div className="font-semibold text-lg text-green-700">
                    {formatCurrency(selectedTransaction.amount)}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Status</div>
                  <div>
                    <Tag color={
                      selectedTransaction.status === 'COMPLETED' ? 'green' : 
                      selectedTransaction.status === 'PENDING' ? 'orange' : 'red'
                    }>
                      {selectedTransaction.status}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
            
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-700 text-sm">Description</div>
              <div className="font-semibold text-blue-900">{selectedTransaction.description || 'No description'}</div>
            </div>
            
            <Row gutter={16}>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Transaction Date</div>
                  <div className="font-semibold text-blue-900">
                    {moment(selectedTransaction.transactionDate || selectedTransaction.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-700 text-sm">Initiated By</div>
                  <div className="font-semibold text-blue-900">User #{selectedTransaction.userId || 'N/A'}</div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .custom-table :global(.ant-table) {
          background: transparent !important;
          color: #51bd0aff;
        }
        .custom-table :global(.ant-table-thead > tr > th) {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(30, 64, 175, 0.95)) !important;
          color: #BFDBFE !important;
          border-bottom: 2px solid #1e40af;
          font-weight: 600;
        }
        .custom-table :global(.ant-table-tbody > tr > td) {
          border-bottom: 1px solid #1e40af;
          background: rgba(30, 58, 138, 0.7) !important;
          color: #1c5fb1ff;
        }
        .custom-table :global(.ant-table-tbody > tr:hover > td) {
          background: rgba(30, 64, 175, 0.8) !important;
        }
        .custom-table :global(.ant-pagination-item) {
          background: rgba(30, 58, 138, 0.7);
          border-color: #3B82F6;
        }
        .custom-table :global(.ant-pagination-item a) {
          color: #BFDBFE;
        }
        .custom-table :global(.ant-pagination-item-active) {
          background: #3B82F6;
          border-color: #3B82F6;
        }
        .custom-table :global(.ant-pagination-item-active a) {
          color: #1E40AF;
        }
        .custom-table :global(.ant-select-selector) {
          background: rgba(30, 58, 138, 0.7) !important;
          color: #BFDBFE !important;
          border-color: #3B82F6 !important;
        }
        .transaction-modal :global(.ant-modal-content) {
          background: #E0F2FE;
          border-radius: 12px;
        }
        .transaction-modal :global(.ant-modal-header) {
          background: #E0F2FE;
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #BFDBFE;
        }
      `}</style>
    </div>
  );
};

export default TransactionMonitoring;