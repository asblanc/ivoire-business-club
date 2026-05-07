import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { X, Mail, Lock, User, Shield, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'member' | 'partner'>('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
        
        // Création du profil Firestore
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name,
          email,
          role,
          memberId: 'IBC-' + Math.floor(100000 + Math.random() * 900000),
          status: 'BRONZE',
          balance: 0,
          createdAt: new Date().toISOString()
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-green-dark/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-brand-green-dark border-2 border-brand-gold shadow-premium overflow-hidden"
          >
            <div className="p-10">
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 text-brand-gold opacity-40 hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <Logo size="lg" className="mb-6 mx-auto" />
                <h2 className="font-serif font-black italic text-3xl mb-3 text-white">
                  {isLogin ? 'Accès au Club' : 'Devenir Membre'}
                </h2>
                <p className="label-caps !opacity-40 text-brand-gold">
                  {isLogin ? 'Identifiants Privilégiés' : 'Rejoindre l\'élite ivoirienne'}
                </p>
              </div>

              {error && <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-4 w-5 h-5 text-brand-gold/30" />
                      <input
                        type="text"
                        placeholder="NOM COMPLET"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-brand-gold outline-none transition-all font-serif italic text-white placeholder:text-white/20"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('member')}
                        className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-black border transition-all ${role === 'member' ? 'bg-brand-gold text-brand-green-dark border-brand-gold' : 'bg-white/5 border-white/10 text-white/40'}`}
                      >
                        Membre
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('partner')}
                        className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-black border transition-all ${role === 'partner' ? 'bg-brand-gold text-brand-green-dark border-brand-gold' : 'bg-white/5 border-white/10 text-white/40'}`}
                      >
                        Partenaire
                      </button>
                    </div>
                  </>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-brand-gold/30" />
                  <input
                    type="email"
                    placeholder="ADRESSE EMAIL"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-brand-gold outline-none transition-all font-serif italic text-white placeholder:text-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-brand-gold/30" />
                  <input
                    type="password"
                    placeholder="MOT DE PASSE"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-brand-gold outline-none transition-all font-serif italic text-white placeholder:text-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-brand-gold text-brand-green-dark font-black text-[12px] uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-50 shimmer"
                >
                  {loading ? 'Traitement...' : isLogin ? 'Se Connecter' : 'Valider mon Inscription'}
                </button>
              </form>

              <div className="mt-12 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold/60 hover:text-brand-gold transition-colors"
                >
                  {isLogin ? 'PAS ENCORE MEMBRE ? REJOINDRE LE CLUB' : 'DÉJÀ MEMBRE ? S\'IDENTIFIER'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
