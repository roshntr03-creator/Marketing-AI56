import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  // Deep dark background with a very subtle border
  const baseClasses = 'bg-[#0e0e10] border border-white/5 rounded-xl relative overflow-hidden transition-all duration-300';
  
  const hoverClasses = hoverEffect || onClick 
    ? 'hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 cursor-pointer group' 
    : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;