// src/components/common/Footer.jsx
import React, { useEffect, useRef } from 'react';
import { Space, Typography, Tooltip } from 'antd';
import { GithubOutlined, LinkedinOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import './Footer.css';

const { Text } = Typography;

const Footer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Canvas animation for background
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 200;

    let particlesArray = [];
    const numberOfParticles = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      connectParticles();
      requestAnimationFrame(animate);
    }

    function connectParticles() {
      const maxDistance = 100;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <footer className="home-footer relative overflow-hidden">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-10"
      />

      <div className="footer-container relative z-10">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo transform hover:scale-105 transition-transform duration-500">
              <div className="logo-3d small animate-pulse-slow">
                <div className="logo-inner">
                  <div className="logo-front bg-gradient-to-r from-purple-600 to-indigo-600">N</div>
                  <div className="logo-side logo-right bg-gradient-to-r from-purple-700 to-indigo-700"></div>
                  <div className="logo-side logo-left bg-gradient-to-r from-purple-700 to-indigo-700"></div>
                  <div className="logo-side logo-top bg-gradient-to-b from-purple-800 to-indigo-800"></div>
                  <div className="logo-side logo-bottom bg-gradient-to-t from-purple-800 to-indigo-800"></div>
                  <div className="logo-side logo-back bg-gradient-to-r from-purple-900 to-indigo-900"></div>
                </div>
              </div>
              <span className="logo-text text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-bold text-xl">
                NextGen Finance Hub
              </span>
            </div>
            <p className="footer-description text-gray-400">
              Revolutionizing finance with cutting-edge technology and customer-centric solutions.
            </p>
            <div className="social-links footer-social mt-4">
              <Space size="large">
                <Tooltip title="GitHub" color="purple">
                  <a
                    href="https://github.com/Sharathhk122"
                    className="social-link transform hover:scale-125 transition-transform duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubOutlined className="text-xl text-gray-400 hover:text-indigo-400" />
                  </a>
                </Tooltip>
                <Tooltip title="LinkedIn" color="blue">
                  <a
                    href="https://www.linkedin.com/in/sharath-h-k-174536308"
                    className="social-link transform hover:scale-125 transition-transform duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinOutlined className="text-xl text-gray-400 hover:text-blue-400" />
                  </a>
                </Tooltip>
                <Tooltip title="Instagram" color="pink">
                  <a
                    href="https://www.instagram.com/sharath_hk__01/profilecard/?igsh=Mzc1Y3IxdGFmOXNh"
                    className="social-link transform hover:scale-125 transition-transform duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramOutlined className="text-xl text-gray-400 hover:text-pink-400" />
                  </a>
                </Tooltip>
                <Tooltip title="Twitter" color="cyan">
                  <a
                    href="https://sharathhk-portfolio.onrender.com"
                    className="social-link transform hover:scale-125 transition-transform duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterOutlined className="text-xl text-gray-400 hover:text-cyan-400" />
                  </a>
                </Tooltip>
              </Space>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading text-gray-200 font-semibold">Quick Links</h4>
            <ul className="footer-links">
              {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                <li key={index} className="transform hover:translate-x-1 transition-transform duration-300">
                  <a
                    href={item === 'Home' ? '/home' : `/home#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-indigo-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading text-gray-200 font-semibold">Services</h4>
            <ul className="footer-links">
              {['Digital Banking', 'Smart Loans', 'AI Investments', 'Crypto Solutions'].map((service, index) => (
                <li key={index} className="transform hover:translate-x-1 transition-transform duration-300">
                  <a
                    href={service === 'Smart Loans' ? '/loans' : '/dashboard'}
                    className="text-gray-400 hover:text-indigo-400"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading text-gray-200 font-semibold">Support</h4>
            <ul className="footer-links">
              {['FAQ', 'Privacy Policy', 'Terms of Service', 'Security'].map((item, index) => (
                <li key={index} className="transform hover:translate-x-1 transition-transform duration-300">
                  <a href="#" className="text-gray-400 hover:text-indigo-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Animated copyright line */}
     {/* Animated copyright line */}
<div className="footer-bottom border-t border-gray-800 pt-6 mt-8 relative">
  {/* Glow background */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 blur-3xl opacity-20"
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
  />

  {/* Floating text */}
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className="relative text-center"
  >
    <Text className="text-lg font-semibold tracking-wide">
      <motion.span
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          textShadow: [
            "0px 0px 6px #a855f7",
            "0px 0px 12px #6366f1",
            "0px 0px 10px #ec4899",
            "0px 0px 6px #a855f7",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-[length:200%_200%] text-transparent bg-clip-text"
      >
        © 2025 NextGen Finance Hub. All rights reserved. | Developed by <strong>Sharath H K</strong>
      </motion.span>
    </Text>
  </motion.div>
</div>

      </div>
    </footer>
  );
};

export default Footer;
