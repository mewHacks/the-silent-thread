import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  spinning?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 64, spinning = false }) => {
  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
        fill="none"
        stroke="currentColor"
      >
        <defs>
          {/* Glow for thread & needle */}
          <filter id="glow-thread" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow for eye */}
          <filter id="glow-eye" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Mystical Eye */}
        <g className="drop-shadow-[0_0_5px_currentColor]">
          {/* Sclera */}
          <path 
            d="M5 50 C 30 25, 70 25, 95 50 C 70 75, 30 75, 5 50 Z" 
            strokeWidth="1.5"
            className="fill-black/70"
          />
          {/* Iris ring */}
          <circle cx="50" cy="50" r="14" strokeWidth="0.5" className="opacity-70 stroke-current" />
          <circle cx="50" cy="50" r="18" strokeWidth="0.2" className="opacity-40 stroke-current" strokeDasharray="1 2" />
          {/* Diamond Pupil */}
          <path 
            d="M50 38 L62 50 L50 62 L38 50 Z" 
            fill="currentColor" 
            filter="url(#glow-eye)"
          />
          {/* Inner highlight */}
          <circle cx="53" cy="45" r="1.5" fill="white" className="opacity-80" />
        </g>

        {/* White Thread & Needle */}
        <g className={`${spinning ? 'animate-[spin_20s_linear_infinite]' : ''} origin-center`}>
          {/* Needle */}
          <path d="M20 80 L 80 20" strokeWidth="1" className="opacity-80" />
          <path d="M 76 24 L 84 16 L 82 14 L 74 22 Z" fill="currentColor" stroke="none" />
          
          {/* Complex Spiral Thread */}
          <path 
            d="M84 16 
               C110 -10, 110 60, 80 85 
               C55 105, 10 90, 10 50 
               C10 20, 40 10, 60 25 
               C70 30, 75 45, 50 60" 
            strokeWidth="1.5"
            strokeLinecap="round"
            stroke="#ffffff"  // white
            filter="url(#glow-thread)"
            className="opacity-90"
          />
          {/* Tail */}
          <path 
            d="M 84 16 C 85 10, 90 10, 95 5" 
            strokeWidth="0.5" 
            stroke="#ffffff"  // white
            className="opacity-70"
          />
        </g>
      </svg>

      {/* Atmospheric Glow */}
      <div className="absolute inset-0 bg-white opacity-10 blur-[20px] rounded-full animate-pulse pointer-events-none" />
    </div>
  );
};

export default Logo;
