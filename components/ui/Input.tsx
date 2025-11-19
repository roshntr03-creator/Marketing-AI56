import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={`w-full bg-[#09090b] border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 text-sm shadow-[0px_1px_2px_rgba(0,0,0,0.2)_inset] ${className}`}
          style={{ backgroundColor: '#09090b', color: 'white', backgroundImage: 'none' }} 
          autoComplete="off"
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
        <label htmlFor={id} className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-[#09090b] border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 text-sm shadow-[0px_1px_2px_rgba(0,0,0,0.2)_inset] ${className}`}
        style={{ backgroundColor: '#09090b', color: 'white', backgroundImage: 'none' }}
        autoComplete="off"
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};