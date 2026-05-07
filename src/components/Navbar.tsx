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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src="/ibc-logo.jpeg"
              alt="IBC Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
              }}
            />
            <span className="ml-2 font-bold text-ibc-green text-sm hidden sm:block whitespace-nowrap">
              IVOIRE BUSINESS CLUB
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Bonjour, {profile?.firstName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors whitespace-nowrap"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="flex items-center gap-1 text-sm text-ibc-green hover:text-ibc-dark transition-colors whitespace-nowrap"
                >
                  <User size={16} />
                  Connexion
                </button>
                <button
                  onClick={onRegisterClick}
                  className="bg-ibc-green text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-ibc-dark transition-colors whitespace-nowrap"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-md text-ibc-green"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {user ? (
            <>
              <p className="text-sm text-gray-600">
                Bonjour, {profile?.firstName || user.email}
              </p>
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm text-red-500 w-full"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { onAuthClick(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm text-ibc-green w-full"
              >
                <User size={16} />
                Connexion
              </button>
              <button
                onClick={() => { onRegisterClick(); setMobileOpen(false); }}
                className="bg-ibc-green text-white px-4 py-2 rounded-full text-sm font-medium w-full text-center"
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
