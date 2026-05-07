import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { Logo } from './Logo';

interface NavbarProps {
  user: any;
  profile: any;
  onAuthClick: () => void;
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, profile, onAuthClick, onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500 ${scrolled ? 'bg-white shadow-premium' : 'bg-transparent'} ${!scrolled && !user ? 'border-b border-white/10' : 'border-b-2 border-brand-gold'}`}>
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex justify-between h-full items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div className="hidden sm:flex flex-col">
              <span className={`font-serif font-black text-lg tracking-tighter leading-none uppercase italic transition-colors duration-500 ${scrolled ? 'text-brand-green-dark' : 'text-white'}`}>
                Ivoire Business Club
              </span>
              <span className={`text-[7px] uppercase tracking-[0.5em] font-black transition-colors duration-500 ${scrolled ? 'text-brand-gold' : 'text-brand-gold-light'}`}>Prestige & Excellence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-10">
            {['Accueil', 'Nos Partenaires', 'Avantages', 'Contact'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase().replace(' ', '-')}`} 
                className={`text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 no-underline hover:no-underline ${scrolled ? 'text-brand-green-dark hover:text-brand-gold' : 'text-white hover:text-brand-gold-light'}`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black tracking-widest text-brand-gold uppercase">{profile?.status || 'Membre'}</p>
                  <p className={`text-xs font-serif italic font-bold leading-none transition-colors duration-500 ${scrolled ? 'text-brand-green-dark' : 'text-white'}`}>{profile?.name || user.displayName}</p>
                </div>
                <button
                  onClick={() => signOut(auth)}
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 rounded-none ${scrolled ? 'border-brand-green/10 text-brand-green-dark hover:bg-brand-green hover:text-white' : 'border-white/20 text-white hover:bg-white hover:text-brand-green-dark'}`}
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6 md:gap-10">
                <button
                  onClick={onAuthClick}
                  className={`text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 no-underline hover:no-underline ${scrolled ? 'text-brand-green-dark hover:text-brand-gold' : 'text-white hover:text-brand-gold-light'}`}
                >
                  Connexion
                </button>
                <button
                  onClick={onRegisterClick}
                  className={`px-8 py-3.5 rounded-none text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 ${scrolled ? 'bg-brand-green text-brand-gold-light hover:brightness-110' : 'bg-brand-green text-brand-gold-light hover:brightness-110'}`}
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
