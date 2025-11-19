import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo_gradient_main" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Abstract Prism/Hex-Node Shape */}
      <path
        d="M20 4L36 12V28L20 36L4 28V12L20 4Z"
        fill="url(#logo_gradient_main)"
        fillOpacity="0.15"
        stroke="url(#logo_gradient_main)"
        strokeWidth="1.5"
        className="animate-pulse-slow"
      />
      
      {/* Inner refractive lines */}
      <path
        d="M20 4V20M20 20L36 12M20 20L4 12"
        stroke="url(#logo_gradient_main)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      <path
        d="M20 36V20M20 20L36 28M20 20L4 28"
        stroke="url(#logo_gradient_main)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Core Node */}
      <circle cx="20" cy="20" r="3" fill="#fff" filter="url(#glow)" className="animate-pulse" />
    </svg>
);