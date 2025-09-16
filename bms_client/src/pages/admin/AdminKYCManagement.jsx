// src/pages/admin/AdminKYCManagement.jsx
import React, { useState, useEffect } from 'react';
import { kycAPI } from '../../api/kyc';
import { Card, Button, Modal, Input, Tag, Table, Tabs, Alert, Spin, Empty, Typography, Progress, Statistic, Row, Col } from 'antd';
import { 
  EyeOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  ReloadOutlined, 
  SearchOutlined,
  UserOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  TeamOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useSpring, animated, config } from '@react-spring/web';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';

const { Title, Text: AntText } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Advanced 3D Background with particles and floating shapes - Dark version
const Advanced3DBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        <FloatingShapes count={25} />
        <ParticleField count={500} />
        <AnimatedText text="KYC VERIFICATION" position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

const FloatingShapes = ({ count }) => {
  const shapes = Array.from({ length: count }).map((_, i) => ({
    shape: Math.random() > 0.5 ? 'box' : 'sphere',
    position: [
      Math.random() * 40 - 20,
      Math.random() * 40 - 20,
      Math.random() * 20 - 10,
    ],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    color: i % 4 === 0 ? '#1e40af' : 
           i % 4 === 1 ? '#5b21b6' : 
           i % 4 === 2 ? '#047857' : '#b45309',
    scale: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.02 + 0.005,
  }));

  return shapes.map((props, i) => <FloatingShape key={i} {...props} />);
};

const FloatingShape = ({ shape, position, rotation, color, scale, speed }) => {
  const meshRef = React.useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.x += speed;
    meshRef.current.rotation.y += speed * 1.3;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time) * 0.8;
    meshRef.current.position.x = position[0] + Math.cos(time * 0.7) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {shape === 'box' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <sphereGeometry args={[0.7, 16, 16]} />
      )}
      <meshStandardMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
};

const ParticleField = ({ count }) => {
  const particles = Array.from({ length: count }).map((_, i) => ({
    position: [
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
    ],
    size: Math.random() * 0.3 + 0.1,
    color: Math.random() > 0.7 ? '#1e40af' : 
           Math.random() > 0.5 ? '#5b21b6' : 
           Math.random() > 0.3 ? '#047857' : '#b45309',
  }));

  return particles.map((props, i) => <Particle key={i} {...props} />);
};

const Particle = ({ position, size, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
};

const AnimatedText = ({ text, position }) => {
  return (
    <Text
      color="#6366f1"
      fontSize={2.5}
      maxWidth={20}
      textAlign="center"
      position={position}
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
    >
      {text}
      <meshStandardMaterial attach="material" color="#6366f1" />
    </Text>
  );
};

// Animated components with more advanced effects
const AnimatedCard = ({ children, delay = 0, className = "" }) => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(50px) scale(0.95)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    delay,
    config: config.wobbly,
  });

  return <animated.div style={props} className={className}>{children}</animated.div>;
};

const HoverScale = ({ children, className = "" }) => {
  const [hovered, setHovered] = useState(false);
  
  const props = useSpring({
    transform: hovered ? 'scale(1.03)' : 'scale(1)',
    boxShadow: hovered 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
      : '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
    config: config.gentle,
  });

  return (
    <animated.div 
      style={props}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
    >
      {children}
    </animated.div>
  );
};

