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
  
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg overflow-hidden group tracking-wide active:scale-95';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/30 border border-transparent hover:shadow-primary/50 hover:-translate-y-0.5',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10 backdrop-blur-sm hover:border-white/20 shadow-lg shadow-black/10',
    outline: 'bg-transparent text-text-primary border border-surface-border hover:border-primary hover:text-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {leftIcon && <span className="w-5 h-5 flex items-center justify-center">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="w-5 h-5 flex items-center justify-center">{rightIcon}</span>}
      </span>
      
      {/* Shine Effect for primary buttons */}
      {variant === 'primary' && !disabled && !isLoading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
      )}
    </button>
  );
};

export default Button;