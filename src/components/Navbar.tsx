// Navbar.tsx — Barre de navigation IVOIRE BUSINESS CLUB
// Corrections : logo bien dimensionné, menu sans chevauchement, responsive mobile

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
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">

            {/* ===== LOGO IBC ===== */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Image logo réelle */}
              <img
                src="/ibc-logo.png"
                alt="IBC"
                className="h-12 w-12 object-contain flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }}
              />
              {/* Fallback texte si logo absent */}
              <div
                className="h-12 w-12 rounded-full items-center justify-center font-black text-[#F0C040] text-sm flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #1B5E35, #154A2C)',
                  border: '2px solid #C9A84C',
                  display: 'none',
                }}
              >
                IBC
              </div>
              {/* Texte logo — masqué sur petits écrans */}
              <div className="hidden sm:block">
                <div
                  className={`font-black uppercase tracking-wider text-sm leading-none transition-colors duration-300 ${
                    scrolled ? 'text-[#1B5E35]' : 'text-white'
                  }`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  IVOIRE
                </div>
                <div
                  className="font-black uppercase tracking-wider text-sm leading-none text-[#C9A84C]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  BUSINESS CLUB
                </div>
              </div>
            </div>

            {/* ===== LIENS DE NAVIGATION (desktop) ===== */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-300 hover:text-[#C9A84C] ${
                    scrolled ? 'text-[#1B5E35]' : 'text-white/90'
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* ===== ACTIONS (desktop) ===== */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Badge statut */}
                  <div className="hidden xl:flex flex-col items-end">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C, #F0C040)',
                        color: '#1B5E35',
                      }}
                    >
                      {profile?.status || 'BRONZE'}
                    </span>
                    <span
                      className={`text-xs font-semibold mt-0.5 ${
                        scrolled ? 'text-[#1B5E35]' : 'text-white'
                      }`}
                    >
                      {profile?.name || user.displayName || 'Membre'}
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
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onAuthClick}
                    className={`text-xs font-black uppercase tracking-widest px-5 h-9 border transition-all duration-300 whitespace-nowrap ${
                      scrolled
                        ? 'border-[#1B5E35] text-[#1B5E35] hover:bg-[#1B5E35] hover:text-[#F0C040]'
                        : 'border-white/50 text-white hover:bg-white hover:text-[#1B5E35]'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="text-xs font-black uppercase tracking-widest px-5 h-9 whitespace-nowrap transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #F0C040)',
                      color: '#1B5E35',
                    }}
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </div>

            {/* ===== BURGER MENU (mobile/tablet) ===== */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className={`w-6 h-6 ${scrolled ? 'text-[#1B5E35]' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? 'text-[#1B5E35]' : 'text-white'}`} />
              )}
            </button>

          </div>
        </div>

        {/* ===== MENU MOBILE DEROULANT ===== */}
        {mobileOpen && (
          <div
            className="lg:hidden bg-white border-t-2 border-[#C9A84C] shadow-xl"
            style={{ borderTop: '2px solid #C9A84C' }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-xs font-black uppercase tracking-widest text-[#1B5E35] py-3 border-b border-[#E8E5DC] hover:text-[#C9A84C] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link}
                </a>
              ))}
              {/* Actions mobile */}
              <div className="flex gap-3 pt-3">
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
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