// Typewriter effect component
const TypewriterText = ({ text, speed = 50, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span className={className}>{displayText}</span>;
};

const AdminKYCManagement = () => {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState('view');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchKYCSubmissions();
  }, [activeTab]);

  useEffect(() => {
    filterSubmissions();
    calculateStats();
  }, [kycSubmissions, activeTab, searchTerm]);

  const calculateStats = () => {
    const total = kycSubmissions.length;
    const pending = kycSubmissions.filter(sub => sub.status === 'PENDING').length;
    const approved = kycSubmissions.filter(sub => sub.status === 'APPROVED').length;
    const rejected = kycSubmissions.filter(sub => sub.status === 'REJECTED').length;
    
    setStats({ total, pending, approved, rejected });
  };

  const fetchKYCSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (activeTab === 'ALL') {
        response = await kycAPI.getAllKYCSubmissions();
      } else {
        response = await kycAPI.getKYCSubmissionsByStatus(activeTab);
      }
      
      if (!response.config) {
        setUsingMockData(true);
      }
      
      let submissionsData = [];
      
      if (Array.isArray(response.data)) {
        submissionsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        submissionsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.content)) {
        submissionsData = response.data.content;
      } else if (response.data && typeof response.data === 'object') {
        submissionsData = Object.values(response.data).filter(item => 
          item && typeof item === 'object' && item.id !== undefined
        );
      }
      
      setKycSubmissions(submissionsData);
    } catch (err) {
      console.error('Error fetching KYC submissions:', err);
      setError(err.response?.data?.message || 'Failed to fetch KYC submissions. Please check if the admin endpoints are available.');
      
      // Fallback to mock data for demo purposes
      const mockData = [
        {
          id: 1,
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          documentType: 'PASSPORT',
          documentNumber: 'A12345678',
          status: 'PENDING',
          submittedAt: '2023-05-15T10:30:00Z',
          documentFrontImageUrl: 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=Passport+Front',
          documentBackImageUrl: 'https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=Passport+Back',
          selfieImageUrl: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Selfie+With+Document'
        },
        {
          id: 2,
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          documentType: 'DRIVER_LICENSE',
          documentNumber: 'DL98765432',
          status: 'APPROVED',
          submittedAt: '2023-05-10T14:22:00Z',
          documentFrontImageUrl: 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=License+Front',
          selfieImageUrl: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Selfie+With+Document'
        },
        {
          id: 3,
          userName: 'Robert Johnson',
          userEmail: 'robert.j@example.com',
          documentType: 'ID_CARD',
          documentNumber: 'ID45678901',
          status: 'REJECTED',
          submittedAt: '2023-05-05T09:15:00Z',
          rejectionReason: 'Document expired',
          documentFrontImageUrl: 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=ID+Card+Front',
          documentBackImageUrl: 'https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=ID+Card+Back',
          selfieImageUrl: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Selfie+With+Document'
        }
      ];
      
      setKycSubmissions(mockData);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...kycSubmissions];
    
    if (activeTab !== 'ALL') {
      filtered = filtered.filter(sub => sub.status === activeTab);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub => 
        (sub.userName && sub.userName.toLowerCase().includes(term)) ||
        (sub.user?.firstName && sub.user.firstName.toLowerCase().includes(term)) ||
        (sub.user?.lastName && sub.user.lastName.toLowerCase().includes(term)) ||
        (sub.userEmail && sub.userEmail.toLowerCase().includes(term)) ||
        (sub.user?.email && sub.user.email.toLowerCase().includes(term)) ||
        (sub.documentNumber && sub.documentNumber.toLowerCase().includes(term)) ||
        (sub.documentType && sub.documentType.toLowerCase().includes(term))
      );
    }
    
    setFilteredSubmissions(filtered);
  };

  const handleApproveKYC = async (kycId) => {
    try {
      setLoading(true);
      setError('');
      
      await kycAPI.updateKYCStatus(kycId, {
        status: "APPROVED",
        rejectionReason: null
      });
      
      setSuccess('KYC approved successfully');
      fetchKYCSubmissions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error approving KYC:', err);
      setError(err.response?.data?.message || 'Failed to approve KYC');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectKYC = async (kycId) => {
    if (!rejectionReason || rejectionReason.trim() === '') {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await kycAPI.updateKYCStatus(kycId, {
        status: "REJECTED",
        rejectionReason: rejectionReason
      });
      
      setSuccess('KYC rejected successfully');
      setRejectionReason('');
      setShowModal(false);
      fetchKYCSubmissions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error rejecting KYC:', err);
      setError(err.response?.data?.message || 'Failed to reject KYC');
    } finally {
      setLoading(false);
    }
  };

  const viewDocuments = (kyc) => {
    setSelectedKYC(kyc);
    setModalMode('view');
    setShowModal(true);
  };

  const openRejectModal = (kyc) => {
    setSelectedKYC(kyc);
    setModalMode('reject');
    setRejectionReason('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedKYC(null);
    setRejectionReason('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'PENDING': return 'gold';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      case 'PENDING': return 'Pending';
      default: return status;
    }
  };

  const getDocumentTypeText = (type) => {
    if (!type) return 'N/A';
    return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderImage = (imageData, altText) => {
    if (!imageData) return <div className="text-gray-700 text-sm">No image available</div>;
    
    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:image')) {
        return <img src={imageData} alt={altText} className="w-full h-48 object-contain border border-gray-300 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" />;
      } else if (imageData.startsWith('http')) {
        return <img src={imageData} alt={altText} className="w-full h-48 object-contain border border-gray-300 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" />;
      } else {
        return <img src={`https://backend-hk.onrender.com${imageData}`} alt={altText} className="w-full h-48 object-contain border border-gray-300 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" />;
      }
    }
    
    return <div className="text-gray-700 text-sm">Invalid image format</div>;
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg transition-all duration-300 hover:scale-110">
            {record.userName ? record.userName.charAt(0).toUpperCase() : 
             record.user?.firstName ? record.user.firstName.charAt(0).toUpperCase() : 
             record.userEmail ? record.userEmail.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-800">
              {record.userName || `${record.user?.firstName || ''} ${record.user?.lastName || ''}`.trim() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">{record.userEmail || record.user?.email || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
      render: (type) => (
        <div className="flex items-center">
          <IdcardOutlined className="text-blue-500 mr-2" />
          <span className="text-gray-800">{getDocumentTypeText(type)}</span>
        </div>
      ),
    },
    {
      title: 'Document Number',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      render: (number) => <span className="text-gray-800">{number || 'N/A'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} className="px-3 py-1 rounded-full font-semibold">
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => (
        <div className="flex items-center">
          <ClockCircleOutlined className="text-gray-600 mr-2" />
          <span className="text-gray-800">
            {date ? new Date(date).toLocaleDateString() : 'N/A'}
            {date && (
              <div className="text-xs text-gray-600">
                {new Date(date).toLocaleTimeString()}
              </div>
            )}
          </span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                ghost
                icon={<CheckOutlined />}
                onClick={() => handleApproveKYC(record.id)}
                className="hover:-translate-y-1 transition-transform duration-200 shadow-md hover:shadow-lg"
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => openRejectModal(record)}
                className="hover:-translate-y-1 transition-transform duration-200 shadow-md hover:shadow-lg"
              >
                Reject
              </Button>
            </>
          )}
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewDocuments(record)}
            className="hover:-translate-y-1 transition-transform duration-200 shadow-md hover:shadow-lg bg-gray-200 border-gray-300 text-gray-800"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (loading && kycSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-6 flex items-center justify-center relative overflow-hidden">
        <Advanced3DBackground />
        <div className="text-center z-10">
          <Spin size="large" className="mb-4" />
          <div className="text-lg font-medium text-gray-700">
            <TypewriterText text="Loading KYC submissions..." speed={100} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-6 relative overflow-hidden">
      <Advanced3DBackground />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 transform -skew-y-6 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-r from-green-200/30 to-teal-200/30 transform skew-y-6 translate-y-32"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedCard delay={100} className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                <TypewriterText text="KYC Management Dashboard" speed={50} />
              </h1>
              <p className="text-gray-600">Manage and review all KYC submissions in one place</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              <Input
                placeholder="Search KYC submissions..."
                prefix={<SearchOutlined className="text-gray-500" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white border-gray-300 text-gray-800"
                size="large"
                allowClear
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchKYCSubmissions}
                size="large"
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Refresh
              </Button>
            </div>
          </div>
        </AnimatedCard>

        {usingMockData && (
          <AnimatedCard delay={200}>
            <Alert
              message="Using Demo Data"
              description="Admin KYC endpoints are not available. Displaying sample data for demonstration purposes."
              type="warning"
              showIcon
              className="mb-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-100 text-yellow-800 border-0"
              closable
            />
          </AnimatedCard>
        )}

        {error && (
          <AnimatedCard delay={200}>
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-100 text-red-800 border-0"
            />
          </AnimatedCard>
        )}

        {success && (
          <AnimatedCard delay={200}>
            <Alert
              message="Success"
              description={success}
              type="success"
              showIcon
              closable
              onClose={() => setSuccess('')}
              className="mb-6 rounded-lg border-l-4 border-green-500 bg-green-100 text-green-800 border-0"
            />
          </AnimatedCard>
        )}

        {/* Statistics Cards */}
        <AnimatedCard delay={300} className="mb-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <HoverScale>
                <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <Statistic
                    title="Total Submissions"
                    value={stats.total}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: 'black' }}
                    className="text-white"
                  />
                </Card>
              </HoverScale>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <HoverScale>
                <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <Statistic
                    title="Pending Review"
                    value={stats.pending}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: 'blue' }}
                  />
                </Card>
              </HoverScale>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <HoverScale>
                <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <Statistic
                    title="Approved"
                    value={stats.approved}
                    prefix={<CheckOutlined />}
                    valueStyle={{ color: 'green' }}
                  />
                </Card>
              </HoverScale>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <HoverScale>
                <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <Statistic
                    title="Rejected"
                    value={stats.rejected}
                    prefix={<CloseOutlined />}
                    valueStyle={{ color: 'red' }}
                  />
                </Card>
              </HoverScale>
            </Col>
          </Row>
        </AnimatedCard>

        {/* Progress Overview */}
        <AnimatedCard delay={400} className="mb-8">
          <Card className="rounded-xl shadow-xl border-0 bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="m-0 text-gray-800">Verification Progress</Title>
              <RocketOutlined className="text-blue-500 text-lg" />
            </div>
            <Progress 
              percent={stats.total > 0 ? Math.round((stats.approved + stats.rejected) / stats.total * 100) : 0} 
              status="active" 
              strokeColor={{
                '0%': '#3b82f6',
                '100%': '#8b5cf6',
              }}
              trailColor="#d1d5db"
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{stats.approved + stats.rejected} processed</span>
              <span>{stats.pending} pending</span>
            </div>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={500}>
          <Card 
            className="mb-8 rounded-xl shadow-xl border-0 bg-white/80 backdrop-blur-sm border border-gray-200"
            bodyStyle={{ padding: 0 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="px-4 pt-4"
              tabBarStyle={{ margin: 0 }}
            >
              <TabPane 
                tab={
                  <span className="flex items-center font-medium text-gray-800">
                    <ClockCircleOutlined className="mr-2" />
                    Pending
                    {stats.pending > 0 && <Tag className="ml-2 bg-amber-500 text-white border-0">{stats.pending}</Tag>}
                  </span>
                } 
                key="PENDING"
              />
              <TabPane 
                tab={
                  <span className="flex items-center font-medium text-gray-800">
                    <CheckOutlined className="mr-2" />
                    Approved
                    {stats.approved > 0 && <Tag color="green" className="ml-2 bg-green-500 text-white border-0">{stats.approved}</Tag>}
                  </span>
                } 
                key="APPROVED"
              />
              <TabPane 
                tab={
                  <span className="flex items-center font-medium text-gray-800">
                    <CloseOutlined className="mr-2" />
                    Rejected
                    {stats.rejected > 0 && <Tag color="red" className="ml-2 bg-red-500 text-white border-0">{stats.rejected}</Tag>}
                  </span>
                } 
                key="REJECTED"
              />
              <TabPane 
                tab={
                  <span className="flex items-center font-medium text-gray-800">
                    <UserOutlined className="mr-2" />
                    All
                    {stats.total > 0 && <Tag color="blue" className="ml-2 bg-blue-500 text-white border-0">{stats.total}</Tag>}
                  </span>
                } 
                key="ALL"
              />
            </Tabs>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={600}>
          <Card 
            className="rounded-xl shadow-xl border-0 bg-white/80 backdrop-blur-sm border border-gray-200 overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            {filteredSubmissions.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-600">
                    {activeTab === 'PENDING' 
                      ? 'No Pending KYC Submissions' 
                      : activeTab === 'APPROVED'
                      ? 'No Approved KYC Submissions'
                      : activeTab === 'REJECTED'
                      ? 'No Rejected KYC Submissions'
                      : 'No KYC Submissions'
                    }
                  </span>
                }
                className="py-16 bg-gray-50"
              >
                <Button 
                  type="primary"
                  onClick={fetchKYCSubmissions}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Refresh Data
                </Button>
              </Empty>
            ) : (
              <Table 
                columns={columns} 
                dataSource={filteredSubmissions.map(item => ({ ...item, key: item.id }))} 
                pagination={{ 
                  pageSize: 10, 
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => (
                    <span className="text-gray-600">
                      {range[0]}-{range[1]} of {total} items
                    </span>
                  )
                }}
                className="rounded-lg overflow-hidden bg-white"
                scroll={{ x: 1000 }}
              />
            )}
          </Card>
        </AnimatedCard>

        <Modal
          title={
            <span className="text-xl font-bold text-gray-800">
              {modalMode === 'view' 
                ? `KYC Documents - ${selectedKYC?.userName || `${selectedKYC?.user?.firstName || ''} ${selectedKYC?.user?.lastName || ''}`.trim() || 'User'}`
                : `Reject KYC - ${selectedKYC?.userName || `${selectedKYC?.user?.firstName || ''} ${selectedKYC?.user?.lastName || ''}`.trim() || 'User'}`
              }
            </span>
          }
          open={showModal}
          onCancel={closeModal}
          footer={null}
          width={modalMode === 'view' ? 800 : 600}
          className="rounded-lg [&_.ant-modal-content]:bg-white [&_.ant-modal-content]:border [&_.ant-modal-content]:border-gray-200"
          styles={{
            body: { padding: '24px' },
            header: { 
              borderBottom: '1px solid #e5e7eb', 
              padding: '16px 24px',
              backgroundColor: '#f9fafb'
            }
          }}
        >
          {modalMode === 'view' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
                <h4 className="font-medium text-gray-800 mb-2">Document Front</h4>
                {selectedKYC && renderImage(selectedKYC.documentFrontImageUrl, 'Document Front')}
              </div>
              
              {selectedKYC?.documentBackImageUrl && (
                <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
                  <h4 className="font-medium text-gray-800 mb-2">Document Back</h4>
                  {renderImage(selectedKYC.documentBackImageUrl, 'Document Back')}
                </div>
              )}
              
              <div className="bg-gray-100 p-4 rounded-xl shadow-inner md:col-span-2">
                <h4 className="font-medium text-gray-800 mb-2">Selfie with Document</h4>
                {selectedKYC && renderImage(selectedKYC.selfieImageUrl, 'Selfie')}
              </div>
            </div>
          ) : (
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <TextArea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800"
                placeholder="Please provide a detailed reason for rejection..."
                rows={4}
              />
              <div className="flex justify-end mt-6 space-x-3">
                <Button 
                  onClick={closeModal} 
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-200 border-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => handleRejectKYC(selectedKYC.id)}
                  disabled={!rejectionReason || rejectionReason.trim() === ''}
                  className="shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminKYCManagement;