import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Button, Progress, Tooltip } from 'antd';
import { 
  EyeOutlined, 
  SwapOutlined, 
  CreditCardOutlined, 
  BankOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const AccountCard = ({ account }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((y - centerY) / centerY) * -10;
    
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.02, 1.02, 1.02)
    `;
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(85);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Get gradient colors based on account type
  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'SAVINGS': 
        return {
          primary: 'from-blue-500 to-cyan-500',
          secondary: 'from-blue-600 to-cyan-600',
          light: 'from-blue-400 to-cyan-400',
          text: 'text-blue-100',
          border: 'border-blue-400',
          tag: 'blue'
        };
      case 'CURRENT': 
        return {
          primary: 'from-purple-500 to-pink-500',
          secondary: 'from-purple-600 to-pink-600',
          light: 'from-purple-400 to-pink-400',
          text: 'text-purple-100',
          border: 'border-purple-400',
          tag: 'purple'
        };
      case 'SALARY': 
        return {
          primary: 'from-green-500 to-teal-500',
          secondary: 'from-green-600 to-teal-600',
          light: 'from-green-400 to-teal-400',
          text: 'text-green-100',
          border: 'border-green-400',
          tag: 'green'
        };
      case 'FIXED_DEPOSIT': 
        return {
          primary: 'from-amber-500 to-orange-500',
          secondary: 'from-amber-600 to-orange-600',
          light: 'from-amber-400 to-orange-400',
          text: 'text-amber-100',
          border: 'border-amber-400',
          tag: 'orange'
        };
      case 'RECURRING_DEPOSIT': 
        return {
          primary: 'from-indigo-500 to-violet-500',
          secondary: 'from-indigo-600 to-violet-600',
          light: 'from-indigo-400 to-violet-400',
          text: 'text-indigo-100',
          border: 'border-indigo-400',
          tag: 'geekblue'
        };
      default: 
        return {
          primary: 'from-gray-500 to-slate-500',
          secondary: 'from-gray-600 to-slate-600',
          light: 'from-gray-400 to-slate-400',
          text: 'text-gray-100',
          border: 'border-gray-400',
          tag: 'default'
        };
    }
  };

  // Get status badge with appropriate colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': 
        return { element: <Tag color="green">Active</Tag>, color: 'green' };
      case 'INACTIVE': 
        return { element: <Tag color="default">Inactive</Tag>, color: 'default' };
      case 'DORMANT': 
        return { element: <Tag color="gold">Dormant</Tag>, color: 'gold' };
      case 'FROZEN': 
        return { element: <Tag color="red">Frozen</Tag>, color: 'red' };
      case 'CLOSED': 
        return { element: <Tag color="volcano">Closed</Tag>, color: 'volcano' };
      default: 
        return { element: <Tag color="default">Unknown</Tag>, color: 'default' };
    }
  };

  const colors = getAccountTypeColor(account.accountType);
  const statusBadge = getStatusBadge(account.status);

  return (
    <div 
      ref={cardRef}
      className="relative w-full h-full transition-all duration-500 ease-out"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} rounded-3xl ${colors.border} border-2 backdrop-blur-xl transition-all duration-700 overflow-hidden`}>
        {/* Moving gradient particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -inset-24 opacity-40">
            <div className={`absolute top-0 left-0 w-48 h-48 bg-white/30 rounded-full blur-3xl animate-pulse-slow ${isHovered ? 'animate-move' : ''}`} 
                 style={{ 
                   transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
                   transition: 'transform 0.5s ease-out'
                 }}></div>
            <div className={`absolute bottom-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl animate-pulse-slow delay-700 ${isHovered ? 'animate-move-reverse' : ''}`} 
                 style={{ 
                   transform: `translate(${-mousePosition.x / 10}px, ${-mousePosition.y / 10}px)`,
                   transition: 'transform 0.5s ease-out'
                 }}></div>
          </div>
        </div>
        
        {/* Shine effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isHovered ? 'translate-x-full' : ''} transition-transform duration-1000 rounded-3xl`}></div>
        
        {/* Animated border glow */}
        <div className={`absolute -inset-2 bg-gradient-to-br ${colors.light} rounded-3xl blur-md opacity-0 ${isHovered ? 'opacity-50' : ''} transition-opacity duration-500`}></div>
      </div>
      
      {/* Card content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header section with bank logo */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10 mr-3">
              <BankOutlined className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{account.accountNumber}</h3>
              <Tag color={colors.tag} className="mt-2 border-none">
                {account.accountType.replace('_', ' ')}
              </Tag>
            </div>
          </div>
          {statusBadge.element}
        </div>
        
        {/* Balance section with progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-white/80">Current Balance</p>
            <Tooltip title="Includes pending transactions">
              <InfoCircleOutlined className="text-white/60" />
            </Tooltip>
          </div>
          <p className="text-3xl font-bold text-white mb-4">
            ₹{account.balance.toLocaleString('en-IN')}
          </p>
          
          <div className="mb-1">
            <Progress 
              percent={progress} 
              showInfo={false} 
              strokeColor={{
                '0%': '#fff',
                '100%': '#fff',
              }}
              trailColor="rgba(255, 255, 255, 0.2)"
              size="small"
            />
          </div>
          <p className="text-xs text-white/60">Monthly usage</p>
        </div>
        
        {/* Account details */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-white/70 mb-1">Branch</p>
            <p className="font-medium text-white">{account.branchName}</p>
          </div>
          <div>
            <p className="text-white/70 mb-1">IFSC</p>
            <p className="font-medium text-white">{account.ifscCode}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-auto">
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            className="flex-1 h-12 border-white/20 bg-white/10 backdrop-blur-sm"
            href={`/accounts/${account.accountNumber}`}
          >
            Details
          </Button>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            className="flex-1 h-12 border-none"
            href={`/transactions/transfer?from=${account.accountNumber}`}
          >
            Transfer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;