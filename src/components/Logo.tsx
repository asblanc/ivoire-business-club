// Logo.tsx — Composant Logo IBC
// Logo sans fond : image directe, couronne visible, style harmonieux

import React from 'react';

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
  // Taille de l'image selon size
  const imgSize = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72,
  }[size];

  // Taille du texte principal
  const titleSize = {
    sm: '11px',
    md: '14px',
    lg: '17px',
    xl: '22px',
  }[size];

  // Taille du sous-titre
  const subSize = {
    sm: '7px',
    md: '8px',
    lg: '9px',
    xl: '11px',
  }[size];

  // Couleurs selon variant
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

  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>
      {/* ===== IMAGE LOGO SANS FOND ===== */}
      {!imgError ? (
        <img
          src="/ibc-logo.jpeg"
          alt="IBC — Ivoire Business Club"
          style={{
            width: imgSize,
            height: imgSize,
            objectFit: 'contain',
            flexShrink: 0,
            display: 'block',
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback texte si image absente */
        <span
          style={{
            width: imgSize,
            height: imgSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: titleSize,
            color: titleColor,
            flexShrink: 0,
          }}
        >
          IBC
        </span>
      )}

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
