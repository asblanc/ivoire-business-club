import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { MemberDashboard } from './components/MemberDashboard';
import { Logo } from './components/Logo'; import ibcLogo from './assets/ibc-logo.png';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2,
  Instagram,
  Facebook,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Search,
  Coffee,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';

import { MemberRegistration } from './components/MemberRegistration';
import { PartnerRegistration } from './components/PartnerRegistration';
import { LoginView } from './components/LoginView';
import { MemberDashboardView } from './components/MemberDashboardView';
import { PartnerDashboardView } from './components/PartnerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { initIBCAnimations } from './utils/ibc-animations';
import './utils/ibc-toast'; // Import to initialize window.ibcToast

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [view, setView] = useState<'home' | 'member-registration' | 'partner-registration' | 'login' | 'offers'>('home');

  useEffect(() => {
    // Initialiser les animations IBC
    initIBCAnimations();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            // Profil par défaut pour les nouveaux inscrits
            const newProfile = {
              name: u.displayName || 'Membre IBC',
              role: 'member',
              memberId: 'IBC-' + Math.floor(100000 + Math.random() * 900000),
              status: 'BRONZE',
              balance: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
        setView('home');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Re-trigger animations when loading finishes or view changes
  useEffect(() => {
    if (!loading && view === 'home' && !user) {
      const timer = setTimeout(() => {
        const counters = document.querySelectorAll('[data-countup]');
        if (counters.length > 0) {
          // Trigger a global custom event or just recall the specific init
          const event = new CustomEvent('ibc-content-ready');
          window.dispatchEvent(event);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, view, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="w-16 h-16 border-4 border-brand-gold/20 border-t-brand-gold rounded-none animate-spin"></div>
      </div>
    );
  }

  if (user && profile) {
    if (profile.role === 'member') {
      return <MemberDashboardView user={user} profile={profile} />;
    }
    if (profile.role === 'partner') {
      return <PartnerDashboardView user={user} profile={profile} />;
    }
    if (profile.role === 'admin') {
      return <AdminDashboardView user={user} profile={profile} />;
    }
  }

  if (view === 'member-registration' && !user) {
    return <MemberRegistration onBack={() => setView('home')} onSuccess={() => setView('home')} />;
  }

  if (view === 'partner-registration' && !user) {
    return <PartnerRegistration onBack={() => setView('home')} onSuccess={() => setView('home')} />;
  }

  if (view === 'login' && !user) {
    return <LoginView 
      onBack={() => setView('home')} 
      onRegisterMember={() => setView('member-registration')}
      onRegisterPartner={() => setView('partner-registration')}
      onSuccess={() => setView('home')} 
    />;
  }

  if (view === 'offers' && !user) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col">
        <Navbar 
          user={user} 
          profile={profile} 
          onAuthClick={() => setView('login')} 
          onRegisterClick={() => setView('member-registration')}
        />
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-32">
            <div className="text-center mb-16">
              <button 
                onClick={() => setView('home')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-brand-gold font-black text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-green-dark transition-all mb-8"
              >
                ← Retour
              </button>
              <h1 className="text-5xl font-serif font-black italic text-brand-green-dark mb-4">Nos Offres Partenaires</h1>
              <p className="text-brand-green-dark/80 italic font-serif text-lg">Découvrez tous les avantages réservés aux membres IBC</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  name: "Le Grand Restaurant", 
                  cat: "Restaurants", 
                  img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", 
                  offers: ["-15% sur tous les plats", "Menu VIP offert", "Réservation prioritaire"],
                  stars: 5 
                },
                { 
                  name: "Assinie Villa", 
                  cat: "Hôtels", 
                  img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", 
                  offers: ["-20% sur les chambres", "Petit-déjeuner offert", "Spa gratuit"],
                  stars: 5 
                },
                { 
                  name: "Sky Lounge", 
                  cat: "Lounges", 
                  img: "/src/assets/sky-lounge-bar.jpg", 
                  offers: ["-10% sur les consommations", "Accès VIP", "Événements exclusifs"],
                  stars: 4 
                }
              ].map((p, i) => (
                <div key={i} className="bg-white rounded-none border border-slate-100 shadow-premium group overflow-hidden">
                  <div className="h-48 overflow-hidden relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-brand-gold text-brand-green-dark text-[8px] font-black uppercase tracking-widest shadow-lg">
                      {p.cat}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(p.stars)].map((_, s) => <span key={s} className="text-brand-gold text-sm">★</span>)}
                    </div>
                    <h4 className="text-2xl font-serif font-black italic mb-6">{p.name}</h4>
                    <div className="space-y-2 mb-8">
                      {p.offers.map((offer, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                          <span className="text-sm font-serif italic text-brand-green-dark">{offer}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 bg-brand-green text-brand-gold-light font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all flex items-center justify-center gap-2 rounded-none">
                      Devenir Membre pour bénéficier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <Navbar 
        user={user} 
        profile={profile} 
        onAuthClick={() => setView('login')} 
        onRegisterClick={() => setView('member-registration')}
      />
      
      <main className="flex-grow">
        {user ? (
          <div className="max-w-7xl mx-auto px-4 py-32">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-12">
              <div>
                <p className="label-caps mb-4 italic !opacity-100 text-brand-gold">Espace Privilège</p>
                <h1 className="text-5xl font-serif font-black text-brand-green-dark tracking-tight">
                  Bonjour, <span className="italic font-normal text-brand-gold">{profile?.name}</span>
                </h1>
              </div>
              <div className="text-right">
                <span className="px-5 py-2 bg-brand-green text-brand-gold border border-brand-gold/30 text-[10px] tracking-[0.2em] font-black uppercase inline-block">
                  {profile?.role === 'partner' ? 'Établissement Agréé' : `Membre ${profile?.status}`}
                </span>
              </div>
            </header>
            
            {profile?.role === 'partner' ? (
              <div className="bg-brand-green-dark p-16 text-center border-4 border-brand-gold/20 shadow-premium card-partner">
                <h2 className="text-4xl font-serif italic mb-6 text-brand-gold">Interface Partenaire</h2>
                <p className="text-brand-cream/60 mb-10 max-w-lg mx-auto italic font-serif">Validez les avantages de vos clients IBC en toute simplicité.</p>
                <div className="max-w-md mx-auto p-12 border-2 border-dashed border-brand-gold/30 rounded-none">
                  <p className="label-caps mb-6 text-brand-gold">Scanner le QR Code Client</p>
                  <div className="aspect-square bg-white/5 flex flex-col items-center justify-center text-brand-gold/40 border border-white/5">
                    <CheckCircle2 className="w-16 h-16 mb-4 opacity-20" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Lecteur Caméra Connecté</span>
                  </div>
                </div>
              </div>
            ) : (
              <MemberDashboard profile={profile} />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <section id="accueil" className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden gradient-hero text-white">
              <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85')] bg-cover bg-center opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark via-brand-green-dark/80 to-transparent z-0" />
              
              <div className="max-w-7xl mx-auto px-4 relative z-10 w-full lg:py-24">
                <div className="max-w-5xl">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-4 mb-8"
                  >
                    <span className="w-16 h-[2px] bg-brand-gold" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-black">Luxe, Affaires & Prestige</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-serif font-black text-white leading-[0.95] tracking-tighter mb-10"
                  >
                    Transformez vos <br />
                    <span className="italic font-normal text-brand-gold">Loisirs</span> en <br />
                    Opportunités.
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl font-serif leading-relaxed italic"
                  >
                    Rejoignez la plus grande communauté de consommateurs premium de Côte d'Ivoire. Consommez local, gagnez plus, vivez mieux.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-6 mb-20"
                  >
                    <button 
                      onClick={() => setView('member-registration')}
                      className="btn-membership gradient-gold text-brand-green-dark text-lg hover:scale-105 transition-all shadow-[0_20px_50px_rgba(201,168,76,0.3)] font-black"
                    >
                      Devenir Membre
                    </button>
                    <button 
                      onClick={() => setView('partner-registration')}
                      className="btn-membership border-2 border-white/50 text-white text-lg hover:bg-[#C9A84C] hover:text-[#1B5E35] hover:border-[#C9A84C]"
                    >
                      Devenir Partenaire
                    </button>
                  </motion.div>
                </div>
              </div>
              
              {/* Badge Cashback Flottant */}
              <div className="badge-float hidden lg:flex items-center gap-3">
                 <span className="text-2xl">💰</span>
                 <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-tighter font-black">Cashback 3%</span>
                    <span className="text-[8px] uppercase tracking-widest opacity-60">Sur chaque dépense</span>
                 </div>
              </div>

              {/* Compteurs */}
              <div className="absolute bottom-0 left-0 right-0 py-12 bg-black/40 border-t border-white/10 backdrop-blur-md z-20">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 text-center">
                    <div data-aos="fade-up">
                      <p className="text-5xl font-serif font-black text-brand-gold-light mb-2 tracking-tighter" data-countup="2847">0</p>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-black">Membres Actifs</p>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="100">
                      <p className="text-5xl font-serif font-black text-brand-gold-light mb-2 tracking-tighter" data-countup="143">0</p>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-black">Partenaires Agréés</p>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="200">
                      <p className="text-5xl font-serif font-black text-brand-gold-light mb-2 tracking-tighter" data-countup="12500000" data-suffix=" FCFA">0</p>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-black">FCFA Redistribués</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* COMMENT ÇA MARCHE */}
            <section className="py-32 bg-brand-cream overflow-hidden">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-24">
                  <p className="label-caps mb-4">Le Concept unique</p>
                  <h2 className="text-5xl font-serif font-black italic text-brand-green-dark">Comment ça marche ?</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative px-4">
                  {[
                    { icon: <Lock />, title: "Inscrivez-vous", text: "Créez votre profil IBC en quelques secondes pour accéder au réseau." },
                    { icon: <Search />, title: "Découvrez", text: "Explorez notre catalogue d'établissements partenaires d'exception." },
                    { icon: <Coffee />, title: "Consommez", text: "Profitez de vos moments préférés et payez directement sur place." },
                    { icon: <CheckCircle2 />, title: "Gagnez", text: "Scannez votre code et recevez 3% de cashback immédiat." }
                  ].map((step, i) => (
                    <div key={i} className="relative group" data-aos="fade-up" data-aos-delay={i * 100}>
                      <div className="w-20 h-20 rounded-none bg-brand-green flex items-center justify-center text-brand-gold mb-8 mx-auto shadow-premium group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-green-dark transition-all duration-500">
                        {React.cloneElement(step.icon as React.ReactElement, { className: "w-8 h-8" })}
                      </div>
                      <h4 className="text-2xl font-serif font-bold italic mb-4 text-brand-green-dark">{step.title}</h4>
                      <p className="text-brand-green-dark/80 italic font-serif leading-relaxed px-4 text-sm font-medium">{step.text}</p>
                      {i < 3 && <div className="hidden md:block absolute top-10 left-[85%] text-brand-gold/30 text-2xl font-black">→</div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* NOS PARTENAIRES */}
            <section id="nos-partenaires" className="py-32 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
                  <div>
                    <p className="label-caps mb-4">Nos Partenaires</p>
                    <h2 className="text-5xl font-serif font-black italic text-brand-green-dark mb-4">Établissements Agréés</h2>
                    <p className="text-brand-green-dark/80 italic font-serif text-lg leading-relaxed">Hôtels, Restaurants, Lounges : l'excellence ivoirienne à votre portée.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['Tous', 'Restaurants', 'Hôtels', 'Lounges'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-8 py-3 rounded-none text-[10px] uppercase font-black tracking-widest border-2 transition-all ${activeFilter === f ? 'bg-brand-green border-brand-green text-brand-gold shadow-lg' : 'border-brand-border text-brand-green-dark/60 hover:border-brand-green hover:text-brand-green'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { name: "Le Grand Restaurant", cat: "Restaurants", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", stars: 5 },
                    { name: "Assinie Villa", cat: "Hôtels", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", stars: 5 },
                    { name: "Sky Lounge", cat: "Lounges", img: "/src/assets/sky-lounge-bar.jpg", stars: 4 }
                  ].filter(p => activeFilter === 'Tous' || p.cat === activeFilter).map((p, i) => (
                    <div key={i} className="card-luxe !p-0 group overflow-hidden" data-aos="zoom-in" data-aos-delay={i * 100}>
                      <div className="h-64 overflow-hidden relative">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-6 left-6">
                           <span className="px-3 py-1 bg-brand-gold text-brand-green-dark text-[8px] font-black uppercase tracking-widest mb-2 inline-block shadow-lg">
                             {p.cat}
                           </span>
                           <h4 className="text-2xl font-serif font-black text-white italic tracking-tight">{p.name}</h4>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex gap-1 mb-8">
                          {[...Array(p.stars)].map((_, s) => <span key={s} className="text-brand-gold text-sm">★</span>)}
                        </div>
                        <button 
                          onClick={() => setView('offers')}
                          className="w-full py-4 bg-brand-cream text-brand-green-dark font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-gold transition-all flex items-center justify-center gap-2 rounded-none"
                        >
                          Voir les offres
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PROGRAMME DE FIDÉLITÉ (CARDS) */}
            <section className="py-32 bg-brand-green-dark overflow-hidden">
               <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-24">
                    <p className="label-caps !opacity-100 text-brand-gold-light mb-4">Votre Carte Membre IBC</p>
                    <h2 className="text-5xl font-serif font-black italic text-white leading-tight">Le Programme de Fidélité Elite</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                    {/* BRONZE CARD */}
                    <div className="relative group" data-aos="fade-right">
                       <div className="aspect-[1.586/1] w-full bg-[linear-gradient(135deg,#8B6914,#C9A84C)] rounded-none p-10 flex flex-col justify-between text-white shadow-2xl shimmer">
                          <div className="flex justify-between items-start">
                            <Logo size="md" className="border-white/20" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Status: Bronze</span>
                          </div>
                          <div>
                            <p className="text-2xl font-serif mb-1 italic opacity-90 tracking-widest uppercase">ID: IBC-BR-0019</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest opacity-60">Membre Certifié</p>
                          </div>
                       </div>
                    </div>

                    {/* SILVER CARD */}
                    <div className="relative group scale-105 z-10" data-aos="fade-up">
                       <div className="aspect-[1.586/1] w-full bg-[linear-gradient(135deg,#9E9E9E,#E8E8E8)] rounded-none p-10 flex flex-col justify-between text-brand-green-dark shadow-2xl shimmer">
                          <div className="flex justify-between items-start">
                            <Logo size="md" className="border-black/10" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Status: Silver</span>
                          </div>
                          <div>
                            <p className="text-2xl font-serif mb-1 italic opacity-90 tracking-widest uppercase">ID: IBC-SL-0044</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest opacity-60">Membre Privilège</p>
                          </div>
                       </div>
                    </div>

                    {/* GOLD CARD */}
                    <div className="relative group" data-aos="fade-left">
                       <div className="aspect-[1.586/1] w-full gradient-gold rounded-none p-10 flex flex-col justify-between text-brand-green-dark shadow-2xl shimmer pulse-gold">
                          <div className="flex justify-between items-start">
                            <Logo size="md" className="border-brand-green-dark/20" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Status: Gold Elite</span>
                          </div>
                          <div>
                            <p className="text-2xl font-serif mb-1 italic opacity-90 tracking-widest uppercase">ID: IBC-GD-0001</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest opacity-60">Membre Ambassadeur</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </section>

            {/* VOS AVANTAGES */}
            <section id="avantages" className="py-32 bg-brand-cream">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                  {[
                    { icon: <Zap />, title: "Cashback Immédiat", text: "Retirez 3% de cashback sur chaque dépense, sans minimum d'achat." },
                    { icon: <ShieldCheck />, title: "Sécurité & Transparence", text: "Vos gains sont sécurisés et traçables en temps réel sur votre espace." },
                    { icon: <Users />, title: "Communauté Exclusive", text: "Rejoignez le premier réseau d'affaires premium de Côte d'Ivoire." },
                    { icon: <TrendingUp />, title: "Visibilité & Influence", text: "Pour nos partenaires, un accès direct à une clientèle qualifiée et fidèle." },
                    { icon: <Globe />, title: "Réseau National", text: "Profitez de vos avantages dans toutes les grandes villes du pays." },
                    { icon: <CheckCircle2 />, title: "Accompagnement", text: "Support dédié pour maximiser vos opportunités au sein du club." }
                  ].map((adv, i) => (
                    <div key={i} className="flex gap-8 group" data-aos="fade-up" data-aos-delay={i * 50}>
                       <div className="w-16 h-16 shrink-0 rounded-none bg-brand-green flex items-center justify-center text-brand-gold shadow-premium group-hover:bg-brand-gold group-hover:text-brand-green-dark transition-all duration-500">
                         {React.cloneElement(adv.icon as React.ReactElement, { className: "w-6 h-6" })}
                       </div>
                       <div>
                         <h5 className="text-xl font-serif font-bold italic mb-3 tracking-tight">{adv.title}</h5>
                         <p className="text-brand-green-dark/60 text-sm leading-relaxed font-serif italic">{adv.text}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-brand-green-dark py-20 text-white/60 border-t border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <Logo size="lg" className="mb-6" />
              <h3 className="text-2xl font-serif font-black text-white italic tracking-tighter mb-3">IVOIRE BUSINESS CLUB</h3>
              <p className="label-caps text-brand-gold !opacity-100 font-bold mb-6">Consommez local, gagnez plus, vivez mieux.</p>
              <p className="text-sm leading-relaxed text-white/50 max-w-sm">
                Rejoignez la première plateforme d'échange et de networking dédiée aux entrepreneurs et professionnels de Côte d'Ivoire.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.3em] mb-6 text-brand-gold">Navigation</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-brand-gold transition-colors text-sm">Accueil</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-gold transition-colors text-sm">Devenir Membre</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-gold transition-colors text-sm">Partenaires</a></li>
                <li><a href="#" className="text-white/60 hover:text-brand-gold transition-colors text-sm">Offres</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.3em] mb-6 text-brand-gold">Contact</h4>
              <div className="space-y-4">
                <a href="tel:+225704141313" className="flex items-center gap-3 text-white/60 hover:text-brand-gold transition-colors group">
                  <Phone className="w-4 h-4 flex-shrink-0 text-brand-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm">+225 704 14 13 13</span>
                </a>
                <a href="https://wa.me/225704141313" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-brand-gold transition-colors group">
                  <MessageCircle className="w-4 h-4 flex-shrink-0 text-brand-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a href="mailto:contact@ivoirebusinessclub.com" className="flex items-center gap-3 text-white/60 hover:text-brand-gold transition-colors group">
                  <Mail className="w-4 h-4 flex-shrink-0 text-brand-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social & Bottom */}
          <div className="pt-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-8">
                <a href="#" title="Instagram" className="text-white/40 hover:text-brand-gold transition-colors group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" title="Facebook" className="text-white/40 hover:text-brand-gold transition-colors group">
                  <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
              
              <div className="flex flex-wrap gap-8 justify-center text-[8px] uppercase tracking-[0.4em] font-black">
                <p className="text-brand-gold/60">&copy; 2026 IVOIRE BUSINESS CLUB</p>
                <a href="#" className="hover:text-white transition-colors text-white/40">Mentions Légales</a>
                <a href="#" className="hover:text-white transition-colors text-white/40">Confidentialité</a>
                <a href="#" className="hover:text-white transition-colors text-white/40">CGU</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default App;
