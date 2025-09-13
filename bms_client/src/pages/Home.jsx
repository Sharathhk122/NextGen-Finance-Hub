// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mat4 } from 'gl-matrix';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [typedText, setTypedText] = useState('');
  const titles = ["Future of Finance", "Smart Banking", "Wealth Management", "Digital Assets", "Crypto Solutions"];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [typingForward, setTypingForward] = useState(true);

  // Handle login click
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Handle register click
  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Typing animation effect
  useEffect(() => {
    const typeInterval = setInterval(() => {
      if (typingForward) {
        if (typedText.length < titles[currentTitleIndex].length) {
          setTypedText(titles[currentTitleIndex].substring(0, typedText.length + 1));
        } else {
          setTimeout(() => setTypingForward(false), 1500);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(typedText.substring(0, typedText.length - 1));
        } else {
          setTypingForward(true);
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [typedText, currentTitleIndex, typingForward, titles]);

  useEffect(() => {
    // 3D Background Animation with WebGL
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Handle scroll position for parallax effects
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying lowp vec4 vColor;
      varying vec4 vPosition;
      
      void main(void) {
        vPosition = aVertexPosition;
        vColor = aVertexColor;
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        gl_PointSize = 3.0;
      }
    `;

    // Fragment shader program
    const fsSource = `
      precision mediump float;
      varying lowp vec4 vColor;
      varying vec4 vPosition;
      uniform float uTime;
      
      void main(void) {
        vec3 color1 = vec3(0.2, 0.1, 0.4);
        vec3 color2 = vec3(0.6, 0.3, 0.8);
        vec3 color3 = vec3(0.1, 0.3, 0.6);
        vec3 color4 = vec3(0.8, 0.2, 0.6);
        
        float mixValue = (sin(vPosition.x * 2.0 + uTime * 0.001) + 1.0) * 0.5;
        vec3 color = mix(color1, color2, mixValue);
        
        mixValue = (sin(vPosition.y * 3.0 + uTime * 0.0005) + 1.0) * 0.5;
        color = mix(color, color3, mixValue);
        
        mixValue = (cos(vPosition.z * 2.0 + uTime * 0.0008) + 1.0) * 0.5;
        color = mix(color, color4, mixValue);
        
        // Create a glowing effect
        float intensity = 0.6 + 0.4 * sin(uTime * 0.002);
        gl_FragColor = vec4(color * intensity, 0.2);
      }
    `;

    // Initialize shaders
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) {
      console.error('Failed to initialize shader program');
      return;
    }
    
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        time: gl.getUniformLocation(shaderProgram, 'uTime'),
      },
    };

    // Create geometry
    const buffers = initBuffers(gl);

    let then = 0;
    let rotation = 0;

    // Draw the scene
    function render(now) {
      now *= 0.001;  // Convert to seconds
      const deltaTime = now - then;
      then = now;

      rotation += deltaTime;

      drawScene(gl, programInfo, buffers, rotation);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initialize shader program
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  // Create shader
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Initialize buffers
  function initBuffers(gl) {
    // Create a 3D grid of points
    const positions = [];
    const colors = [];
    const gridSize = 15; // Reduced for better performance
    const spacing = 0.3;

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        for (let k = -gridSize/2; k <= gridSize/2; k+=3) { // Reduced density
          positions.push(i * spacing, j * spacing, k * spacing);
          
          // Create color based on position
          const r = (i + gridSize) / (gridSize * 2);
          const g = (j + gridSize) / (gridSize * 2);
          const b = (k + gridSize/2) / gridSize;
          
          colors.push(r, g, b, 1.0);
        }
      }
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      color: colorBuffer,
      vertexCount: positions.length / 3,
    };
  }

  // Draw the scene
  function drawScene(gl, programInfo, buffers, rotation) {
    gl.clearColor(0.05, 0.05, 0.1, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.2, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.3, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.1, [0, 0, 1]);

    // Position buffer
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Color buffer
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
    gl.uniform1f(programInfo.uniformLocations.time, rotation * 1000);

    {
      const offset = 0;
      const vertexCount = buffers.vertexCount;
      gl.drawArrays(gl.POINTS, offset, vertexCount);
    }
  }

  return (
    <div className="home-page">
      {/* 3D Animated Background */}
      <canvas ref={canvasRef} className="animated-background"></canvas>

      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-3d">
              <div className="logo-inner">
                <div className="logo-front">N</div>
                <div className="logo-side logo-right"></div>
                <div className="logo-side logo-left"></div>
                <div className="logo-side logo-top"></div>
                <div className="logo-side logo-bottom"></div>
                <div className="logo-side logo-back"></div>
              </div>
            </div>
            <span className="logo-text">NextGen Finance Hub</span>
          </div>

          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="nav-item">
              <a href="#home" className="nav-link">Home</a>
            </div>
            <div className="nav-item">
              <a href="#about" className="nav-link">About</a>
            </div>
            <div className="nav-item">
              <a href="#services" className="nav-link">Services</a>
            </div>
            <div className="nav-item">
              <a href="#contact" className="nav-link">Contact</a>
            </div>
           
                <div className="nav-item">
                  <button onClick={handleLoginClick} className="nav-link login-btn">Login</button>
                </div>
                <div className="nav-item">
                  <button onClick={handleRegisterClick} className="nav-link register-btn">Register</button>
                </div>
             
          </div>

          <div 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-gradient">{typedText}</span>
              <span className="typed-cursor">|</span>
              <br />
              <span className="title-sub">Reimagined</span>
            </h1>
            <p className="hero-description">
              Experience next-generation financial services with cutting-edge security, 
              AI-powered insights, and seamless digital experiences tailored for the modern world.
            </p>
            <div className="hero-buttons">
             
                  <button onClick={handleRegisterClick} className="cta-button primary">Get Started</button>
                  <button onClick={handleLoginClick} className="cta-button secondary">Login</button>
                
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-inner">
                <div className="card-header">
                  <div className="card-bank-name">NextGen Finance</div>
                  <div className="card-type">Platinum</div>
                </div>
                <div className="card-chip-container">
                  <div className="card-chip"></div>
                  <div className="card-contactless">⎘</div>
                </div>
                <div className="card-number">4682 •••• •••• ••••</div>
                <div className="card-holder-expiry">
                  <div className="card-holder">JOHN DOE</div>
                  <div className="card-expiry">09/28</div>
                </div>
                <div className="card-footer">
                  <div className="card-vendor">
                    <div className="vendor-circle red"></div>
                    <div className="vendor-circle orange"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="orbital-element element-1"></div>
            <div className="orbital-element element-2"></div>
            <div className="orbital-element element-3"></div>
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <div className="scroll-text">Scroll Down</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <h2 className="section-title">About <span className="highlight">NextGen Finance Hub</span></h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                NextGen Finance Hub is a revolutionary financial platform leveraging cutting-edge 
                technology to provide seamless banking experiences. Founded in 2023, we're 
                committed to transforming how people interact with their finances through AI, 
                blockchain, and personalized financial solutions.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">1M+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">$10B+</div>
                  <div className="stat-label">Assets Managed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">24/7</div>
                  <div className="stat-label">AI Support</div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="pyramid-container">
                <div className="pyramid">
                  <div className="base"></div>
                  <div className="side side-1"></div>
                  <div className="side side-2"></div>
                  <div className="side side-3"></div>
                  <div className="side side-4"></div>
                </div>
              </div>
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-container">
          <h2 className="section-title">Our <span className="highlight">Services</span></h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <div className="icon-bg"></div>
                <i className="icon">💳</i>
              </div>
              <h3 className="service-title">Digital Banking</h3>
              <p className="service-description">
                Full-featured online and mobile banking with advanced security 
                and intuitive interfaces powered by AI.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <div className="icon-bg"></div>
                <i className="icon">📈</i>
              </div>
              <h3 className="service-title">Investment Solutions</h3>
              <p className="service-description">
                AI-driven investment portfolios and wealth management 
                services tailored to your financial goals.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <div className="icon-bg"></div>
                <i className="icon">🔐</i>
              </div>
              <h3 className="service-title">Secure Transactions</h3>
              <p className="service-description">
                Blockchain-powered encryption and fraud protection for all your 
                financial transactions.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <div className="icon-bg"></div>
                <i className="icon">🏠</i>
              </div>
              <h3 className="service-title">Smart Loans</h3>
              <p className="service-description">
                AI-optimized mortgage rates and flexible repayment options 
                for your dream home.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <div className="icon-bg"></div>
                <i className="icon">🔄</i>
              </div>
              <h3 className="service-title">Instant Transfers</h3>
              <p className="service-description">
                Send and receive money globally with minimal fees and 
                real-time blockchain tracking.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <div className="icon-bg"></div>
                <i className="icon">🌍</i>
              </div>
              <h3 className="service-title">Global Banking</h3>
              <p className="service-description">
                International accounts and multi-currency support for 
                your global financial needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <h2 className="section-title">Get in <span className="highlight">Touch</span></h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Address</h4>
                  <p>123 FinTech District, Innovation Avenue, Metro City 10001</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>+1 (888) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>support@nextgenfinancehub.com</p>
                </div>
              </div>
              <div className="social-links">
                <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <span className="social-icon">🐱</span>
                  <span className="social-text">GitHub</span>
                </a>
                <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <span className="social-icon">👔</span>
                  <span className="social-text">LinkedIn</span>
                </a>
                <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <span className="social-icon">📸</span>
                  <span className="social-text">Instagram</span>
                </a>
                <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <span className="social-icon">🐦</span>
                  <span className="social-text">Twitter</span>
                </a>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" className="form-textarea"></textarea>
                </div>
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;