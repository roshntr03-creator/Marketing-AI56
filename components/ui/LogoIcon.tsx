import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Abstract M shape composed of a growth chart concept */}
      <path
        d="M3 20V13L9 6L14 13L18 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      />
      <circle cx="18" cy="9" r="2.5" className="fill-primary" />
      <path
        d="M21 4L21 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-primary"
        opacity="0.8"
      />
      <path
        d="M3 20H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-white/20"
      />
    </svg>
);