
import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  id: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label, id }) => {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer">
      <span className="text-text-primary text-sm">{label}</span>
      <div className="relative">
        <input id={id} type="checkbox" className="sr-only" checked={enabled} onChange={() => onChange(!enabled)} />
        <div className={`block w-12 h-6 rounded-full transition ${enabled ? 'bg-primary' : 'bg-background-dark-soft border border-border-dark'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};

export default Toggle;
