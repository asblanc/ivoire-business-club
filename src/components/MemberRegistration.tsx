import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  CreditCard,
  Eye,
  EyeOff,
  ShieldCheck,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { db, auth } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface MemberRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const MemberRegistration: React.FC<MemberRegistrationProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    idType: 'CNI',
    idNumber: '',
    email: '',
    phone: '',
    city: 'Abidjan',
    password: '',
    confirmPassword: '',
    acceptCgu: false,
    acceptFees: false
  });

  const generateMemberId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `IBC-${result}`;
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.birthDate && formData.idNumber;
    }
    if (step === 2) {
      return formData.email && formData.phone && formData.city;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.acceptCgu || !formData.acceptFees) {
      setError('Veuillez accepter les conditions et les frais.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const memberId = generateMemberId();
      setGeneratedId(memberId);
      
      const name = `${formData.firstName} ${formData.lastName}`;
      await updateProfile(userCred.user, { displayName: name });

      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        idType: formData.idType,
        idNumber: formData.idNumber,
        birthDate: formData.birthDate,
        role: 'member',
        memberId,
        status: 'BRONZE',
        balance: 0,
        createdAt: new Date().toISOString()
      });

      // Confetti & Modal
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B5E35', '#F0C040', '#C9A84C']
      });

      setIsSuccessModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT SIDE (Mobile: Banner Top / Desktop: Sticky Left) */}
      <div className="lg:w-[42%] lg:sticky lg:top-0 h-[300px] lg:h-screen gradient-hero p-8 lg:p-16 flex flex-col lg:justify-between justify-center text-white overflow-hidden order-1">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', size: '40px 40px' }} />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/5 border border-brand-gold/30 rounded-none flex items-center justify-center text-brand-gold font-serif font-black text-2xl mb-12 shadow-xl">
            IBC
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-serif font-black text-brand-gold mb-6 italic leading-tight">
            Devenez Membre IBC
          </h1>
          
          <p className="text-xl text-white/80 font-serif italic mb-12">
            Consommez, profitez et gagnez du cashback !
          </p>
          
          <ul className="space-y-6 mb-16 hidden lg:block">
            {[
              "Cashback 3% sur chaque dépense",
              "QR Code personnel IBC",
              "Statut de départ : BRONZE",
              "Accès aux offres exclusives partenaires",
              "Portefeuille digital sécurisé"
            ].map((adv, i) => (
              <li key={i} className="flex items-center gap-4 text-lg">
                <CheckCircle2 className="w-6 h-6 text-brand-gold" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" 
              alt="Membres IBC" 
              className="w-24 h-24 rounded-none object-cover border-[3px] border-brand-gold shadow-2xl"
            />
            <div>
              <p className="text-[12px] uppercase tracking-widest font-black text-brand-gold">Programme Elite</p>
              <p className="text-sm italic opacity-60">Rejoignez le réseau n°1 en Côte d'Ivoire</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10 mt-12">
           <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">
             500 FCFA TTC/mois — Prélevé automatiquement
           </p>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="lg:w-[58%] bg-white p-8 lg:p-24 order-2">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-brand-green-dark/40 hover:text-brand-green-dark transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-20 max-w-lg mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-cream -z-10" />
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-none flex items-center justify-center font-black text-sm transition-all duration-500 shadow-lg ${
                step === s ? 'bg-brand-gold text-brand-green-dark' : 
                step > s ? 'bg-brand-green-dark text-white' : 'bg-brand-cream text-brand-green-dark/20'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-[8px] uppercase tracking-widest font-black ${step >= s ? 'text-brand-green-dark' : 'text-brand-green-dark/20'}`}>
                {s === 1 ? 'Identité' : s === 2 ? 'Contact' : 'Sécurité'}
              </span>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm font-serif italic">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type="text" 
                        name="firstName"
                        placeholder="Votre prénom"
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.firstName ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      {formData.firstName && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Nom</label>
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type="text" 
                        name="lastName"
                        placeholder="Votre nom"
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.lastName ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      {formData.lastName && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Date de naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                    <input 
                      type="date" 
                      name="birthDate"
                      className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.birthDate ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                    {formData.birthDate && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Type de pièce</label>
                    <div className="relative">
                      <CreditCard className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <select 
                        name="idType"
                        className="w-full pl-8 pb-4 bg-transparent border-b-2 border-brand-green-dark outline-none transition-all font-serif italic text-lg cursor-pointer"
                        value={formData.idType}
                        onChange={handleInputChange}
                      >
                        <option value="CNI">CNI</option>
                        <option value="Passeport">Passeport</option>
                        <option value="Titre de séjour">Titre de séjour</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Numéro de pièce</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type="text" 
                        name="idNumber"
                        placeholder="Numéro ID"
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.idNumber ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        required
                      />
                      {formData.idNumber && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                   <button 
                     type="button"
                     onClick={() => validateStep() && setStep(2)}
                     disabled={!validateStep()}
                     className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-xs uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-premium"
                   >
                     Étape Suivante
                     <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CONTACT */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Email professionnel ou privé</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="votre@email.com"
                      className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.email ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {formData.email.includes('@') && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Téléphone Mobile (+225)</label>
                  <div className="relative">
                    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="07 XX XX XX XX"
                      className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.phone ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    {formData.phone.length >= 8 && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Ville de résidence</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                    <select 
                      name="city"
                      className="w-full pl-8 pb-4 bg-transparent border-b-2 border-brand-green-dark outline-none transition-all font-serif italic text-lg cursor-pointer"
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      <option value="Abidjan">Abidjan</option>
                      <option value="Bouaké">Bouaké</option>
                      <option value="Yamoussoukro">Yamoussoukro</option>
                      <option value="San Pedro">San Pedro</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                   <button 
                     type="button"
                     onClick={() => setStep(1)}
                     className="w-48 py-5 border-2 border-brand-green-dark text-brand-green-dark font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-brand-green-dark hover:text-white transition-all"
                   >
                     Précédent
                   </button>
                   <button 
                     type="button"
                     onClick={() => validateStep() && setStep(3)}
                     disabled={!validateStep()}
                     className="flex-1 py-5 bg-brand-green text-brand-gold-light font-black text-xs uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-premium"
                   >
                     Étape Finale
                     <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SECURITY */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Mot de passe personnel</label>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold flex items-center">
                      <LockIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      placeholder="••••••••"
                      className={`w-full pl-8 pr-12 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.password ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gold"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password Strength Bar */}
                  <div className="flex gap-2 h-1 mt-2">
                    {[1, 2, 3, 4].map((s) => (
                      <div 
                        key={s} 
                        className={`flex-1 transition-all duration-500 ${
                          passwordStrength >= s 
                            ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-brand-gold' : 'bg-brand-green-dark') 
                            : 'bg-brand-cream'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Confirmer mot de passe</label>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold flex items-center">
                      <LockIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      placeholder="••••••••"
                      className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.confirmPassword === formData.password && formData.confirmPassword !== '' ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                   <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          name="acceptCgu"
                          className="peer sr-only"
                          checked={formData.acceptCgu}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="w-6 h-6 border-2 border-brand-cream peer-checked:bg-brand-green-dark peer-checked:border-brand-green-dark transition-all flex items-center justify-center text-white">
                          <CheckCircle2 className="w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-sm italic font-serif text-brand-green-dark/70">J'accepte les Conditions Générales d'Utilisation du Club IBC.</span>
                   </label>

                   <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          name="acceptFees"
                          className="peer sr-only"
                          checked={formData.acceptFees}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="w-6 h-6 border-2 border-brand-cream peer-checked:bg-brand-green-dark peer-checked:border-brand-green-dark transition-all flex items-center justify-center text-white">
                          <CheckCircle2 className="w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-sm italic font-serif text-brand-green-dark/70 font-bold">J'accepte les frais d'abonnement de 500 FCFA/mois.</span>
                   </label>
                </div>

                <div className="pt-8 flex gap-4">
                   <button 
                     type="button"
                     onClick={() => setStep(2)}
                     className="w-48 py-5 border-2 border-brand-green text-brand-green font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-brand-green hover:text-white transition-all"
                   >
                     Précédent
                   </button>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="flex-1 py-6 bg-brand-green text-brand-gold-light font-black text-sm uppercase tracking-[0.4em] rounded-none hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-premium shimmer"
                   >
                     {loading ? 'Création en cours...' : 'Créer mon compte IBC'}
                   </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-green-dark/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-xl bg-brand-green-dark border-2 border-brand-gold p-12 text-center shadow-premium overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 gradient-gold opacity-10 rounded-none -translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 right-0 w-32 h-32 gradient-gold opacity-10 rounded-none translate-x-16 translate-y-16" />

              <div className="w-20 h-20 bg-brand-gold text-brand-green-dark flex items-center justify-center rounded-none mx-auto mb-8 shadow-premium pulse-gold">
                <Award className="w-10 h-10" />
              </div>

              <h2 className="text-4xl font-serif font-black text-brand-gold-light mb-4 italic italic-only tracking-tighter">
                Bienvenue dans la famille IBC ! 🎉
              </h2>
              
              <div className="max-w-xs mx-auto p-8 border-2 border-dashed border-brand-gold/30 mb-8 bg-white/5">
                <p className="label-caps !opacity-100 text-brand-gold mb-6 font-bold">Votre ID MEMBRE CERTIFIÉ</p>
                <p className="text-3xl font-serif font-black text-white italic tracking-widest mb-8">{generatedId}</p>
                
                <div className="mx-auto bg-white p-6 shadow-xl inline-block rounded-none">
                  <QRCodeSVG 
                    value={generatedId} 
                    size={160} 
                    level="H"
                    fgColor="#154A2C"
                  />
                </div>
              </div>

              <p className="text-white/60 font-serif italic mb-10 leading-relaxed">
                Votre QR Code a été généré avec succès. Présentez-le lors de vos visites chez nos partenaires pour cumuler vos avantages.
              </p>

              <button 
                onClick={() => {
                  onSuccess();
                  setIsSuccessModalOpen(false);
                }}
                className="w-full py-5 bg-brand-gold text-brand-green-dark font-black text-sm uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all shadow-premium shimmer"
              >
                Accéder à mon espace membre
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
