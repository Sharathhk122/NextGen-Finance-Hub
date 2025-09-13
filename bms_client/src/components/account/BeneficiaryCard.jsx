// BeneficiaryCard.jsx - Vibrant 3D with Multi-Color Animation
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ben.css";

const BeneficiaryCard = ({ beneficiary, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for reveal animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this beneficiary?")) {
      onDelete && onDelete(beneficiary?.id);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-60 h-72 cursor-pointer transform transition-all duration-700 mx-auto ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      data-testid="beneficiary-card"
    >
      {/* 3D Card Container */}
      <div
        ref={cardRef}
        className="relative w-full h-full preserve-3d card-3d"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Multi-colored 3D Background with sides */}
        <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
          {/* Base layer with vibrant gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-90 rounded-xl"></div>
          
          {/* Animated moving layers - Multi-color */}
          <div className="absolute -inset-6 moving-layer bg-gradient-to-tl from-cyan-500/30 via-transparent to-emerald-500/30 rounded-xl blur-md" style={{animationDelay: '0s', animationDuration: '15s'}}></div>
          <div className="absolute -inset-8 moving-layer bg-gradient-to-br from-fuchsia-600/25 via-transparent to-amber-500/25 rounded-xl blur-lg" style={{animationDelay: '3s', animationDuration: '18s'}}></div>
          <div className="absolute -inset-5 moving-layer bg-gradient-to-r from-violet-600/20 to-rose-500/20 rounded-xl blur-sm" style={{animationDelay: '6s', animationDuration: '12s'}}></div>
          
          {/* Sides for 3D effect */}
          <div className="absolute -right-2 top-2 w-2 h-full bg-gradient-to-r from-purple-700/40 to-purple-900/20 rounded-r-lg transform rotate-y-10 z-10"></div>
          <div className="absolute -left-2 top-2 w-2 h-full bg-gradient-to-l from-orange-600/40 to-orange-900/20 rounded-l-lg transform -rotate-y-10 z-10"></div>
          <div className="absolute -bottom-2 left-2 w-full h-2 bg-gradient-to-t from-pink-700/40 to-pink-900/20 rounded-b-lg transform rotate-x-10 z-10"></div>
          <div className="absolute -top-2 left-2 w-full h-2 bg-gradient-to-b from-cyan-600/40 to-cyan-900/20 rounded-t-lg transform -rotate-x-10 z-10"></div>
          
          {/* Floating particles */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-cyan-400/20 rounded-full blur-sm depth-element animate-float-slow" data-depth="0.05"></div>
          <div className="absolute bottom-6 right-6 w-10 h-10 bg-purple-500/20 rounded-full blur-sm depth-element animate-float-medium" data-depth="0.07"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-orange-500/20 rounded-full blur-md depth-element animate-float-fast" data-depth="0.04"></div>
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-pink-500/20 rounded-full blur-sm depth-element animate-float-slow" data-depth="0.06"></div>
        </div>

        {/* Main Card Content */}
        <div className="relative h-full bg-gray-900/70 backdrop-blur-md rounded-xl p-4 text-gray-100 flex flex-col border border-cyan-500/20 shadow-lg shadow-cyan-500/10 overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4 z-10">
            <div>
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-pink-300 truncate max-w-[120px]">
                {beneficiary?.nickname || "Beneficiary"}
              </h3>
              <p className="text-xs text-cyan-100/70 mt-1 truncate max-w-[140px]">{beneficiary?.accountHolderName || "Account Holder"}</p>
            </div>

            <button
              onClick={handleDelete}
              className="text-cyan-200 hover:text-red-300 transition-all duration-200 rounded-full p-1 bg-red-500/10 hover:bg-red-500/20 hover:scale-110 z-10"
              title="Delete beneficiary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow space-y-3 z-10">
            <div className="depth-element" data-depth="0.02">
              <p className="text-xs text-cyan-200/60 uppercase tracking-wider font-medium mb-1">Account Number</p>
              <p className="text-sm font-mono tracking-wider bg-gray-800/50 px-3 py-1.5 rounded-md border border-cyan-500/10 backdrop-blur-sm truncate">
                {beneficiary?.accountNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-cyan-200/60 uppercase tracking-wider font-medium mb-1">Bank Name</p>
              <p className="text-sm font-medium bg-gray-800/30 px-3 py-1.5 rounded-md border border-cyan-500/10 backdrop-blur-sm truncate">
                {beneficiary?.bankName}
              </p>
            </div>

            <div className="depth-element" data-depth="0.02">
              <p className="text-xs text-cyan-200/60 uppercase tracking-wider font-medium mb-1">IFSC Code</p>
              <p className="text-sm font-mono tracking-wider bg-gray-800/50 px-3 py-1.5 rounded-md border border-cyan-500/10 backdrop-blur-sm">
                {beneficiary?.ifscCode}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-cyan-500/20 z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-cyan-200/50">Transfer options</span>
              <div className="flex space-x-2">
                <Link
                  to={`/transfer?beneficiaryId=${beneficiary?.id}`}
                  className="text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-3 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-cyan-500/20 relative overflow-hidden group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="relative z-10">Transfer</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  to={`/beneficiaries/${beneficiary?.id}/edit`}
                  className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-3 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-purple-500/20 relative overflow-hidden group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="relative z-10">Edit</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BeneficiaryCard.propTypes = {
  beneficiary: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nickname: PropTypes.string,
    accountHolderName: PropTypes.string,
    accountNumber: PropTypes.string,
    bankName: PropTypes.string,
    ifscCode: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BeneficiaryCard;