// Logo.tsx — Composant Logo IBC
// Utilise le vrai logo si disponible dans /public/ibc-logo.png
// Sinon affiche le logo textuel SVG aux couleurs officielles IBC

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { img: 'h-8 w-8',  text: 'text-sm' },
  md: { img: 'h-10 w-10', text: 'text-base' },
  lg: { img: 'h-12 w-12', text: 'text-lg' },
  xl: { img: 'h-16 w-16', text: 'text-xl' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  showText = true,
  className = '',
}) => {
  const { img, text } = sizeMap[size];

  const textColor =
    variant === 'white' ? 'text-white' :
    variant === 'dark'  ? 'text-[#154A2C]' :
    'text-[#1B5E35]';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Vrai logo image — place ibc-logo.png dans /public/ */}
      <img
        src="/ibc-logo.png"
        alt="IBC - Ivoire Business Club"
        className={`${img} object-contain`}
        onError={(e) => {
          // Fallback : logo SVG textuel si l'image n'est pas trouvée
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Logo SVG fallback (couleurs IBC officielles) */}
      <div
        className={`${img} rounded-full flex items-center justify-center font-black text-[#F0C040]`}
        style={{
          background: 'linear-gradient(135deg, #1B5E35 0%, #154A2C 100%)',
          border: '2px solid #C9A84C',
          display: 'none', // Affiché uniquement si l'image échoue
          fontSize: size === 'sm' ? '10px' : size === 'xl' ? '16px' : '12px',
        }}
      >
        IBC
      </div>
      {showText && (
        <div>
          <div
            className={`font-black tracking-widest uppercase ${text} ${textColor}`}
            style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.15em' }}
          >
            IVOIRE
          </div>
          <div
            className={`font-black tracking-widest uppercase ${text} text-[#C9A84C]`}
            style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.15em', marginTop: '-4px' }}
          >
            BUSINESS CLUB
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
