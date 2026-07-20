import React from 'react';
import { PHI } from '../../lib/sacred-geometry';

interface SacredOverlayProps {
  show: boolean;
}

export const SacredOverlay: React.FC<SacredOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden opacity-35 transition-opacity duration-700">
      
      {/* Golden Spiral / Circle Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-sky-500/20 animate-subtle-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[494px] h-[494px] rounded-full border border-indigo-500/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[305px] h-[305px] rounded-full border border-sky-400/25" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[188px] h-[188px] rounded-full border border-indigo-400/30" />
      
      {/* Harmonic Axis Lines */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-sky-500/25 to-transparent" />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-sky-500/25 to-transparent" />
      
      {/* Golden Ratio Proportion Grid Lines (61.8% / 38.2%) */}
      <div className="absolute top-0 bottom-0 left-[61.8%] w-[1px] border-l border-dashed border-sky-400/15" />
      <div className="absolute top-0 bottom-0 left-[38.2%] w-[1px] border-l border-dashed border-sky-400/15" />
      <div className="absolute left-0 right-0 top-[61.8%] h-[1px] border-t border-dashed border-sky-400/15" />
      <div className="absolute left-0 right-0 top-[38.2%] h-[1px] border-t border-dashed border-sky-400/15" />

      {/* Harmonic Mathematical HUD labels */}
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-sky-400/70 bg-black/60 p-2 rounded border border-sky-500/30">
        <div>HARMONIC BASE: 432.000 HZ</div>
        <div>GOLDEN RATIO (Φ): {PHI.toFixed(7)}</div>
        <div>GRID MODE: SACRED PROPORTIONS</div>
      </div>
    </div>
  );
};
