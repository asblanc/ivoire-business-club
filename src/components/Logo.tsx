// Logo.tsx — Composant Logo IBC
// Utilise src/assets/ibc-logo.png (import Vite)

import React from 'react';
import ibcLogo from '../assets/ibc-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  showText = true,
  className = '',
}) => {
  const imgSize = { sm: 32, md: 44, lg: 56, xl: 72 }[size];

  const titleSize = { sm: '11px', md: '14px', lg: '17px', xl: '22px' }[size];
  const subSize   = { sm: '7px',  md: '8px',  lg: '9px',  xl: '11px' }[size];

  const titleColor = {
    default: '#1B5E35',
    white:   '#FFFFFF',
    dark:    '#154A2C',
  }[variant];

  const subColor = {
    default: '#C9A84C',
    white:   '#F0C040',
    dark:    '#C9A84C',
  }[variant];

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>
      {/* ===== IMAGE LOGO SANS FOND ===== */}
      <img
        src={ibcLogo}
        alt="IBC — Ivoire Business Club"
        style={{
          width: imgSize,
          height: imgSize,
          objectFit: 'contain',
          flexShrink: 0,
          display: 'block',
        }}
      />

      {/* ===== TEXTE LOGO ===== */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 900,
              fontSize: titleSize,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              color: titleColor,
            }}
          >
            Ivoire Business Club
          </span>
          <span
            style={{
              fontSize: subSize,
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              fontWeight: 900,
              color: subColor,
              marginTop: '2px',
            }}
          >
            Prestige &amp; Excellence
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
