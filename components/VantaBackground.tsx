import React, { useState, useEffect, useRef } from 'react';

// Vanta needs to be attached to the window object if using CDN
declare global {
  interface Window {
    VANTA: {
      GLOBE: (options: any) => any;
    };
  }
}

const VantaBackground: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(window.VANTA.GLOBE({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x330df2,
        backgroundColor: 0x131022,
        size: 1.20,
      }));
    }
    // Cleanup function to destroy the vanta instance when the component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="relative min-h-screen w-full">
        {children}
    </div>
  );
};

export default VantaBackground;
