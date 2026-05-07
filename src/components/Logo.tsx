// Logo.tsx — Composant Logo IBC
// Affiche le vrai logo JPEG depuis /public/ibc-logo.jpeg
// Fallback automatique vers logo textuel si image absente

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
  const imgSize = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }[size];

  const textSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }[size];

  const ivoireColor = {
    default: '#1B5E35',
    white:   '#FFFFFF',
    dark:    '#154A2C',
  }[variant];

  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>

      {/* ===== IMAGE LOGO RÉELLE (ibc-logo.jpeg dans /public/) ===== */}
      {!imgError ? (
        <img
          src="/ibc-logo.jpeg"
          alt="IBC - Ivoire Business Club"
          className={`${imgSize} object-contain flex-shrink-0`}
          style={{ maxWidth: 'none' }}
          onError={() => setImgError(true)}
        />
      ) : (
        /* ===== FALLBACK : cercle vert avec texte IBC ===== */
        <div
          className={`${imgSize} rounded-full flex items-center justify-center font-black text-[#F0C040] flex-shrink-0`}
          style={{
            background: 'linear-gradient(135deg, #1B5E35 0%, #154A2C 100%)',
            border: '2px solid #C9A84C',
            fontSize: size === 'sm' ? '9px' : size === 'xl' ? '16px' : '11px',
            letterSpacing: '0.05em',
          }}
        >
          IBC
        </div>
      )}

      {/* ===== TEXTE LOGO ===== */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black uppercase tracking-wider ${textSize} leading-tight`}
            style={{
              fontFamily: '"Playfair Display", serif',
              color: ivoireColor,
              letterSpacing: '0.12em',
            }}
          >
            IVOIRE
          </span>
          <span
            className={`font-black uppercase tracking-wider ${textSize} leading-tight`}
            style={{
              fontFamily: '"Playfair Display", serif',
              color: '#C9A84C',
              letterSpacing: '0.12em',
            }}
          >
            BUSINESS CLUB
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
