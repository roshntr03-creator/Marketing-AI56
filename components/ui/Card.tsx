import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  const baseClasses = 'glass-panel rounded-xl overflow-hidden transition-all duration-300';
  const hoverClasses = hoverEffect || onClick 
    ? 'hover:border-primary/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] cursor-pointer hover:-translate-y-1' 
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