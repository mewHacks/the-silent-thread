
import React from 'react';

interface AtmosphereProps {
  imageUrl: string;
  effect?: 'shake' | 'flash' | 'heartbeat' | 'none';
  overrideEffect?: string | null;
  sanity: number;
}

const Atmosphere: React.FC<AtmosphereProps> = ({ imageUrl, effect, overrideEffect, sanity }) => {
  // Calculate vignette intensity based on sanity (lower sanity = darker/redder edges)
  const vignetteOpacity = Math.max(0.4, 1 - (sanity / 150)); 
  const colorOverlay = sanity < 30 ? 'bg-red-900/30' : 'bg-blue-900/10';
  
  // Determine active visual effect class
  // Override effect (like dice shake) takes precedence
  const activeEffectClass = overrideEffect || (effect === 'none' ? '' : effect);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-transform duration-200 ${activeEffectClass}`}>
       
       {/* Base Background */}
       <div 
         className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
         style={{ backgroundImage: `url(${imageUrl})` }}
       />

       {/* Fog Animation Layers - Added blend mode for better integration */}
       <div className="fog-layer z-10 opacity-30 mix-blend-screen" />
       <div className="fog-layer-2 z-10 opacity-20 mix-blend-screen" />
       
       {/* Dynamic Vignette - Smoother gradient */}
       <div 
         className="absolute inset-0 z-20 transition-all duration-1000"
         style={{ 
            background: `radial-gradient(circle at center, transparent 20%, rgba(0,0,0,${vignetteOpacity * 0.5}) 60%, rgba(0,0,0,1) 100%)`
         }} 
       />
       
       {/* Flash Effect */}
       {effect === 'flash' && (
           <div className="absolute inset-0 bg-white/40 animate-pulse mix-blend-overlay z-50" />
       )}

       {/* Grain & Noise */}
       <div className="absolute inset-0 bg-[url('./images/noise.svg')] opacity-15 mix-blend-overlay z-30" />
       
       {/* Mood Overlay */}
       <div className={`absolute inset-0 ${colorOverlay} mix-blend-multiply z-20 transition-colors duration-1000`} />
    </div>
  );
};

export default Atmosphere;
