import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="4" y1="19" x2="19" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Abstract Graph M */}
      <path
        d="M4 19V12L9 7L14 12L19 6"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="6" r="2" className="fill-indigo-500" stroke="none" />
      <circle cx="9" cy="7" r="1.5" className="fill-indigo-400/50" stroke="none" />
      
      {/* Glow effect */}
      <path
        d="M4 19V12L9 7L14 12L19 6"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-10 blur-sm text-indigo-500"
      />
    </svg>
);