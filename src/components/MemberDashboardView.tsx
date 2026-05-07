import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Map, 
  MapPin,
  Wallet, 
  History, 
  QrCode, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Gift,
  ArrowUpRight,
  Download,
  CreditCard,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { getSolde, getTransactions, IBCTransaction } from '../services/transactionService';

interface MemberDashboardViewProps {
  user: any;
  profile: any;
}

export const MemberDashboardView: React.FC<MemberDashboardViewProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Dynamic Data
  const currentSolde = getSolde(profile?.memberId || user?.uid);
  const userTransactions = getTransactions(profile?.memberId || user?.uid, 'membre');
  const totalCashback = userTransactions.reduce((acc, t) => acc + t.membreCashback, 0);

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'explorer', label: 'Explorer', icon: <Map className="w-5 h-5" /> },
    { id: 'wallet', label: 'Mon Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <History className="w-5 h-5" /> },
    { id: 'qrcode', label: 'Mon QR Code', icon: <QrCode className="w-5 h-5" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => signOut(auth);

  const stats = [
    { label: 'Solde Wallet', value: `${currentSolde.toLocaleString()} FCFA`, icon: <Wallet className="w-6 h-6" />, color: 'border-brand-gold' },
    { label: 'Total Cashback', value: `${totalCashback.toLocaleString()} FCFA`, icon: <Gift className="w-6 h-6" />, color: 'border-brand-green' },
    { label: 'Transactions', value: userTransactions.length.toString(), icon: <TrendingUp className="w-6 h-6" />, color: 'border-brand-gold-light' },
  ];

  const partners = [
    { name: "La Réserve", cat: "Restaurant", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" },
    { name: "Villa Blanche", cat: "Loisirs", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80" },
    { name: "Espace 777", cat: "Lounge", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80" },
    { name: "Sky Lounge", cat: "Lounge", img: "/src/assets/sky-lounge-bar.jpg" },
    { name: "Hotel Particulier", cat: "Hôtel", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
  ];

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* SIDEBAR - Desktop */}
      <aside className="hidden lg:flex w-[260px] bg-brand-green flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Logo size="md" className="mb-12" />
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 rounded-none border-[3px] border-brand-gold mb-4 overflow-hidden shadow-2xl">
              <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-white font-serif font-black text-lg italic leading-tight mb-2">{profile?.name || 'Membre'}</h3>
            <span className="px-4 py-1 bg-brand-gold text-brand-green-dark text-[9px] font-black uppercase tracking-[0.2em] rounded-none">
              {profile?.status || 'BRONZE'}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold tracking-tight rounded-none transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-gold text-brand-green-dark shadow-premium scale-105' 
                    : 'text-white/60 hover:bg-brand-gold/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-none flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-gold" />
            <p className="text-[9px] font-black uppercase tracking-widest text-brand-gold">Abonnement actif ✓</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-none transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MOBILE NAV (Bottom Bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-brand-green z-[60] flex items-center justify-around px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${
              activeTab === item.id ? 'text-brand-gold scale-110' : 'text-white/40'
            }`}
          >
            {item.icon}
            <span className="text-[7px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-0 bg-brand-cream">
        {/* TOP BAR */}
        <header className="h-[72px] bg-white border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-md hidden md:flex items-center gap-4 px-4 h-11 bg-brand-cream rounded-none border border-brand-border">
            <Search className="w-4 h-4 text-brand-green-dark" />
            <input 
              type="text" 
              placeholder="Rechercher un partenaire..." 
              className="bg-transparent border-none outline-none text-sm w-full font-serif italic"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-brand-green-dark" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-none" />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-serif italic font-bold">Bonjour, {profile?.name?.split(' ')[0] || 'Membre'} 👋</p>
              <div className="w-10 h-10 rounded-none bg-brand-cream border border-brand-gold/30 lg:hidden">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full rounded-none" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Digital ID Card */}
                  <div className="xl:col-span-1">
                    <div className="aspect-[1.586/1] w-full max-w-[400px] bg-gradient-to-br from-[#1B5E35] to-[#2E7D52] rounded-none border border-brand-gold/50 shadow-premium p-8 relative overflow-hidden text-white flex flex-col justify-between group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold opacity-5 rounded-none -translate-y-24 translate-x-12" />
                      
                      <div className="flex justify-between items-start z-10">
                        <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center text-brand-gold font-serif font-black text-[10px] border border-brand-gold/30">
                          IBC
                        </div>
                        <span className="text-[10px] font-black tracking-[0.2em] text-brand-gold flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-brand-gold rounded-none animate-pulse" />
                           {profile?.status || 'BRONZE'}
                        </span>
                      </div>

                      <div className="z-10">
                        <h4 className="text-xl font-serif font-black italic tracking-tighter mb-1 uppercase">
                          {profile?.name || 'VOTRE NOM'}
                        </h4>
                        <p className="text-[10px] font-mono text-brand-gold tracking-[0.3em] font-black uppercase">
                          {profile?.memberId || 'IBC-XXXXXX'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end z-10">
                         <p className="text-[11px] font-serif italic text-white/40">Programme Elite Privilège</p>
                         <div className="p-2 bg-white rounded-none shadow-xl shadow-brand-green-dark/40">
                           <QRCodeSVG value={profile?.memberId || 'N/A'} size={48} level="H" fgColor="#0F341D" />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((s, i) => (
                      <div key={i} className="card-luxe hover:bg-brand-cream/30 group">
                        <div className="w-12 h-12 bg-brand-cream rounded-none flex items-center justify-center text-brand-green-dark mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors shadow-sm">
                          {s.icon}
                        </div>
                        <p className="label-caps mb-1 opacity-70 font-black">{s.label}</p>
                        <h3 className="text-2xl font-serif font-black text-brand-green-dark italic tracking-tight">{s.value}</h3>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partners Discovery */}
                <section>
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="label-caps mb-2">Explorer</p>
                      <h3 className="text-3xl font-serif font-black italic text-brand-green-dark">Partenaires à découvrir</h3>
                    </div>
                    <button onClick={() => setActiveTab('explorer')} className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold hover:text-brand-green-dark transition-colors">Tout voir →</button>
                  </div>
                  
                  <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
                    {partners.map((p, i) => (
                      <div key={i} className="min-w-[280px] bg-white rounded-none border border-slate-100 shadow-premium group overflow-hidden">
                        <div className="h-40 overflow-hidden relative">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <span className="absolute top-4 left-4 px-4 py-1 bg-brand-green-dark text-white text-[9px] font-bold rounded-none">
                            {p.cat}
                          </span>
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-serif font-black italic mb-4">{p.name}</h4>
                          <button className="w-full py-3 bg-brand-cream text-brand-green-dark font-black text-[9px] uppercase tracking-[0.2em] rounded-none hover:bg-brand-gold transition-all flex items-center justify-center gap-2">
                            Voir l'offre
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Latest Transactions */}
                <section>
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="label-caps mb-2">Historique</p>
                      <h3 className="text-3xl font-serif font-black italic text-brand-green-dark">Dernières transactions</h3>
                    </div>
                    <button onClick={() => setActiveTab('transactions')} className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold hover:text-brand-green-dark transition-colors">Voir tout →</button>
                  </div>
                  
                  <div className="bg-white rounded-none shadow-premium overflow-hidden border border-slate-100">
                    <table className="w-full text-left">
                      <thead className="bg-brand-cream border-b border-brand-border">
                        <tr>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Date</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Partenaire</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Montant</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Cashback reçus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTransactions.length > 0 ? userTransactions.slice(0, 5).map((t, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-6 text-sm font-serif italic text-slate-400">{t.date}</td>
                            <td className="px-8 py-6 text-sm font-bold text-brand-green-dark">{t.partenaireNom}</td>
                            <td className="px-8 py-6 text-sm font-black italic">{t.montant.toLocaleString()} FCFA</td>
                            <td className="px-8 py-6">
                               <span className="px-3 py-1 bg-green-50 text-green-600 font-black text-[10px] rounded-none">
                                 +{t.membreCashback.toLocaleString()} FCFA
                               </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-serif italic">Aucune transaction récente</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'explorer' && (
              <motion.div 
                key="explorer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                  <div>
                    <p className="label-caps mb-2">Reseaux Partenaires</p>
                    <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Découvrez vos privilèges</h3>
                  </div>
                  <div className="flex gap-2 pb-1">
                    {['Tous', 'Hôtel', 'Restaurant', 'Lounge'].map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => setActiveFilter(cat)}
                        className={`px-6 py-2 border text-[9px] font-black uppercase tracking-widest transition-colors ${
                          activeFilter === cat 
                            ? 'bg-brand-green border-brand-green text-brand-gold' 
                            : 'bg-white border-brand-border hover:border-brand-gold'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {partners.concat(partners).filter(p => activeFilter === 'Tous' || p.cat === activeFilter).map((p, i) => (
                    <div key={i} className="bg-white rounded-none border border-slate-100 shadow-premium group overflow-hidden">
                      <div className="h-48 overflow-hidden relative">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-brand-gold text-brand-green-dark text-[8px] font-black uppercase tracking-widest shadow-lg">
                          -10% de remise directe
                        </div>
                      </div>
                      <div className="p-8">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-2 block">{p.cat}</span>
                        <h4 className="text-2xl font-serif font-black italic mb-6">{p.name}</h4>
                        <div className="flex items-center gap-2 mb-8 text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-serif italic">Abidjan, Côte d'Ivoire</span>
                        </div>
                        <button className="w-full py-4 bg-brand-green text-brand-gold-light font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all flex items-center justify-center gap-2 rounded-none">
                          Consulter les avantages
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div 
                key="wallet"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                <div className="bg-brand-green-dark p-16 rounded-none text-center border-2 border-brand-gold relative overflow-hidden shadow-premium">
                   <div className="absolute top-0 right-0 w-64 h-64 gradient-gold opacity-5 rounded-none -translate-y-32 translate-x-32" />
                   
                   <p className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-gold mb-6">Solde Disponible</p>
                   <h2 className="text-7xl lg:text-8xl font-serif font-black text-brand-gold italic tracking-tighter mb-12">
                     {currentSolde.toLocaleString()} <span className="text-xl italic opacity-60">FCFA</span>
                   </h2>
                   
                   <div className="flex flex-col sm:flex-row justify-center gap-6">
                      <button className="px-12 py-5 bg-brand-gold text-brand-green-dark font-black text-sm uppercase tracking-[0.3em] rounded-none shadow-premium hover:brightness-110 transition-all shimmer">
                        Recharger mon Wallet
                      </button>
                      <button onClick={() => setActiveTab('transactions')} className="px-12 py-5 border-2 border-white/20 text-white font-black text-sm uppercase tracking-[0.3em] rounded-none hover:bg-white/10 transition-all">
                        Historique Complet
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <section className="bg-white p-10 shadow-premium">
                      <h4 className="text-2xl font-serif font-black italic mb-8">Transactions de rechargement</h4>
                      <div className="space-y-6">
                         {[
                           { date: "15 Oct", type: "Orange Money", amount: "+10 000" },
                           { date: "02 Oct", type: "Rechargement CB", amount: "+25 000" },
                         ].map((r, i) => (
                           <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-100 last:border-0">
                              <div>
                                 <p className="text-sm font-bold text-brand-green-dark italic">{r.type}</p>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">{r.date}</p>
                              </div>
                              <span className="text-lg font-black text-brand-green-dark italic">{r.amount} FCFA</span>
                           </div>
                         ))}
                      </div>
                   </section>

                   <section className="bg-white p-10 shadow-premium">
                      <h4 className="text-2xl font-serif font-black italic mb-8">Crédits Cashback reçus</h4>
                      <div className="space-y-6">
                         {[
                           { date: "Hier", p: "La Réserve", amount: "+675" },
                           { date: "12 Oct", p: "Villa Blanche", amount: "+1 350" },
                         ].map((c, i) => (
                           <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-100 last:border-0">
                              <div>
                                 <p className="text-sm font-bold text-brand-green-dark italic">{c.p}</p>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">{c.date}</p>
                              </div>
                              <span className="text-lg font-black text-green-600 italic">{c.amount} FCFA</span>
                           </div>
                         ))}
                      </div>
                   </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div 
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div>
                  <p className="label-caps mb-2">Historique Complet</p>
                  <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Suivi de vos transactions</h3>
                </div>

                <div className="bg-white rounded-none shadow-premium overflow-hidden border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-brand-cream border-b border-brand-border">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">ID Transaction</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Date & Heure</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Partenaire</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Montant HT</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Cashback (3%)</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.length > 0 ? userTransactions.map((t, i) => (
                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-mono text-[10px] font-bold text-slate-400">#{t.id.substring(0, 8)}</td>
                          <td className="px-8 py-6 text-sm font-serif italic text-slate-500">{t.date} à {t.heure}</td>
                          <td className="px-8 py-6 text-sm font-bold text-brand-green-dark">{t.partenaireNom}</td>
                          <td className="px-8 py-6 text-sm font-black italic">{t.montant.toLocaleString()} FCFA</td>
                          <td className="px-8 py-6">
                             <span className="px-3 py-1 bg-green-50 text-green-600 font-black text-[10px] rounded-none">
                               +{t.membreCashback.toLocaleString()} FCFA
                             </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              {t.statut}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center text-slate-300 font-serif italic text-xl">Aucun historique disponible pour le moment.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'qrcode' && (
              <motion.div 
                key="qrcode"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="max-w-2xl mx-auto text-center py-12"
              >
                <div className="bg-white p-16 rounded-none shadow-premium border-2 border-brand-gold relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-32 h-1 bg-brand-gold" />
                   
                   <div className="mb-12">
                     <h3 className="text-4xl font-serif font-black italic text-brand-green-dark mb-4">Votre Identifiant IBC</h3>
                     <p className="text-sm italic font-serif text-slate-500">Présentez ce QR Code chez nos partenaires pour valider votre cashback</p>
                   </div>
                   
                   <div className="mx-auto w-fit p-10 bg-white border-2 border-brand-gold shadow-2xl relative mb-12">
                      <QRCodeSVG 
                        value={profile?.memberId || 'N/A'} 
                        size={220} 
                        level="H" 
                        fgColor="#1B5E35"
                        includeMargin={true}
                      />
                      <div className="absolute inset-0 border-[6px] border-white pointer-events-none" />
                   </div>

                   <p className="text-2xl font-mono font-black text-brand-gold tracking-[0.5em] mb-12">
                     {profile?.memberId || 'IBC-XXXXXX'}
                   </p>

                   <button className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-sm uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all flex items-center justify-center gap-3 shimmer">
                     <Download className="w-5 h-5" />
                     Télécharger mon QR Code
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl space-y-12"
              >
                <div>
                  <p className="label-caps mb-2">Compte & Sécurité</p>
                  <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Paramètres du profil</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 space-y-6">
                    <div className="p-8 bg-white border border-brand-border text-center">
                      <div className="w-24 h-24 rounded-none border-2 border-brand-gold mx-auto mb-6 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button className="text-[9px] font-black uppercase tracking-widest text-brand-gold hover:text-brand-green-dark transition-colors">Modifier la photo</button>
                    </div>
                    
                    <div className="p-6 bg-brand-green/5 border border-brand-green/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark mb-4">Statut actuel</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-gold rounded-none flex items-center justify-center text-brand-green-dark pulse-gold">
                           <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black italic text-brand-green-dark uppercase">{profile?.status || 'BRONZE'}</p>
                          <p className="text-[8px] font-bold text-brand-green-dark/40 uppercase tracking-widest">Membre certifié</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-8 bg-white p-10 border border-brand-border shadow-premium">
                    <div className="space-y-4">
                      <label className="label-caps !opacity-100 text-[10px] text-brand-green-dark/40 font-black">Nom complet</label>
                      <input 
                        type="text" 
                        defaultValue={profile?.name} 
                        className="w-full pb-4 bg-transparent border-b border-brand-border outline-none transition-all font-serif italic text-lg focus:border-brand-gold"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="label-caps !opacity-100 text-[10px] text-brand-green-dark/40 font-black">Adresse Email</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email} 
                        readOnly
                        className="w-full pb-4 bg-transparent border-b border-brand-border outline-none transition-all font-serif italic text-lg opacity-40 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="label-caps !opacity-100 text-[10px] text-brand-green-dark/40 font-black">Numéro de téléphone</label>
                      <input 
                        type="tel" 
                        defaultValue={profile?.phone || '+225 00 00 00 00'} 
                        className="w-full pb-4 bg-transparent border-b border-brand-border outline-none transition-all font-serif italic text-lg focus:border-brand-gold"
                      />
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 py-4 bg-brand-green text-brand-gold-light font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all rounded-none">
                        Sauvegarder les modifications
                      </button>
                      <button className="px-8 py-4 border border-red-200 text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-50 transition-colors">
                        Changer le mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
