import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 3D Animated Background Component
const ParticleBackground = () => {
  const meshRef = useRef();
  const particles = useRef([]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
    
    particles.current.forEach((particle, i) => {
      particle.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
      particle.position.x += Math.cos(state.clock.elapsedTime + i) * 0.01;
    });
  });

  // Create particle system
  useEffect(() => {
    const count = 100;
    const tempParticles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      tempParticles.push(particle);
    }
    
    particles.current = tempParticles;
  }, []);

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.current.length}
            array={new Float32Array(particles.current.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#8A2BE2" />
      </points>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#9370DB" />
    </>
  );
};

// Floating 3D Calculator Component
const FloatingCalculator = ({ emiValue }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 16, 16]} position={[0, 0, 0]}>
      <meshPhongMaterial
        color={emiValue > 0 ? "#4B0082" : "#483D8B"}
        emissive={emiValue > 0 ? "#4B0082" : "#483D8B"}
        emissiveIntensity={0.2}
        specular="#9370DB"
        shininess={100}
        wireframe={false}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
};

// Text animation component
const AnimatedText = ({ text, delay = 0 }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * 0.1 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Main EMI Calculator Component
const EMICalculator = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    tenureMonths: ''
  });
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEMI = () => {
    setIsCalculating(true);
    const principal = parseFloat(formData.loanAmount);
    const rate = parseFloat(formData.interestRate) / 1200; // Monthly interest rate
    const tenure = parseInt(formData.tenureMonths);
    
    if (principal > 0 && rate > 0 && tenure > 0) {
      const factor = Math.pow(1 + rate, tenure);
      const emi = (principal * rate * factor) / (factor - 1);
      const totalPayable = emi * tenure;
      const totalInterest = totalPayable - principal;
      
      setTimeout(() => {
        setResult({
          emi: emi.toFixed(2),
          totalPayable: totalPayable.toFixed(2),
          totalInterest: totalInterest.toFixed(2)
        });
        setIsCalculating(false);
      }, 1500);
    } else {
      setIsCalculating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEMI();
  };

  // Reset animation when values change
  useEffect(() => {
    if (formData.loanAmount || formData.interestRate || formData.tenureMonths) {
      setResult(null);
    }
  }, [formData]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-950 text-gray-100 flex items-center justify-center">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ParticleBackground />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      
      {/* Centered 3D Element */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10 opacity-70">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <FloatingCalculator emiValue={result ? parseFloat(result.emi) : 0} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.0} color="#9370DB" />
        </Canvas>
      </div>

      <div className="relative z-20 container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            <AnimatedText text="3D EMI Calculator" />
          </h1>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Calculate your Equated Monthly Installment with our advanced 3D visualization tool
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800 bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-indigo-700 border-opacity-30"
          >
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">
              <AnimatedText text="Loan Details" delay={1} />
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 bg-opacity-70 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="Enter loan amount"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-900 bg-opacity-70 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="Enter interest rate"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  Loan Tenure (Months)
                </label>
                <input
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 bg-opacity-70 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="Enter tenure in months"
                  required
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  "Calculate EMI"
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800 bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-indigo-700 border-opacity-30 h-full"
          >
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">
              <AnimatedText text="Calculation Results" delay={2} />
            </h2>
            
            {isCalculating ? (
              <div className="flex justify-center items-center h-48">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin-reverse absolute top-0 left-0"></div>
                </div>
              </div>
            ) : result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl border border-purple-500 border-opacity-30">
                  <h3 className="text-lg font-medium text-indigo-200 mb-2">Monthly EMI</h3>
                  <p className="text-3xl font-bold text-white">₹{parseFloat(result.emi).toLocaleString('en-IN')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900 bg-opacity-60 rounded-lg border border-indigo-700">
                    <h3 className="text-sm font-medium text-indigo-200 mb-1">Total Payment</h3>
                    <p className="text-xl font-semibold text-white">₹{parseFloat(result.totalPayable).toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-900 bg-opacity-60 rounded-lg border border-indigo-700">
                    <h3 className="text-sm font-medium text-indigo-200 mb-1">Total Interest</h3>
                    <p className="text-xl font-semibold text-white">₹{parseFloat(result.totalInterest).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-indigo-700 border-opacity-30">
                  <p className="text-sm text-indigo-300">
                    The EMI is calculated based on the standard formula with monthly compounding.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center p-6 border-2 border-dashed border-indigo-700 border-opacity-40 rounded-xl">
                <div className="text-indigo-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-indigo-200">Enter your loan details and click Calculate to see your EMI results</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;