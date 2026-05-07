// Navbar.tsx — IVOIRE BUSINESS CLUB
// Logo image arrondie en cercle directement sur l'img

import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import ibcLogo from '../assets/ibc-logo.png';

interface NavbarProps {
  user: any;
  profile: any;
  onAuthClick: () => void;
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, profile, onAuthClick, onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Accueil', 'Partenaires', 'Avantages', 'Contact'];

  const logoSize = 44;
  const ringColor = scrolled ? '#C9A84C' : '#F0C040';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-[0_2px_20px_rgba(27,94,53,0.12)] border-b-2 border-[#C9A84C]'
            : 'bg-transparent border-b border-white/10'
        }`}
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* ===== LOGO DANS HEADER ===== */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img
                src={ibcLogo}
                alt="IBC Logo"
                style={{
                  width: logoSize,
                  height: logoSize,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: `2.5px solid ${ringColor}`,
                  boxShadow: `0 0 0 3px ${ringColor}33, 0 4px 16px rgba(27,94,53,0.18)`,
                  display: 'block',
                  flexShrink: 0,
                }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  style={{
                    fontSize: scrolled ? '15px' : '14px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    color: scrolled ? '#1B5E35' : '#FFFFFF',
                  }}
                >
                  Ivoire Business Club
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4em',
                    fontWeight: 900,
                    color: scrolled ? '#C9A84C' : '#F0C040',
                    marginTop: '2px',
                  }}
                >
                  Prestige &amp; Excellence
                </span>
              </div>
            </div>

            {/* ===== LIENS NAVIGATION (desktop) ===== */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-[#C9A84C] ${
                    scrolled ? 'text-[#1B5E35]' : 'text-white'
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* ===== ACTIONS (desktop) ===== */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                    scrolled ? 'border-[#C9A84C] text-[#1B5E35]' : 'border-white/30 text-white'
                  }`}>
                    <span>{profile?.status || 'BRONZE'}</span>
                    <span>{profile?.firstName || profile?.name || user.displayName || 'Membre'}</span>
                  </div>
                  <button
                    onClick={() => signOut(auth)}
                    className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                      scrolled
                        ? 'border-[#C9A84C] text-[#1B5E35] hover:bg-[#1B5E35] hover:text-white'
                        : 'border-white/30 text-white hover:bg-white hover:text-[#1B5E35]'
                    }`}
                    title="Déconnexion"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onAuthClick}
                    className={`px-4 h-9 text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                      scrolled
                        ? 'border-[#1B5E35] text-[#1B5E35] hover:bg-[#1B5E35] hover:text-[#F0C040]'
                        : 'border-white text-white hover:bg-white hover:text-[#1B5E35]'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="px-4 h-9 text-xs font-black uppercase tracking-widest text-[#1B5E35] transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #F0C040)' }}
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </div>

            {/* ===== BURGER (mobile) ===== */}
            <button
              className={`md:hidden w-10 h-10 flex items-center justify-center ${
                scrolled ? 'text-[#1B5E35]' : 'text-white'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ===== MENU MOBILE ===== */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-[#1B5E35] py-2 border-b border-gray-100 hover:text-[#C9A84C] transition-colors"
              >
                {link}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => { signOut(auth); setMobileOpen(false); }}
                className="flex-1 h-10 border-2 border-[#1B5E35] text-[#1B5E35] text-xs font-black uppercase tracking-widest hover:bg-[#1B5E35] hover:text-[#F0C040] transition-all"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <button
                  onClick={() => { onAuthClick(); setMobileOpen(false); }}
                  className="flex-1 h-10 border-2 border-[#1B5E35] text-[#1B5E35] text-xs font-black uppercase tracking-widest hover:bg-[#1B5E35] hover:text-[#F0C040] transition-all"
                >
                  Connexion
                </button>
                <button
                  onClick={() => { onRegisterClick(); setMobileOpen(false); }}
                  className="flex-1 h-10 text-xs font-black uppercase tracking-widest text-[#1B5E35] transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #F0C040)' }}
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
