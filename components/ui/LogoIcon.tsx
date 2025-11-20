import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Primary Facet Gradient */}
        <linearGradient id="facetPrimary" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" /> {/* Indigo 400 */}
          <stop offset="50%" stopColor="#6366f1" /> {/* Indigo 500 */}
          <stop offset="100%" stopColor="#4f46e5" /> {/* Indigo 600 */}
        </linearGradient>

        {/* Secondary Facet Gradient (Darker/Shadow) */}
        <linearGradient id="facetDark" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4338ca" /> {/* Indigo 700 */}
          <stop offset="100%" stopColor="#312e81" /> {/* Indigo 900 */}
        </linearGradient>

        {/* Highlight Gradient */}
        <linearGradient id="facetLight" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.1" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="glow-logo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#glow-logo)">
          {/* Background Glow/Aura */}
          <circle cx="50" cy="50" r="35" fill="#6366f1" fillOpacity="0.15" className="animate-pulse" style={{animationDuration: '4s'}} />

          {/* Main Structure: Abstract Crystalline M */}
          
          {/* Left Vertical Facet */}
          <path d="M25 25 L40 35 V80 L25 70 V25 Z" fill="url(#facetDark)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          
          {/* Right Vertical Facet */}
          <path d="M60 35 L75 25 V70 L60 80 V35 Z" fill="url(#facetDark)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

          {/* Center V Structure (The "Valley") */}
          <path d="M40 35 L50 50 L60 35 L50 20 Z" fill="#a5b4fc" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <path d="M40 35 L50 50 V90 L40 80 V35 Z" fill="url(#facetPrimary)" />
          <path d="M60 35 L50 50 V90 L60 80 V35 Z" fill="url(#facetPrimary)" />

          {/* Top Highlights (Glassy Caps) */}
          <path d="M25 25 L40 35 L50 20 L35 10 Z" fill="url(#facetLight)" fillOpacity="0.8" />
          <path d="M75 25 L60 35 L50 20 L65 10 Z" fill="url(#facetLight)" fillOpacity="0.6" />

          {/* Connecting Edges (Wireframe aesthetic) */}
          <path d="M25 25 L35 10 L50 20 L65 10 L75 25" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M50 20 V90" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />

          {/* Floating Particles around the crystal */}
          <circle cx="20" cy="20" r="2" fill="#a5b4fc" className="animate-bounce" style={{animationDuration: '3s'}} />
          <circle cx="80" cy="85" r="2" fill="#818cf8" className="animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}} />
          <circle cx="85" cy="30" r="1.5" fill="#c7d2fe" className="animate-bounce" style={{animationDuration: '5s', animationDelay: '0.5s'}} />
      </g>
    </svg>
);