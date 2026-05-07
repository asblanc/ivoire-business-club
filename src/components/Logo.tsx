// Logo.tsx — Composant Logo IBC
// Reprend exactement le style de la navbar : image + texte harmonieux

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
  // Tailles du conteneur image selon size
  const containerSize = {
    sm: { box: 36, img: 32 },
    md: { box: 48, img: 44 },
    lg: { box: 60, img: 56 },
    xl: { box: 80, img: 74 },
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
      {/* ===== CONTENEUR IMAGE LOGO ===== */}
      <div
        style={{
          width: containerSize.box,
          height: containerSize.box,
          borderRadius: '8px',
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!imgError ? (
          <img
            src="/ibc-logo.jpeg"
            alt="IBC — Ivoire Business Club"
            style={{
              width: containerSize.img,
              height: containerSize.img,
              objectFit: 'contain',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback si image absente */
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1B5E35, #2E8B57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F0C040',
              fontWeight: 900,
              fontSize: titleSize,
              letterSpacing: '0.05em',
            }}
          >
            IBC
          </div>
        )}
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
