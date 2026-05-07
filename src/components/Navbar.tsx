// Navbar.tsx — IVOIRE BUSINESS CLUB
// Version restaurée + logo ibc-logo.jpeg + design UI/UX harmonieux

import React, { useState, useEffect } from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

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

  return (
    <>
      {/* ===== NAVBAR PRINCIPALE ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-[0_2px_20px_rgba(27,94,53,0.10)] border-b-2 border-[#C9A84C]'
            : 'bg-transparent border-b border-white/10'
        }`}
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* ===== LOGO IBC ===== */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Image logo réelle */}
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg shadow-premium">
                <img
                  src="/ibc-logo.jpeg"
                  alt="IBC Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fb = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = 'flex';
                  }}
                />
                {/* Fallback texte si logo absent */}
                <div
                  className="hidden w-full h-full items-center justify-center text-white font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #1B5E35, #2E8B57)', display: 'none' }}
                >
                  IBC
                </div>
              </div>
              {/* Texte logo */}
              <div className="hidden sm:flex flex-col leading-none">
                <span
                  className={`font-serif font-black text-base tracking-tighter uppercase italic transition-colors duration-300 ${
                    scrolled ? 'text-[#1B5E35]' : 'text-white'
                  }`}
                >
                  Ivoire Business Club
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.4em] font-black transition-colors duration-300 ${
                    scrolled ? 'text-[#C9A84C]' : 'text-[#F0C040]/90'
                  }`}
                >
                  Prestige &amp; Excellence
                </span>
              </div>
            </div>

            {/* ===== LIENS DE NAVIGATION (desktop) ===== */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className={`text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative group ${
                    scrolled ? 'text-[#1B5E35] hover:text-[#C9A84C]' : 'text-white/90 hover:text-[#F0C040]'
                  }`}
                >
                  {link}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    scrolled ? 'bg-[#C9A84C]' : 'bg-[#F0C040]'
                  }`} />
                </a>
              ))}
            </div>

            {/* ===== ACTIONS (desktop) ===== */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  {/* Badge statut + nom */}
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C, #F0C040)',
                        color: '#1B5E35',
                        borderColor: '#C9A84C'
                      }}
                    >
                      {profile?.status || 'BRONZE'}
                    </span>
                    <span className={`text-sm font-semibold whitespace-nowrap ${
                      scrolled ? 'text-[#1B5E35]' : 'text-white'
                    }`}>
                      {profile?.firstName || profile?.name || user.displayName || 'Membre'}
                    </span>
                  </div>
                  {/* Bouton déconnexion */}
                  <button
                    onClick={() => signOut(auth)}
                    className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                      scrolled
                        ? 'border-[#C9A84C] text-[#1B5E35] hover:bg-[#1B5E35] hover:text-white hover:border-[#1B5E35]'
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
                    className={`text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 px-4 py-2 border ${
                      scrolled
                        ? 'border-[#1B5E35] text-[#1B5E35] hover:bg-[#1B5E35] hover:text-white'
                        : 'border-white/50 text-white hover:bg-white/10'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="text-sm font-black uppercase tracking-wider text-[#1B5E35] px-5 py-2 whitespace-nowrap transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #F0C040)' }}
                  >
                    S&apos;inscrire
                  </button>
                </>
              )}
            </div>

            {/* ===== BURGER MENU (mobile/tablet) ===== */}
            <button
              className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors ${
                scrolled ? 'text-[#1B5E35]' : 'text-white'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </nav>

      {/* ===== MENU MOBILE DÉROULANT ===== */}
      {mobileOpen && (
        <div
          className="fixed top-[72px] left-0 right-0 z-40 bg-white border-b-2 border-[#C9A84C] shadow-xl px-4 py-4"
        >
          <div className="flex flex-col gap-3 max-w-7xl mx-auto">
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
            {/* Actions mobile */}
            <div className="flex gap-3 mt-2">
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
                    S&apos;inscrire
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
