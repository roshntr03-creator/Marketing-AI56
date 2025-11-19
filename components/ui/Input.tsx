import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider group-focus-within:text-white transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Dark background #18181b (Zinc 900) instead of white */}
        <input
          id={id}
          className={`w-full bg-[#18181b] border ${error ? 'border-red-500/50' : 'border-[#27272a]'} rounded-lg px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 sm:text-sm shadow-inner ${className}`}
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
        <label htmlFor={id} className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider group-focus-within:text-white transition-colors">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-[#18181b] border ${error ? 'border-red-500/50' : 'border-[#27272a]'} rounded-lg px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 sm:text-sm shadow-inner ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};