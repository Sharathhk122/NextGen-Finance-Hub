// src/pages/kyc/KYCStatus.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { kycAPI } from "../../api/kyc";
import { motion } from "framer-motion";
import { Card, Spin, Alert, Tag, Timeline, Progress, Row, Col } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  IdcardOutlined
} from "@ant-design/icons";
import * as THREE from "three";

const KYCStatus = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchKYCStatus();
    init3DBackground();

    return () => {
      // Clean up Three.js on component unmount
      if (canvasRef.current) {
        const renderer = canvasRef.current.renderer;
        if (renderer) {
          renderer.dispose();
        }
      }
    };
  }, []);

  const init3DBackground = () => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);
    canvasRef.current.renderer = renderer;

    // Add floating particles with different colors
    const particlesCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Color palette for particles
    const colors = [
      new THREE.Color(0x4f46e5), // indigo
      new THREE.Color(0x818cf8), // light indigo
      new THREE.Color(0xa5b4fc), // lighter indigo
      new THREE.Color(0xc7d2fe), // lightest indigo
    ];
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 10;
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add floating geometric shapes with different forms and colors
    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(0.3, 0),
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.TetrahedronGeometry(0.35, 0),
      new THREE.DodecahedronGeometry(0.25, 0),
      new THREE.ConeGeometry(0.2, 0.5, 8),
      new THREE.TorusGeometry(0.25, 0.1, 16, 100)
    ];
    
    const shapeColors = [
      0x4f46e5, // indigo-600
      0x6366f1, // indigo-500
      0x818cf8, // indigo-400
      0xa5b4fc, // indigo-300
      0xc7d2fe, // indigo-200
      0xe0e7ff  // indigo-100
    ];
    
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshPhongMaterial({
        color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        wireframe: Math.random() > 0.7
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Store original position for animation
      mesh.userData = {
        originalY: mesh.position.y,
        speed: 0.2 + Math.random() * 0.3,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      };
      
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional lights from multiple angles
    const light1 = new THREE.DirectionalLight(0xffffff, 0.6);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0x818cf8, 0.4);
    light2.position.set(-5, 3, 2);
    scene.add(light2);
    
    const light3 = new THREE.DirectionalLight(0xc7d2fe, 0.3);
    light3.position.set(2, -5, -3);
    scene.add(light3);

    // Add point lights for more depth
    const pointLight1 = new THREE.PointLight(0x4f46e5, 0.5, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x818cf8, 0.4, 8);
    pointLight2.position.set(-3, -1, 1);
    scene.add(pointLight2);

    camera.position.z = 7;

    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Animate particles
      particlesMesh.rotation.x = elapsedTime * 0.05;
      particlesMesh.rotation.y = elapsedTime * 0.05;
      
      // Animate shapes with floating motion
      shapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
        
        // Floating up and down animation
        shape.position.y = shape.userData.originalY + Math.sin(elapsedTime * shape.userData.speed) * 0.5;
        
        // Slight horizontal movement
        shape.position.x += Math.cos(elapsedTime * shape.userData.speed * 0.5) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
  };

  const fetchKYCStatus = async () => {
    try {
      const response = await kycAPI.getKYCStatus();
      setKycData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("KYC_NOT_FOUND");
      } else {
        setError(err.response?.data?.message || "Failed to fetch KYC status");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "APPROVED":
        return { 
          color: "green", 
          icon: <CheckCircleOutlined />,
          progress: 100,
          status: "success"
        };
      case "REJECTED":
        return { 
          color: "red", 
          icon: <CloseCircleOutlined />,
          progress: 100,
          status: "exception"
        };
      case "PENDING":
        return { 
          color: "gold", 
          icon: <ClockCircleOutlined />,
          progress: 50,
          status: "active"
        };
      case "UNDER_REVIEW":
        return { 
          color: "blue", 
          icon: <ClockCircleOutlined />,
          progress: 75,
          status: "active"
        };
      default:
        return { 
          color: "default", 
          icon: <ClockCircleOutlined />,
          progress: 0,
          status: "normal"
        };
    }
  };

  const getDocumentTypeText = (type) => {
    if (!type) return "N/A";
    return type
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusTimeline = (status) => {
    const items = [
      {
        color: 'green',
        dot: <CheckCircleOutlined />,
        children: (
          <div className="text-gray-800">
            <p>KYC Submission</p>
            <small>{kycData?.submittedAt ? new Date(kycData.submittedAt).toLocaleDateString() : 'Pending'}</small>
          </div>
        ),
      }
    ];

    if (status === 'PENDING' || status === 'UNDER_REVIEW') {
      items.push({
        color: 'blue',
        dot: <ClockCircleOutlined />,
        children: (
          <div className="text-gray-800">
            <p>Under Review</p>
            <small>Processing your documents</small>
          </div>
        ),
      });
    } else if (status === 'APPROVED' || status === 'REJECTED') {
      items.push({
        color: status === 'APPROVED' ? 'green' : 'red',
        dot: status === 'APPROVED' ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
        children: (
          <div className="text-gray-800">
            <p>{status === 'APPROVED' ? 'Approved' : 'Rejected'}</p>
            <small>{kycData?.verifiedAt ? new Date(kycData.verifiedAt).toLocaleDateString() : 'N/A'}</small>
          </div>
        ),
      });
    }

    return items;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        <div ref={canvasRef} className="absolute inset-0 z-0"></div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="mb-6"
          >
            <div className="w-16 h-16 rounded-full border-4 border-indigo-300 border-t-indigo-600"></div>
          </motion.div>
          <Spin size="large" tip="Loading KYC Status..." className="text-gray-800">
            <div className="p-8 rounded-lg bg-gray-100/90 backdrop-blur-sm" />
          </Spin>
        </motion.div>
      </div>
    );
  }

  // Error state (excluding not found)
  if (error && error !== "KYC_NOT_FOUND") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        <div ref={canvasRef} className="absolute inset-0 z-0"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 bg-gray-100/90 p-8 rounded-2xl shadow-2xl backdrop-blur-md max-w-md text-center text-gray-800"
        >
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
          <Link
            to="/kyc/submit"
            className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg hover:scale-105 transition-transform text-gray-800 font-semibold"
          >
            Submit KYC Documents
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0 z-0"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-4xl bg-gray-100/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-300/30 p-8 z-10"
      >
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 drop-shadow-lg"
        >
          KYC Verification Status
        </motion.h2>

        {kycData ? (
          <div className="space-y-8">
            {/* Status Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                className="bg-gradient-to-br from-white to-gray-100 border-gray-300/50 rounded-2xl shadow-xl overflow-hidden"
                styles={{ body: { padding: '24px' } }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={8} className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: kycData.status === "PENDING" ? Infinity : 0,
                          repeatDelay: 3
                        }}
                        className="text-5xl mb-2"
                        style={{ color: getStatusConfig(kycData.status).color }}
                      >
                        {getStatusConfig(kycData.status).icon}
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Tag 
                          color={getStatusConfig(kycData.status).color} 
                          className="text-lg px-4 py-1 rounded-full font-semibold shadow-md"
                        >
                          {kycData.status.replace(/_/g, ' ')}
                        </Tag>
                      </motion.div>
                    </div>
                  </Col>
                  <Col xs={24} md={16}>
                    <Progress 
                      percent={getStatusConfig(kycData.status).progress}
                      status={getStatusConfig(kycData.status).status}
                      strokeColor={{
                        from: '#4f46e5',
                        to: '#818cf8',
                      }}
                      showInfo={false}
                      className="mb-4"
                    />
                    <Timeline items={getStatusTimeline(kycData.status)} className="text-gray-800" />
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Document Details */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: -5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    title={
                      <span className="text-gray-700 flex items-center">
                        <FileTextOutlined className="mr-2 text-indigo-600" />
                        Document Information
                      </span>
                    }
                    className="bg-gradient-to-br from-white to-gray-100 border-gray-300/50 rounded-2xl shadow-lg h-full overflow-hidden"
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          Document Type:
                        </label>
                        <p className="text-gray-800 text-lg flex items-center">
                          <IdcardOutlined className="mr-2 text-indigo-500" />
                          {getDocumentTypeText(kycData.documentType)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          Document Number:
                        </label>
                        <p className="text-gray-800 text-lg font-mono bg-gray-100 p-2 rounded-lg">
                          {kycData.documentNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
              
              <Col xs={24} md={12}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: -5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    title={
                      <span className="text-gray-700 flex items-center">
                        <CalendarOutlined className="mr-2 text-indigo-600" />
                        Timeline
                      </span>
                    }
                    className="bg-gradient-to-br from-white to-gray-100 border-gray-300/50 rounded-2xl shadow-lg h-full overflow-hidden"
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          Submitted At:
                        </label>
                        <p className="text-gray-800 text-lg">
                          {new Date(kycData.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      {kycData.verifiedAt && (
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">
                            Verified At:
                          </label>
                          <p className="text-gray-800 text-lg">
                            {new Date(kycData.verifiedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {kycData.verifiedBy && (
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">
                            Verified By:
                          </label>
                          <p className="text-gray-800 text-lg flex items-center">
                            <UserOutlined className="mr-2 text-indigo-500" />
                            {kycData.verifiedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            {/* Rejection Reason */}
            {kycData.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Alert
                  message="Rejection Reason"
                  description={kycData.rejectionReason}
                  type="error"
                  showIcon
                  className="rounded-2xl border-l-4 border-red-500"
                />
              </motion.div>
            )}

            {/* Conditional Messages and Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              {kycData.status === "REJECTED" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/kyc/submit"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all font-semibold mx-2"
                  >
                    Resubmit KYC
                  </Link>
                </motion.div>
              )}

              {kycData.status === "PENDING" && (
                <motion.div 
                  className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl text-center shadow-lg"
                  animate={{ 
                    backgroundColor: ["rgba(254, 252, 232, 0.7)", "rgba(255, 251, 235, 0.9)", "rgba(254, 252, 232, 0.7)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="font-bold text-lg flex items-center justify-center">
                    <ClockCircleOutlined className="mr-2" />
                    Your KYC is under review
                  </p>
                  <p>Please check back later for updates.</p>
                </motion.div>
              )}

              {kycData.status === "APPROVED" && (
                <motion.div 
                  className="p-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-center shadow-lg"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <p className="font-bold text-lg flex items-center justify-center">
                    <CheckCircleOutlined className="mr-2" />
                    Your KYC has been approved!
                  </p>
                  <p>You can now access all banking services.</p>
                </motion.div>
              )}

              <div className="mt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all font-semibold mx-2"
                  >
                    Go to Dashboard
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="mb-6"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FileTextOutlined className="text-5xl text-indigo-400" />
            </motion.div>
            <p className="mb-4 text-gray-700 text-lg">No KYC submission found.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/kyc/submit"
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all font-semibold"
              >
                Submit KYC Documents
              </Link>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default KYCStatus;