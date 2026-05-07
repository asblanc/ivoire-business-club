import React from 'react';
import logoImage from '../assets/ibc-logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center overflow-hidden rounded-lg shadow-premium`}>
      <img 
        src={logoImage} 
        alt="IBC Logo" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};
