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
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [autoFilled, setAutoFilled] = useState(null);

  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const phrases = [
    "Use test credentials for quick access",
    "Customer: sharathhk01@gmail.com / Sharathhk@123",
    "Admin: sharathhk188@gmail.com / Sharathhk@123",
    "Enterprise-grade security protocols"
  ];

  const testCredentials = [
    {
      type: 'customer',
      email: 'sharathhk01@gmail.com',
      password: 'Sharathhk@123'
    },
    {
      type: 'Admin',
      email: 'sharathhk188@gmail.com',
      password: 'Sharathhk@123'
    }
  ];

  useEffect(() => {
    document.body.classList.add('dark-theme');
    
    // Mouse move 3D effect (removed hover effect on form box)
    const handleMouseMove = (e) => {
      // Parallax effect for background shapes only
      const shapes = document.querySelectorAll('.shape');
      const card = cardRef.current;
      if (card && shapes.length > 0) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        shapes.forEach(shape => {
          const depth = parseFloat(shape.getAttribute('data-depth'));
          const xMove = (x - centerX) * depth;
          const yMove = (y - centerY) * depth;
          shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
      }
    };

    // No card rotation on mouse leave
    const handleMouseLeave = () => {
      const shapes = document.querySelectorAll('.shape');
      shapes.forEach(shape => {
        shape.style.transform = 'translate(0, 0)';
      });
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

  const fillTestCredentials = (cred) => {
    setFormData({
      email: cred.email,
      password: cred.password
    });
    setAutoFilled(cred.type);
  };

  const TestCredentialsModal = () => (
    <div className="test-credentials-modal">
      <div className="modal-content">
        <h3>Test Credentials</h3>
        <div className="credentials-list">
          {testCredentials.map((cred, index) => (
            <div key={index} className="credential-item">
              <div className="credential-header">
                <span className={`credential-badge ${cred.type}`}>
                  {cred.type === 'customer' ? '👤 Customer' : '🏪 Admin'}
                </span>
              </div>
              <div className="credential-details">
                <div className="credential-field">
                  <span className="field-label">Email:</span>
                  <span className="field-value">{cred.email}</span>
                </div>
                <div className="credential-field">
                  <span className="field-label">Password:</span>
                  <span className="field-value">{cred.password}</span>
                </div>
                <button 
                  className="fill-button"
                  onClick={() => fillTestCredentials(cred)}
                >
                  Fill Credentials
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="close-button"
          onClick={() => setShowTestCredentials(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

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
          
          <div className="test-credentials-notice">
            <p>Use test accounts for quick access:</p>
            <div className="credential-pills">
              <span 
                className="credential-pill customer"
                onClick={() => fillTestCredentials(testCredentials[0])}
              >
                👤 Customer
              </span>
              <span 
                className="credential-pill seller"
                onClick={() => fillTestCredentials(testCredentials[1])}
              >
                🏪 Admin
              </span>
            </div>
            <button 
              className="view-all-button"
              onClick={() => setShowTestCredentials(true)}
            >
              View All Credentials
            </button>
          </div>

          {autoFilled && (
            <div className="auto-filled-notice">
              ✅ Auto-filled {autoFilled} credentials
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email 
                {formData.email === 'sharathhk01@gmail.com' && <span className="filled-badge">Customer</span>}
                {formData.email === 'sharathhk188@gmail.com' && <span className="filled-badge Admin">Admin</span>}
              </label>
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

      {showTestCredentials && <TestCredentialsModal />}
    </div>
  );
};

export default LoginForm;
