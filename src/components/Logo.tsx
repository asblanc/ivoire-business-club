// Logo.tsx — IVOIRE BUSINESS CLUB
// Logo dans un cercle esthétique avec bordure dorée et ombre

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
  // Taille du cercle et de l'image
  const circleSize = { sm: 40, md: 52, lg: 66, xl: 88 }[size];
  const imgSize    = { sm: 28, md: 38, lg: 48, xl: 64 }[size];

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

  // Couleur de la bordure du cercle selon le fond
  const ringColor = variant === 'white' ? '#F0C040' : '#C9A84C';
  const shadowColor = variant === 'white'
    ? '0 0 0 2px rgba(240,192,64,0.25), 0 4px 16px rgba(240,192,64,0.20)'
    : '0 0 0 2px rgba(201,168,76,0.25), 0 4px 16px rgba(27,94,53,0.15)';

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>

      {/* ===== CERCLE LOGO ===== */}
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          border: `2.5px solid ${ringColor}`,
          boxShadow: shadowColor,
          background: 'rgba(255,255,255,0.92)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <img
          src={ibcLogo}
          alt="IBC — Ivoire Business Club"
          style={{
            width: imgSize,
            height: imgSize,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

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
