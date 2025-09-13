import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const phrases = [
    "Secure authentication powered by Nexus",
    "Enterprise-grade security protocols",
    "Your data is encrypted end-to-end",
    "Multi-factor authentication ready"
  ];

  useEffect(() => {
    document.body.classList.add('dark-theme');
    
    // Mouse move 3D effect
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          translateZ(10px)
        `;
        
        // Parallax effect for shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach(shape => {
          const depth = parseFloat(shape.getAttribute('data-depth'));
          const xMove = (x - centerX) * depth;
          const yMove = (y - centerY) * depth;
          shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
      }
    };

    // Mouse leave effect
    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (typingIndex < phrases.length) {
      const currentPhrase = phrases[typingIndex];
      
      if (!typingComplete) {
        // Typing out
        if (typingText.length < currentPhrase.length) {
          const timeout = setTimeout(() => {
            setTypingText(currentPhrase.substring(0, typingText.length + 1));
          }, 50);
          return () => clearTimeout(timeout);
        } else {
          // Pause at end of phrase
          const timeout = setTimeout(() => setTypingComplete(true), 1500);
          return () => clearTimeout(timeout);
        }
      } else {
        // Deleting text
        if (typingText.length > 0) {
          const timeout = setTimeout(() => {
            setTypingText(typingText.substring(0, typingText.length - 1));
          }, 30);
          return () => clearTimeout(timeout);
        } else {
          // Move to next phrase
          setTypingComplete(false);
          setTypingIndex((typingIndex + 1) % phrases.length);
        }
      }
    }
  }, [typingText, typingComplete, typingIndex, phrases]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirect based on user role
        if (result.roles && result.roles.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" ref={containerRef}>
      <div className="animated-bg">
        <div className="shape" data-depth="0.05"></div>
        <div className="shape" data-depth="0.1"></div>
        <div className="shape" data-depth="0.07"></div>
        <div className="shape" data-depth="0.12"></div>
        <div className="shape" data-depth="0.08"></div>
      </div>
      
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="login-card" ref={cardRef}>
        <div className="login-card-content">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
          
          <div className="logo-container">
            <div className="logo">
              NEXUS
              <span className="logo-badge">PRO</span>
            </div>
          </div>
          
          <h2>Welcome Back</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email"
              />
              <span className="input-icon">✉️</span>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
              />
              <span className="input-icon">🔒</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <span className="button-loading"></span>
                  Logging in...
                </>
              ) : (
                'Login →'
              )}
            </button>
          </form>

          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register here</Link>
            </p>
          </div>
          
          <div className="type-animation">
            <div className="typing-text">{typingText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;