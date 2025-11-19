import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false, 
  className = '', 
  leftIcon,
  rightIcon,
  disabled,
  ...props 
}) => {
  
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden select-none';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const variantClasses = {
    // Primary: Indigo Gradient, not plain white
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500/50 shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]',
    // Secondary: Dark surface with border, not white
    secondary: 'bg-[#27272a] text-zinc-200 hover:bg-[#3f3f46] border border-[#3f3f46] shadow-sm',
    // Outline: Transparent
    outline: 'bg-transparent text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100',
    // Ghost
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
    // Danger
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}

      {!isLoading && leftIcon && <span className="mr-2 -ml-1 w-4 h-4 flex items-center justify-center">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2 -mr-1 w-4 h-4 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;