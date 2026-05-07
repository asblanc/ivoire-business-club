import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Utensils, 
  Smartphone, 
  Banknote, 
  History, 
  Settings, 
  LogOut, 
  Bell, 
  Plus, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  ShieldCheck,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { validerTransaction, getTransactions, IBCTransaction } from '../services/transactionService';

interface PartnerDashboardViewProps {
  user: any;
  profile: any;
}

const data = [
  { name: '01/05', value: 120000 },
  { name: '02/05', value: 150000 },
  { name: '03/05', value: 90000 },
  { name: '04/05', value: 210000 },
  { name: '05/05', value: 180000 },
  { name: '06/05', value: 250000 },
  { name: '07/05', value: 300000 },
];

export const PartnerDashboardView: React.FC<PartnerDashboardViewProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberFound, setMemberFound] = useState<any>(null);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  // Dynamic Data
  const businessName = profile?.businessName || 'Mon Etablissement';
  const myTransactions = getTransactions(businessName, 'partenaire');
  const totalGross = myTransactions.reduce((acc, t) => acc + t.montant, 0);
  const totalNet = myTransactions.reduce((acc, t) => acc + t.partenaireShare, 0);
  const totalCommission = myTransactions.reduce((acc, t) => acc + t.adminCommission, 0);

  const handleLogout = () => signOut(auth);

  const kpis = [
    { label: "Volume d'affaires", value: `${totalGross.toLocaleString()} FCFA`, icon: <Banknote className="w-6 h-6" />, color: 'border-brand-gold' },
    { label: 'Transactions', value: myTransactions.length.toString(), icon: <History className="w-6 h-6" />, color: 'border-brand-gold-light' },
    { label: 'Revenu Net (90%)', value: `${totalNet.toLocaleString()} FCFA`, icon: <Users className="w-6 h-6" />, color: 'border-brand-green' },
    { label: 'Commission IBC', value: `${totalCommission.toLocaleString()} FCFA`, icon: <TrendingUp className="w-6 h-6" />, color: 'border-brand-gold' },
  ];

  const services = [
    { name: "Menu Signature Chef", price: "12 500", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", desc: "Plat gastronomique local revisité" },
    { name: "Cocktail Ivoire Gold", price: "6 500", img: "https://images.unsplash.com/photo-1536935338218-1d2110c1440d?w=400&q=80", desc: "Mixologie premium IBC" },
    { name: "Pack VIP Lounge", price: "25 000", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80", desc: "Accès exclusif et service dédié" },
  ];

  const handleSearchMember = () => {
    if (memberId.length >= 8) {
      setMemberFound({
        name: "Marc Koffi",
        status: "GOLD",
        avatar: "https://i.pravatar.cc/150?u=marc"
      });
    }
  };

  const handleValidateTransaction = () => {
    if (!memberId || !invoiceAmount) return;
    
    validerTransaction(memberId, businessName, parseInt(invoiceAmount));
    setShowResultModal(true);
  };

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-[260px] bg-brand-green flex-col hidden lg:flex z-50">
        <div className="p-8">
           <Logo size="md" className="mb-12" />
           
           <nav className="space-y-1">
             {[
               { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
               { id: 'services', label: 'Mes Services', icon: <Utensils className="w-5 h-5" /> },
               { id: 'scanner', label: 'Scanner Membre', icon: <Smartphone className="w-5 h-5" /> },
               { id: 'revenus', label: 'Revenus', icon: <Banknote className="w-5 h-5" /> },
               { id: 'transactions', label: 'Transactions', icon: <History className="w-5 h-5" /> },
               { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
             ].map((item) => (
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

        <div className="mt-auto p-8">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold text-red-100 hover:bg-red-500/10 rounded-none transition-all"
           >
             <LogOut className="w-5 h-5" />
             Déconnexion
           </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-brand-green z-[60] flex items-center justify-around px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
         {[
           { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
           { id: 'scanner', icon: <Smartphone className="w-5 h-5" /> },
           { id: 'services', icon: <Utensils className="w-5 h-5" /> },
           { id: 'revenus', icon: <Banknote className="w-5 h-5" /> },
           { id: 'transactions', icon: <History className="w-5 h-5" /> },
         ].map((item) => (
           <button
             key={item.id}
             onClick={() => setActiveTab(item.id)}
             className={`p-4 transition-all ${activeTab === item.id ? 'text-brand-gold scale-125' : 'text-white/40'}`}
           >
             {item.icon}
           </button>
         ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-0 bg-brand-cream">
         {/* TOP BAR */}
         <header className="h-[72px] bg-white border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-3">
             <h2 className="font-serif font-black italic text-brand-green-dark text-lg hidden sm:block">
               {profile?.businessName || 'Mon Etablissement'}
             </h2>
             <span className="px-4 py-1 bg-brand-gold text-brand-green-dark text-[9px] font-black uppercase tracking-[0.2em] rounded-none flex items-center gap-2">
               Partenaire Certifié IBC <CheckCircle2 className="w-3 h-3" />
             </span>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative">
                <Bell className="w-5 h-5 text-brand-green-dark" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-none" />
              </div>
              <div className="w-10 h-10 rounded-none border border-brand-gold/30 overflow-hidden">
                 <img src={profile?.photoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} alt="Logo" className="w-full h-full object-cover" />
              </div>
           </div>
         </header>

         <div className="p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
               {activeTab === 'dashboard' && (
                 <motion.div 
                   key="dashboard"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-12"
                 >
                   {/* Banner */}
                   <div className="relative h-48 rounded-none overflow-hidden shadow-premium group">
                     <img 
                       src={profile?.photoUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80"} 
                       className="w-full h-full object-cover"
                       alt="Banner"
                     />
                     <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark via-brand-green-dark/50 to-transparent" />
                     <div className="absolute inset-0 p-10 flex flex-col justify-center">
                        <span className="px-3 py-1 bg-brand-gold text-brand-green-dark text-[9px] font-black uppercase tracking-[0.3em] w-fit rounded-none mb-4">
                          {profile?.activityType || 'Restaurant'}
                        </span>
                        <h1 className="text-4xl font-serif font-black text-white italic tracking-tighter">
                          {profile?.businessName || 'Ivoire Horizon'}
                        </h1>
                     </div>
                   </div>

                   {/* KPI Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                     {kpis.map((kpi, i) => (
                      <div key={i} className="card-luxe hover:bg-brand-cream/30 group">
                         <div className="w-12 h-12 bg-brand-cream rounded-none flex items-center justify-center text-brand-green-dark mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors shadow-sm">
                           {kpi.icon}
                         </div>
                         <p className="label-caps mb-1 opacity-70 font-black">{kpi.label}</p>
                         <h3 className="text-2xl font-serif font-black text-brand-green-dark italic tracking-tight">{kpi.value}</h3>
                      </div>
                     ))}
                   </div>

                   {/* Charts Section */}
                   <div className="bg-white p-10 rounded-none shadow-premium border border-slate-100">
                      <div className="flex justify-between items-center mb-10">
                         <div>
                            <h3 className="text-2xl font-serif font-black italic text-brand-green-dark mb-2">Revenus 30 derniers jours</h3>
                            <p className="text-sm font-serif italic text-brand-green-dark/40">Evolution de votre volume d'affaires avec IBC</p>
                         </div>
                         <TrendingUp className="w-8 h-8 text-brand-gold opacity-30" />
                      </div>
                      
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data}>
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} 
                              tickFormatter={(val) => `${val/1000}k`}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                              labelStyle={{ display: 'none' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#C9A84C" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorVal)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'scanner' && (
                 <motion.div 
                   key="scanner"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="max-w-xl mx-auto py-12"
                 >
                    <div className="bg-white p-12 rounded-none shadow-premium border-2 border-brand-gold relative overflow-hidden text-center">
                       <Smartphone className="w-16 h-16 text-brand-gold mx-auto mb-8 animate-bounce" />
                       <h3 className="text-3xl font-serif font-black italic text-brand-green-dark mb-4">Valider une transaction</h3>
                       <p className="text-sm font-serif italic text-slate-500 mb-10">Scannez le QR Code ou saisissez l'ID Membre pour appliquer le cashback</p>

                       <div className="space-y-10">
                          <div className="flex gap-4">
                             <div className="flex-1 relative">
                               <input 
                                 type="text" 
                                 placeholder="ID Membre (ex: IBC-A4F2B...)"
                                 className="w-full h-16 px-6 bg-brand-cream border border-brand-cream focus:border-brand-gold rounded-none outline-none font-serif italic"
                                 value={memberId}
                                 onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                               />
                             </div>
                             <button 
                               onClick={handleSearchMember}
                               className="w-16 h-16 bg-brand-green text-brand-gold-light rounded-none flex items-center justify-center hover:brightness-110 transition-all"
                             >
                               <Search className="w-6 h-6" />
                             </button>
                          </div>

                          {memberFound && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-6 bg-brand-green-dark rounded-none flex items-center gap-6 text-left border border-brand-gold/30"
                            >
                               <img src={memberFound.avatar} alt="Member" className="w-16 h-16 rounded-none border-2 border-brand-gold" />
                               <div className="flex-1">
                                  <h4 className="text-white font-serif font-black text-xl italic">{memberFound.name}</h4>
                                  <span className="px-3 py-1 bg-brand-gold text-brand-green-dark text-[8px] font-black uppercase tracking-widest rounded-none">
                                    MEMBRE {memberFound.status}
                                  </span>
                               </div>
                               <CheckCircle2 className="w-8 h-8 text-brand-gold" />
                            </motion.div>
                          )}

                          {memberFound && (
                            <div className="space-y-6">
                              <div className="text-left space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Montant de la facture (FCFA)</label>
                                <input 
                                  type="number"
                                  className="w-full h-20 text-4xl font-serif font-black text-center text-brand-green-dark bg-brand-cream rounded-none outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                                  placeholder="0"
                                  value={invoiceAmount}
                                  onChange={(e) => setInvoiceAmount(e.target.value)}
                                />
                              </div>

                              <button 
                                onClick={handleValidateTransaction}
                                className="w-full py-6 bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-black text-sm uppercase tracking-[0.3em] rounded-none shadow-premium hover:scale-[1.02] active:scale-95 transition-all shimmer"
                              >
                                Valider la transaction
                              </button>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'services' && (
                 <motion.div 
                   key="services"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="space-y-12"
                 >
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2">Catalogue</p>
                        <h3 className="text-3xl font-serif font-black italic text-brand-green-dark italic-only">Mes Services Proposés</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                       {services.map((s, i) => (
                         <div key={i} className="bg-white rounded-none overflow-hidden shadow-premium group border border-slate-100">
                            <div className="h-48 relative overflow-hidden">
                               <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                               <div className="absolute top-4 right-4 flex gap-2">
                                  <button className="w-10 h-10 bg-white/90 text-brand-green-dark rounded-none flex items-center justify-center hover:bg-white transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button className="w-10 h-10 bg-red-500/90 text-white rounded-none flex items-center justify-center hover:bg-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            </div>
                            <div className="p-8">
                               <div className="flex justify-between items-start mb-4">
                                  <h4 className="text-xl font-serif font-black italic tracking-tight">{s.name}</h4>
                                  <span className="text-lg font-serif font-black text-brand-gold italic">{s.price} <span className="text-[10px]">FCFA</span></span>
                               </div>
                               <p className="text-sm font-serif italic text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                         </div>
                       ))}
                       <button 
                         onClick={() => setIsAddServiceModalOpen(true)}
                         className="h-full min-h-[300px] border-4 border-dashed border-brand-gold/20 rounded-none flex flex-col items-center justify-center gap-6 hover:bg-brand-cream/50 transition-all group"
                       >
                          <div className="w-20 h-20 bg-brand-cream rounded-none flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                             <Plus className="w-10 h-10" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-green-dark/40">Ajouter un service</span>
                       </button>
                    </div>
                 </motion.div>
               )}

                {activeTab === 'revenus' && (
                  <motion.div 
                    key="revenus"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                     <div className="bg-brand-green-dark p-16 rounded-none text-center border-2 border-brand-gold relative overflow-hidden shadow-premium">
                        <Banknote className="w-16 h-16 text-brand-gold mx-auto mb-8" />
                        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-gold mb-6">Net Partenaire Provisoire (90%)</p>
                        <h2 className="text-7xl lg:text-8xl font-serif font-black text-brand-gold italic tracking-tighter mb-12">
                          {totalNet.toLocaleString()} <span className="text-xl italic opacity-60">FCFA</span>
                        </h2>
                     </div>

                     <div className="bg-white rounded-none shadow-premium overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                           <thead className="bg-brand-cream border-b border-brand-border">
                              <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Date/Heure</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Services</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Montant Brut</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Part Partenaire (90%)</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Com. IBC (7%)</th>
                              </tr>
                           </thead>
                           <tbody>
                              {myTransactions.length > 0 ? myTransactions.map((t, i) => (
                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                  <td className="px-8 py-6 font-bold text-brand-green-dark">{t.date} à {t.heure}</td>
                                  <td className="px-8 py-6 font-serif italic text-sm text-slate-400">Validation Scan</td>
                                  <td className="px-8 py-6 font-black italic">{t.montant.toLocaleString()} FCFA</td>
                                  <td className="px-8 py-6 font-black italic text-brand-gold">{t.partenaireShare.toLocaleString()} FCFA</td>
                                  <td className="px-8 py-6 font-black italic text-slate-400">{t.adminCommission.toLocaleString()} FCFA</td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-serif italic">Aucun scan validé pour le moment.</td>
                                </tr>
                              )}
                           </tbody>
                        </table>
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
                      <p className="label-caps mb-2">Flux d'activités</p>
                      <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Toutes les transactions</h3>
                    </div>

                    <div className="bg-white rounded-none shadow-premium overflow-hidden border border-slate-100">
                      <table className="w-full text-left">
                        <thead className="bg-brand-cream border-b border-brand-border">
                          <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">ID</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Date</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Membre</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Montant Facture</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Reversement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTransactions.length > 0 ? myTransactions.map((t, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                              <td className="px-8 py-6 font-mono text-[10px] font-bold text-slate-400">#{t.id.substring(0, 8)}</td>
                              <td className="px-8 py-6 text-sm font-serif italic text-slate-500">{t.date}</td>
                              <td className="px-8 py-6">
                                <span className="text-sm font-bold text-brand-green-dark">{t.membreId}</span>
                              </td>
                              <td className="px-8 py-6 font-black italic text-sm">{t.montant.toLocaleString()} FCFA</td>
                              <td className="px-8 py-6">
                                <span className="text-sm font-black text-brand-gold">{t.partenaireShare.toLocaleString()} FCFA</span>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-serif italic">Aucune transaction enregistrée.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
                      <p className="label-caps mb-2">Compte Partenaire</p>
                      <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Configuration de l'établissement</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="md:col-span-1 space-y-6">
                        <div className="p-8 bg-white border border-brand-border text-center shadow-premium relative group overflow-hidden">
                          <img src={profile?.photoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`} alt="Logo" className="w-24 h-24 mx-auto mb-6 object-cover border-2 border-brand-gold transition-transform duration-500 group-hover:scale-110" />
                          <button className="text-[9px] font-black uppercase tracking-widest text-brand-gold hover:text-brand-green-dark transition-colors">Changer le logo</button>
                        </div>
                        
                        <div className="p-6 bg-brand-green/5 border border-brand-green/10 flex flex-col items-center gap-4 text-center">
                           <ShieldCheck className="w-10 h-10 text-brand-gold" />
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark">Etablissement Agréé</p>
                              <p className="text-[8px] font-bold text-brand-gold uppercase tracking-[0.3em]">Certification IBC v2</p>
                           </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-8 bg-white p-12 border border-brand-border shadow-premium">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-serif">
                            <div className="space-y-6">
                               <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40 block">Nom de l'enseigne</label>
                               <input type="text" defaultValue={profile?.businessName} className="w-full pb-4 bg-transparent border-b border-brand-border outline-none focus:border-brand-gold italic font-bold" />
                            </div>
                            <div className="space-y-6">
                               <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40 block">Type d'activité</label>
                               <input type="text" defaultValue={profile?.activityType} className="w-full pb-4 bg-transparent border-b border-brand-border outline-none focus:border-brand-gold italic font-bold" />
                            </div>
                            <div className="space-y-6">
                               <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40 block">Email de contact</label>
                               <input type="email" defaultValue={user?.email} readOnly className="w-full pb-4 bg-transparent border-b border-brand-border outline-none italic opacity-40" />
                            </div>
                            <div className="space-y-6">
                               <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40 block">Téléphone Manager</label>
                               <input type="tel" defaultValue={profile?.managerPhone || '+225 00 00 00 00'} className="w-full pb-4 bg-transparent border-b border-brand-border outline-none focus:border-brand-gold italic font-bold" />
                            </div>
                         </div>
                         
                         <div className="pt-8">
                            <button className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-premium">
                               Mettre à jour les informations
                            </button>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
         </div>
      </main>

      {/* FAB - Mes Services */}
      {activeTab === 'services' && (
        <button 
          onClick={() => setIsAddServiceModalOpen(true)}
          className="fixed bottom-24 lg:bottom-12 right-8 w-16 h-16 bg-brand-green text-brand-gold-light rounded-none shadow-premium flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 shimmer"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Transaction Success Modal */}
      <AnimatePresence>
        {showResultModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-brand-green-dark/95 backdrop-blur-xl"
               onClick={() => setShowResultModal(false)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               className="relative w-full max-w-xl bg-brand-green-dark border-2 border-brand-gold p-12 text-center shadow-premium"
             >
                <div className="w-20 h-20 bg-brand-gold text-brand-green-dark rounded-none mx-auto mb-8 flex items-center justify-center shadow-premium pulse-gold">
                   <ShieldCheck className="w-10 h-10" />
                </div>

                <h2 className="text-4xl font-serif font-black text-brand-gold-light mb-8 italic italic-only tracking-tighter">
                  Transaction Validée !
                </h2>

                <div className="bg-white/5 border border-brand-gold/30 rounded-none p-8 mb-10 text-left space-y-6">
                   <div className="flex justify-between items-center text-white">
                      <span className="font-serif italic text-lg">Montant total facture</span>
                      <span className="text-2xl font-black">{parseInt(invoiceAmount).toLocaleString()} FCFA</span>
                   </div>
                   
                   <div className="h-px bg-white/10 w-full" />
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#F0C040]">Votre part (90%)</span>
                         <span className="text-xl font-black text-[#F0C040]">{(parseInt(invoiceAmount) * 0.9).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Cashback membre (3%)</span>
                         <span className="text-lg font-black text-green-400">{(parseInt(invoiceAmount) * 0.03).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commission IBC (7%)</span>
                         <span className="text-lg font-black text-slate-400">{(parseInt(invoiceAmount) * 0.07).toLocaleString()} FCFA</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => {
                    setShowResultModal(false);
                    setMemberFound(null);
                    setMemberId('');
                    setInvoiceAmount('');
                    setActiveTab('dashboard');
                  }}
                  className="w-full py-5 bg-brand-gold text-brand-green-dark font-black text-sm uppercase tracking-[0.3em] rounded-none hover:brightness-110 transition-all shimmer"
                >
                  Nouvelle transaction
                </button>
             </motion.div>
          </div>
        )}

        {/* Add Service Modal (Simplified) */}
        {isAddServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-brand-green-dark/80 backdrop-blur-md"
               onClick={() => setIsAddServiceModalOpen(false)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               className="relative w-full max-w-lg bg-white rounded-none p-10 shadow-premium"
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-3xl font-serif font-black italic text-brand-green-dark">Nouveau Service</h3>
                   <button onClick={() => setIsAddServiceModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-none transition-colors">
                     <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                <form className="space-y-6">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-green-dark/40">Nom du service</label>
                      <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-brand-gold" placeholder="Ex: Menu Signature" />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix (FCFA)</label>
                      <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-brand-gold" placeholder="0" />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                      <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-brand-gold h-24 resize-none" placeholder="Décrivez votre service..." />
                   </div>
                   <button type="button" className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-sm uppercase tracking-[0.3em] rounded-none shadow-premium hover:brightness-110 transition-all">
                      Enregistrer
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
