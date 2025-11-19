import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  // "High-end SaaS" look: dark background, subtle border, slight noise texture hint via global CSS if applied.
  const baseClasses = 'bg-[#121214] border border-white/5 rounded-xl overflow-hidden transition-all duration-200';
  
  const hoverClasses = hoverEffect || onClick 
    ? 'hover:border-white/10 hover:bg-[#18181b] cursor-pointer hover:shadow-xl' 
    : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;