import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Camera,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  User,
  Hotel,
  Utensils,
  GlassWater,
  PartyPopper,
  Car,
  CalendarDays
} from 'lucide-react';
import { db, auth } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface PartnerRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

const activityTypes = [
  { id: 'Hotel', label: 'Hôtel', icon: <Hotel className="w-4 h-4" /> },
  { id: 'Restaurant', label: 'Restaurant', icon: <Utensils className="w-4 h-4" /> },
  { id: 'Bar', label: 'Bar/Maquis', icon: <GlassWater className="w-4 h-4" /> },
  { id: 'Loisirs', label: 'Loisirs', icon: <PartyPopper className="w-4 h-4" /> },
  { id: 'Transport', label: 'Transport', icon: <Car className="w-4 h-4" /> },
  { id: 'Evenements', label: 'Événements', icon: <CalendarDays className="w-4 h-4" /> },
  { id: 'Autre', label: 'Autre', icon: <Building2 className="w-4 h-4" /> },
];

const communes = [
  'Cocody', 'Plateau', 'Marcory', 'Yopougon', 'Treichville', 'Adjamé', 'Koumassi', 'Abobo', 'Attécoubé', 'Port-Bouët', 'Bingerville', 'Grand-Bassam', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Autre'
];

export const PartnerRegistration: React.FC<PartnerRegistrationProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    activityType: 'Restaurant',
    registrationNumber: '',
    address: '',
    commune: 'Cocody',
    managerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePartnerId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `IBC-PRO-${result}`;
  };

  const validateStep1 = () => {
    return formData.businessName && formData.registrationNumber && formData.address && formData.commune;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Veuillez accepter les conditions de partenariat.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const partnerId = generatePartnerId();
      setGeneratedId(partnerId);
      
      await updateProfile(userCred.user, { displayName: formData.managerName });

      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        name: formData.managerName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        activityType: formData.activityType,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        commune: formData.commune,
        role: 'partner',
        partnerId,
        status: 'PENDING',
        photoUrl: previewImage,
        createdAt: new Date().toISOString()
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
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', size: '40px 40px' }} />
        
        <div className="relative z-10">
          <Logo size="xl" className="mb-12" />
          
          <h1 className="text-4xl lg:text-5xl font-serif font-black text-brand-gold mb-6 italic leading-tight">
            Devenez Partenaire IBC
          </h1>
          
          <p className="text-xl text-white/80 font-serif italic mb-12">
            Plus de visibilité, plus de clients, plus de résultats !
          </p>
          
          <ul className="space-y-6 mb-16 hidden lg:block">
            {[
              "Flux constant de clients IBC",
              "Visibilité sur la plateforme et réseaux",
              "Référencement de vos services et offres",
              "Programme cashback gagnant-gagnant",
              "Dashboard de suivi des performances"
            ].map((adv, i) => (
              <li key={i} className="flex items-center gap-4 text-lg">
                <CheckCircle2 className="w-6 h-6 text-brand-gold" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" 
              alt="Partenaire IBC" 
              className="w-48 h-32 rounded-none object-cover border-[3px] border-brand-gold shadow-2xl"
            />
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10 mt-12">
           <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">
             Programme B2B IBC — Partenariat Elite
           </p>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="lg:w-[58%] bg-white p-8 lg:p-24 order-2">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-brand-green-dark/40 hover:text-brand-green-dark transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex justify-between items-center mb-20 max-w-sm mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-cream -z-10" />
          {[1, 2].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-none flex items-center justify-center font-black text-sm transition-all duration-500 shadow-lg ${
                step === s ? 'bg-brand-gold text-brand-green-dark' : 
                step > s ? 'bg-brand-green-dark text-white' : 'bg-brand-cream text-brand-green-dark/20'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-[8px] uppercase tracking-widest font-black ${step >= s ? 'text-brand-green-dark' : 'text-brand-green-dark/20'}`}>
                {s === 1 ? 'Etablissement' : 'Contact'}
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
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Nom de la structure</label>
                  <div className="relative">
                    <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                    <input 
                      type="text" 
                      name="businessName"
                      placeholder="Nom de votre établissement"
                      className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.businessName ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                    />
                    {formData.businessName && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Type d'activité</label>
                    <div className="relative">
                      <select 
                        name="activityType"
                        className="w-full pb-4 bg-transparent border-b-2 border-brand-green-dark outline-none transition-all font-serif italic text-lg cursor-pointer"
                        value={formData.activityType}
                        onChange={handleInputChange}
                      >
                        {activityTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Registre de commerce</label>
                    <div className="relative">
                      <FileText className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type="text" 
                        name="registrationNumber"
                        placeholder="RCCM / ID Unique"
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.registrationNumber ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        required
                      />
                      {formData.registrationNumber && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Commune</label>
                    <select 
                      name="commune"
                      className="w-full pb-4 bg-transparent border-b-2 border-brand-green-dark outline-none transition-all font-serif italic text-lg cursor-pointer"
                      value={formData.commune}
                      onChange={handleInputChange}
                    >
                      {communes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Adresse précise</label>
                    <div className="relative">
                      <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type="text" 
                        name="address"
                        placeholder="Rue, Quartier, Repères..."
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.address ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Photo de l'établissement</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group border-2 border-dashed border-brand-gold/30 p-8 text-center cursor-pointer hover:bg-brand-cream/30 transition-all rounded-none overflow-hidden"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                    {previewImage ? (
                      <div className="relative aspect-video">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-none" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">
                          Modifier la photo
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-8">
                        <div className="w-16 h-16 rounded-none flex items-center justify-center text-brand-gold">
                          <Camera className="w-8 h-8" />
                        </div>
                        <p className="text-sm italic font-serif text-brand-green-dark/60">Cliquez pour ajouter une photo</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8">
                   <button 
                     type="button"
                     onClick={() => validateStep1() && setStep(2)}
                     disabled={!validateStep1()}
                     className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-xs uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-premium"
                   >
                     Étape Suivante
                     <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Nom du responsable</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                    <input 
                      type="text" 
                      name="managerName"
                      placeholder="Nom complet"
                      className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.managerName ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.managerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Email professionnel</label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type="email" 
                        name="email"
                        placeholder="votre@etablissement.com"
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.email ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {formData.email.includes('@') && <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Téléphone (+225)</label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Mot de passe</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        name="password"
                        placeholder="••••••••"
                        className={`w-full pl-8 pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.password ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
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
                  </div>
                  <div className="space-y-3">
                    <label className="label-caps !opacity-100 text-[10px] font-black text-brand-green-dark/40">Confirmer</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      placeholder="••••••••"
                      className={`w-full pb-4 bg-transparent border-b-2 outline-none transition-all font-serif italic text-lg ${formData.confirmPassword === formData.password && formData.confirmPassword !== '' ? 'border-brand-green-dark' : 'border-brand-cream focus:border-brand-gold'}`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer pt-4">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" 
                      name="acceptTerms"
                      className="peer sr-only"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="w-6 h-6 border-2 border-brand-cream peer-checked:bg-brand-green-dark peer-checked:border-brand-green-dark transition-all flex items-center justify-center text-white">
                      <CheckCircle2 className="w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="text-sm italic font-serif text-brand-green-dark/70">J'accepte les conditions de partenariat du Club IBC.</span>
                </label>

                <div className="pt-8 flex gap-4">
                   <button 
                     type="button"
                     onClick={() => setStep(1)}
                     className="w-48 py-5 border-2 border-brand-green-dark text-brand-green-dark font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-brand-green-dark hover:text-white transition-all"
                   >
                     Précédent
                   </button>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="flex-1 py-6 bg-brand-green text-brand-gold-light font-black text-sm uppercase tracking-[0.4em] rounded-none hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-premium shimmer"
                   >
                     {loading ? 'Soumission...' : 'Rejoindre le Réseau IBC'}
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
              className="relative w-full max-w-xl bg-brand-green-dark border-2 border-brand-gold p-12 text-center shadow-premium"
            >
              <div className="w-20 h-20 bg-brand-gold text-brand-green-dark flex items-center justify-center rounded-none mx-auto mb-8 shadow-premium pulse-gold">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="text-4xl font-serif font-black text-brand-gold-light mb-6 italic tracking-tighter">
                Votre demande est transmise !
              </h2>
              
              <div className="mb-8 p-6 bg-white/5 border border-brand-gold/30 rounded-none">
                 <p className="label-caps !opacity-100 text-brand-gold mb-3 font-bold">VOTRE ID PARTENAIRE PROVISOIRE</p>
                 <p className="text-2xl font-serif font-black text-white italic tracking-widest">{generatedId}</p>
              </div>

              <p className="text-white/70 font-serif italic mb-10 leading-relaxed text-lg">
                L'équipe IVOIRE BUSINESS CLUB vous contactera sous <span className="text-brand-gold font-bold">48h</span> pour valider votre dossier et finaliser votre intégration au réseau.
              </p>

              <button 
                onClick={() => {
                  onSuccess();
                  setIsSuccessModalOpen(false);
                }}
                className="w-full py-5 bg-brand-gold text-brand-green-dark font-black text-sm uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all shadow-premium"
              >
                Retour à l'accueil
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
