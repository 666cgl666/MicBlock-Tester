
import React from 'react';

interface FloatingBadgeProps {
  isActive: boolean;
}

const FloatingBadge: React.FC<FloatingBadgeProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed top-10 left-0 right-0 flex justify-center z-[9999] pointer-events-none px-4">
      <div className="flex items-center gap-3 px-5 py-2.5 bg-red-600/90 text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] backdrop-blur-xl border border-red-400/30 animate-pulse">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
          Mic Stealth Block Active
        </span>
      </div>
    </div>
  );
};

export default FloatingBadge;
