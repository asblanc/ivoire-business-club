import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginViewProps {
  onBack: () => void;
  onRegisterMember: () => void;
  onRegisterPartner: () => void;
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  onBack, 
  onRegisterMember, 
  onRegisterPartner,
  onSuccess 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError('Identifiants invalides ou erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-4">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 flex items-center gap-2 text-brand-green-dark/40 hover:text-brand-green-dark transition-colors font-black text-[10px] uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] bg-white rounded-none border-t-4 border-brand-gold shadow-[0_20px_60px_rgba(27,94,53,0.12)] overflow-hidden"
      >
        <div className="p-10 lg:p-12 text-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-brand-green-dark text-brand-gold flex items-center justify-center rounded-none mx-auto mb-8 shadow-lg font-serif font-black text-xl border-2 border-brand-gold/20">
            IBC
          </div>

          <h2 className="text-3xl font-serif font-black text-brand-green-dark italic mb-3">
            Connexion à IBC
          </h2>
          <p className="text-sm font-serif italic text-brand-green-dark/60 mb-10">
            Accédez à votre espace personnel
          </p>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-xs font-bold uppercase tracking-widest text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green-dark" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-brand-cream/30 border border-brand-cream focus:border-brand-gold rounded-none outline-none transition-all font-serif italic"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Mot de passe</label>
                <button type="button" className="text-[10px] font-bold text-brand-gold uppercase tracking-wider hover:no-underline font-black">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green-dark" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full pl-12 pr-12 py-4 bg-brand-cream/30 border border-brand-cream focus:border-brand-gold rounded-none outline-none transition-all font-serif italic"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-sm uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all shadow-premium mt-4 disabled:opacity-50 shimmer"
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4 text-brand-green-dark/10">
            <div className="h-px flex-1 bg-brand-green-dark/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">ou</span>
            <div className="h-px flex-1 bg-brand-green-dark/10" />
          </div>

          <div className="space-y-4">
            <button 
              onClick={onRegisterMember}
              className="w-full py-4 border-2 border-brand-green-dark text-brand-green-dark font-black text-[10px] uppercase tracking-[0.2em] rounded-none hover:bg-brand-green-dark hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Je m'inscris comme Membre
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onRegisterPartner}
              className="w-full py-4 border-2 border-brand-gold text-brand-gold font-black text-[10px] uppercase tracking-[0.2em] rounded-none hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Je rejoins comme Partenaire
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
