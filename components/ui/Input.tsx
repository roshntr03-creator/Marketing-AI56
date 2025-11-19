import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider group-focus-within:text-primary transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={`w-full bg-background-dark/50 border ${error ? 'border-red-500/50' : 'border-surface-border'} rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider group-focus-within:text-primary transition-colors">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-background-dark/50 border ${error ? 'border-red-500/50' : 'border-surface-border'} rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};