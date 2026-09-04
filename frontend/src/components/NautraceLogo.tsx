import React from 'react';

interface NautraceLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'glass';
  showSubtitle?: boolean;
}

export const NautraceLogo: React.FC<NautraceLogoProps> = ({ 
  size = 'md', 
  variant = 'light',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
  };


  const currentSize = iconSizes[size];

  return (
    <div className="flex items-center gap-3 select-none cursor-pointer group" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      {/* Bespoke Geometric Vector Icon */}
      <div 
        style={{ 
          width: currentSize, 
          height: currentSize,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(59, 130, 246, 0.25) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
          overflow: 'hidden'
        }}
      >
        <svg 
          width={currentSize * 0.75} 
          height={currentSize * 0.75} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radar Waves / Sonar Sweep */}
          <circle cx="16" cy="16" r="13" stroke="url(#nautrace-grad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="16" cy="16" r="8" stroke="url(#nautrace-grad)" strokeWidth="1.5" opacity="0.8" />
          
          {/* Hydrodynamic Forward Wave */}
          <path 
            d="M6 18C10 14 14 20 18 16C22 12 25 15 26 14" 
            stroke="#00f2fe" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M7 21C11 17 15 22 19 18C22 15 24 17 25 17" 
            stroke="#38bdf8" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            opacity="0.7" 
          />
          
          {/* Central Compass Crosshair */}
          <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
          <path d="M16 3V7M16 25V29M3 16H7M25 16H29" stroke="#00f2fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

          {/* Gradients */}
          <defs>
            <linearGradient id="nautrace-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00f2fe" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Dynamic Sweep Light */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
            pointerEvents: 'none'
          }} 
        />
      </div>

      {/* Typography */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div 
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 800,
            fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.2rem' : '0.95rem',
            letterSpacing: '0.12em',
            color: variant === 'dark' ? '#0f172a' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          NAUTRACE
          <span 
            style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: '#00f2fe',
              boxShadow: '0 0 8px #00f2fe'
            }} 
          />
        </div>
        {showSubtitle && (
          <div 
            style={{ 
              fontSize: '0.62rem', 
              fontWeight: 600,
              letterSpacing: '0.14em', 
              color: variant === 'dark' ? '#64748b' : '#94a3b8',
              textTransform: 'uppercase',
              marginTop: '-2px'
            }}
          >
            Oceanic Forensic Intelligence
          </div>
        )}
      </div>
    </div>
  );
};
