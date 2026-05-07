import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  History, 
  PieChart as PieChartIcon, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Bell,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Save,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Percent
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { 
  getStatsAdmin, 
  getTransactions, 
  IBCTransaction,
  IBCStats
} from '../services/transactionService';

interface AdminDashboardViewProps {
  user: any;
  profile: any;
}

const transData = [
  { name: '01/05', value: 45 },
  { name: '02/05', value: 52 },
  { name: '03/05', value: 38 },
  { name: '04/05', value: 65 },
  { name: '05/05', value: 48 },
  { name: '06/05', value: 70 },
  { name: '07/05', value: 85 },
];

const revenueSplit = [
  { name: 'Partenaires (90%)', value: 90 },
  { name: 'Membres (3%)', value: 3 },
  { name: 'Admin (7%)', value: 7 },
];

const COLORS = ['#2E7D52', '#C9A84C', '#F0C040'];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Stats and Transactions from Service
  const stats: IBCStats = getStatsAdmin();
  const allTransactions: IBCTransaction[] = getTransactions('', 'admin');

  const handleLogout = () => signOut(auth);

  const kpis = [
    { label: "Total Membres", value: stats.totalMembres.toLocaleString(), icon: <Users className="w-6 h-6" />, color: 'border-brand-gold' },
    { label: 'Total Partenaires', value: stats.totalPartenaires.toLocaleString(), icon: <Store className="w-6 h-6" />, color: 'border-brand-green' },
    { label: 'Transactions (Total)', value: stats.totalTransactions.toLocaleString(), icon: <History className="w-6 h-6" />, color: 'border-brand-gold-light' },
    { label: 'Revenus IBC (7%)', value: `${stats.totalRevenus7pct.toLocaleString()} FCFA`, icon: <TrendingUp className="w-6 h-6" />, color: 'border-brand-gold' },
    { label: 'Cashback Distribué', value: `${stats.totalCashback3pct.toLocaleString()} FCFA`, icon: <Percent className="w-6 h-6" />, color: 'border-brand-green' },
    { label: 'Abonnements', value: '624 000 FCFA', icon: <CreditCard className="w-6 h-6" />, color: 'border-brand-gold-light' },
  ];

  const members = [
    { id: 'IBC-A4F2B1C9', name: 'Alain Koffi', email: 'alain.k@gmail.com', status: 'GOLD', wallet: '45 000', sub: 'Actif' },
    { id: 'IBC-B8D2C5E1', name: 'Marie Kouadio', email: 'marie.kd@gmail.com', status: 'SILVER', wallet: '12 500', sub: 'Actif' },
    { id: 'IBC-X1Z9Y4F0', name: 'Jean Ehui', email: 'j.ehui@yahoo.fr', status: 'BRONZE', wallet: '2 800', sub: 'Expiré' },
  ];

  const partners = [
    { id: 'IBC-PRO-H4D2', name: 'Hôtel Particulier', type: 'Hôtel', status: 'Validé', revenue: '4.5M FCFA' },
    { id: 'IBC-PRO-R9E5', name: 'La Réserve', type: 'Restaurant', status: 'Validé', revenue: '2.8M FCFA' },
    { id: 'IBC-PRO-W3Q1', name: 'Sky Lounge', type: 'Bar', status: 'En attente', revenue: '0 FCFA' },
  ];

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 w-[260px] bg-brand-green flex-col z-50 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:flex'}`}>
        <div className="p-8">
           <div className="flex items-center gap-3 mb-12">
             <Logo size="md" />
             <div>
                <p className="text-white font-serif font-black text-sm italic">Administration</p>
                <div className="h-0.5 w-full bg-brand-gold mt-1" />
             </div>
           </div>
           
           <nav className="space-y-1">
             {[
               { id: 'overview', label: 'Vue globale', icon: <LayoutDashboard className="w-5 h-5" /> },
               { id: 'members', label: 'Membres', icon: <Users className="w-5 h-5" /> },
               { id: 'partners', label: 'Partenaires', icon: <Store className="w-5 h-5" />, badge: 3 },
               { id: 'transactions', label: 'Transactions', icon: <History className="w-5 h-5" /> },
               { id: 'commissions', label: 'Commissions', icon: <TrendingUp className="w-5 h-5" /> },
               { id: 'validations', label: 'Validations', icon: <ShieldCheck className="w-5 h-5" /> },
               { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                 className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold tracking-tight rounded-none transition-all ${
                   activeTab === item.id 
                     ? 'bg-brand-gold text-brand-green-dark shadow-premium scale-105' 
                     : 'text-white/60 hover:bg-brand-gold/10 hover:text-white'
                 }`}
               >
                 <div className="flex items-center gap-4">
                   {item.icon}
                   {item.label}
                 </div>
                 {item.badge && activeTab !== item.id && (
                   <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-none flex items-center justify-center animate-pulse">
                     {item.badge}
                   </span>
                 )}
               </button>
             ))}
           </nav>
        </div>

        <div className="mt-auto p-8">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-none transition-all"
           >
             <LogOut className="w-5 h-5" />
             Déconnexion
           </button>
        </div>
      </aside>

      {/* MOBILE TRIGGER */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-brand-green text-brand-gold-light rounded-none shadow-lg border border-brand-gold-light/30 flex items-center justify-center"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <main className="flex-1 lg:ml-[260px] bg-brand-cream">
         {/* TOP BAR */}
         <header className="h-[72px] bg-white border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-40">
           <h2 className="font-serif font-black italic text-brand-green-dark text-xl ml-12 lg:ml-0">
             Tableau de bord Admin
           </h2>

           <div className="flex items-center gap-6">
              <span className="px-4 py-1 bg-brand-gold text-brand-green-dark text-[9px] font-black uppercase tracking-[0.2em] rounded-none flex items-center gap-2">
                ADMIN CERTIFIÉ
              </span>
              <div className="w-10 h-10 rounded-none border border-brand-gold/30 bg-brand-cream overflow-hidden flex items-center justify-center text-brand-green-dark font-black">
                A
              </div>
           </div>
         </header>

         <div className="p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
               {activeTab === 'overview' && (
                 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                       {kpis.map((kpi, i) => (
                         <div key={i} className="card-luxe group hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 bg-brand-cream rounded-none flex items-center justify-center text-brand-green-dark mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors">
                               {kpi.icon}
                            </div>
                            <p className="label-caps mb-1 opacity-60 font-black">{kpi.label}</p>
                            <h3 className="text-2xl font-serif font-black text-brand-green-dark italic tracking-tight">{kpi.value}</h3>
                         </div>
                       ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                       <div className="bg-white p-10 rounded-none shadow-premium border border-brand-border/50">
                          <h3 className="text-2xl font-serif font-black italic text-brand-green-dark mb-10 tracking-tight">Transactions / jour — 30 jours</h3>
                          <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={transData}>
                                 <defs>
                                   <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#1B5E35" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#1B5E35" stopOpacity={0}/>
                                   </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                 <XAxis 
                                   dataKey="name" 
                                   axisLine={false} 
                                   tickLine={false} 
                                   tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} 
                                 />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} />
                                 <Tooltip contentStyle={{ borderRadius: '0px', border: 'none', shadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                 <Area 
                                   type="monotone" 
                                   dataKey="value" 
                                   stroke="#1B5E35" 
                                   strokeWidth={4} 
                                   fillOpacity={1} 
                                   fill="url(#colorAdmin)" 
                                 />
                               </AreaChart>
                             </ResponsiveContainer>
                          </div>
                       </div>

                       <div className="bg-white p-10 rounded-none shadow-premium border border-slate-100 flex flex-col">
                          <h3 className="text-2xl font-serif font-black italic text-brand-green-dark mb-10">Répartition revenus</h3>
                          <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                               <PieChart>
                                 <Pie
                                   data={revenueSplit}
                                   cx="50%"
                                   cy="40%"
                                   innerRadius={60}
                                   outerRadius={100}
                                   paddingAngle={5}
                                   dataKey="value"
                                 >
                                   {revenueSplit.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                 </Pie>
                                 <Tooltip />
                                 <Legend verticalAlign="bottom" height={36}/>
                               </PieChart>
                            </ResponsiveContainer>
                          </div>
                       </div>
                    </div>

                    {/* Transactions Table */}
                    <section>
                       <div className="flex justify-between items-end mb-8">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2">Live Monitor</p>
                             <h3 className="text-3xl font-serif font-black italic text-brand-green-dark italic-only">Dernières transactions</h3>
                          </div>
                       </div>
                       <div className="bg-white rounded-none shadow-premium overflow-hidden border border-slate-100">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                               <thead className="bg-brand-cream border-b border-brand-border">
                                  <tr>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date/Heure</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Membre</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Partenaire</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Montant</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">90%</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">3%</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">7%</th>
                                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  {allTransactions.length > 0 ? allTransactions.map((t, i) => (
                                     <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-6 font-mono text-[10px] font-bold text-slate-400 uppercase">{t.id}</td>
                                        <td className="px-8 py-6 text-xs text-slate-500">{t.heure}</td>
                                        <td className="px-8 py-6 text-sm font-bold text-brand-green-dark">{t.membreId}</td>
                                        <td className="px-8 py-6 text-sm italic">{t.partenaireNom}</td>
                                        <td className="px-8 py-6 text-sm font-black">{t.montant.toLocaleString()}</td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-brand-gold">{t.partenaireShare.toLocaleString()}</td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-brand-gold-light">{t.membreCashback.toLocaleString()}</td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-brand-gold">{t.adminCommission.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                           <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold font-black text-[9px] uppercase rounded-none">{t.statut}</span>
                                        </td>
                                     </tr>
                                  )) : (
                                     <tr>
                                        <td colSpan={9} className="px-8 py-10 text-center text-slate-400 font-serif italic">Aucune transaction enregistrée</td>
                                     </tr>
                                  )}
                               </tbody>
                            </table>
                          </div>
                       </div>
                    </section>
                 </motion.div>
               )}

               {activeTab === 'members' && (
                 <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="flex justify-between items-center bg-white p-6 rounded-none shadow-premium border border-slate-100">
                       <div className="flex items-center gap-4 flex-1">
                          <Search className="w-5 h-5 text-brand-green-dark" />
                          <input type="text" placeholder="Rechercher un membre par ID ou Nom..." className="bg-transparent border-none outline-none font-serif italic text-lg w-full" />
                       </div>
                    </div>
                    
                    <div className="bg-white rounded-none shadow-premium overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-[#F5F3EE]">
                             <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">ID IBC</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Wallet</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Abonnement</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                             </tr>
                          </thead>
                          <tbody>
                             {members.map((m, i) => (
                               <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                 <td className="px-8 py-6 font-mono font-bold text-brand-gold">{m.id}</td>
                                 <td className="px-8 py-6">
                                    <p className="font-serif font-black italic text-brand-green-dark">{m.name}</p>
                                    <p className="text-[10px] text-slate-400">{m.email}</p>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={`px-4 py-1 rounded-none text-[9px] font-black uppercase tracking-widest ${
                                      m.status === 'GOLD' ? 'bg-brand-gold/20 text-brand-gold' : 
                                      m.status === 'SILVER' ? 'bg-brand-gold-light/20 text-brand-gold-light' : 'bg-brand-gold text-brand-green'
                                    }`}>
                                      {m.status}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6 font-black italic">{m.wallet} FCFA</td>
                                 <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-none text-[9px] font-black uppercase ${
                                      m.sub === 'Actif' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>{m.sub}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <button className="p-2 hover:bg-brand-cream rounded-none transition-colors"><MoreVertical className="w-4 h-4 text-brand-green-dark" /></button>
                                 </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'partners' && (
                 <motion.div key="partners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="bg-white rounded-none shadow-premium overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-[#F5F3EE]">
                             <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Structure</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenus Générés</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody>
                             {partners.map((p, i) => (
                               <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                 <td className="px-8 py-6 font-mono font-bold text-slate-400">{p.id}</td>
                                 <td className="px-8 py-6 font-serif font-black italic text-brand-green-dark">{p.name}</td>
                                 <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-brand-cream text-brand-green-dark text-[9px] font-black uppercase rounded-none">{p.type}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-widest ${
                                      p.status === 'Validé' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>{p.status}</span>
                                 </td>
                                 <td className="px-8 py-6 font-black italic">{p.revenue}</td>
                                 <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                       <button className="w-9 h-9 bg-green-500 text-white rounded-none flex items-center justify-center hover:scale-110 transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                                       <button className="w-9 h-9 bg-red-500 text-white rounded-none flex items-center justify-center hover:scale-110 transition-all"><XCircle className="w-4 h-4" /></button>
                                    </div>
                                 </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'transactions' && (
                 <motion.div key="transactions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <div>
                     <p className="label-caps mb-2">Flux de Données</p>
                     <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Toutes les transactions</h3>
                   </div>
                   <div className="bg-white rounded-none shadow-premium overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-[#F5F3EE]">
                            <tr>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date/Heure</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Membre</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Partenaire</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Montant</th>
                               <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Com. 7%</th>
                            </tr>
                         </thead>
                         <tbody>
                            {allTransactions.map((t, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-6 text-xs text-slate-500">{t.date} {t.heure}</td>
                                <td className="px-8 py-6 font-bold text-brand-green-dark">{t.membreId}</td>
                                <td className="px-8 py-6 font-serif italic">{t.partenaireNom}</td>
                                <td className="px-8 py-6 font-black italic">{t.montant.toLocaleString()} FCFA</td>
                                <td className="px-8 py-6 font-black text-brand-gold">{t.adminCommission.toLocaleString()} FCFA</td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'commissions' && (
                 <motion.div key="commissions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <div className="bg-brand-green-dark p-16 rounded-none text-center border-2 border-brand-gold relative overflow-hidden shadow-premium">
                       <TrendingUp className="w-16 h-16 text-brand-gold mx-auto mb-8" />
                       <p className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-gold mb-6">Total Commissions Perçues (7%)</p>
                       <h2 className="text-7xl lg:text-8xl font-serif font-black text-brand-gold italic tracking-tighter">
                         {stats.totalRevenus7pct.toLocaleString()} <span className="text-xl italic opacity-60">FCFA</span>
                       </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-white p-10 shadow-premium border border-brand-border/50">
                          <h4 className="text-xl font-serif font-black italic mb-6">Top Partenaires (Apporteurs)</h4>
                          <div className="space-y-6">
                             {partners.slice(0, 3).map((p, i) => (
                               <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0">
                                  <span className="font-serif italic font-bold">{p.name}</span>
                                  <span className="font-black text-brand-gold">{(parseInt(p.revenue.split('M')[0]) * 1000000 * 0.07).toLocaleString()} FCFA</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="bg-white p-10 shadow-premium border border-brand-border/50">
                          <h4 className="text-xl font-serif font-black italic mb-6">Cashback redistribué (3%)</h4>
                          <div className="text-center py-8">
                            <div className="text-5xl font-serif font-black text-brand-green-dark italic mb-2">{stats.totalCashback3pct.toLocaleString()}</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">FCFA injectés dans le pouvoir d'achat</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'validations' && (
                 <motion.div key="validations" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                   <div>
                     <p className="label-caps mb-2">Centre de Contrôle</p>
                     <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Dossiers en attente de validation</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6">
                      {[
                        { name: "Sky Lounge", type: "Partenaire", date: "Hier, 14:20", id: "IBC-PRO-W3Q1", img: "/src/assets/sky-lounge-bar.jpg" },
                        { name: "Jean Ehui", type: "Membre (Abonnement)", date: "Aujourd'hui, 09:12", id: "IBC-X1Z9Y4F0" }
                      ].map((v, i) => (
                        <div key={i} className="bg-white p-8 rounded-none shadow-premium border border-brand-border flex flex-col md:flex-row justify-between items-center gap-8">
                           <div className="flex items-center gap-8">
                              <div className="w-16 h-16 bg-brand-cream rounded-none flex items-center justify-center text-brand-gold overflow-hidden border border-brand-gold/10">
                                {(v as any).img ? <img src={(v as any).img} alt={v.name} className="w-full h-full object-cover" /> : (v.type === 'Partenaire' ? <Store /> : <Users />)}
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-1">{v.type}</p>
                                 <h4 className="text-2xl font-serif font-black italic text-brand-green-dark">{v.name}</h4>
                                 <p className="text-xs text-slate-400 font-serif italic">ID: {v.id} • Soumis le {v.date}</p>
                              </div>
                           </div>
                           <div className="flex gap-4 w-full md:w-auto">
                              <button className="flex-1 md:flex-none px-10 py-4 bg-brand-green text-brand-gold font-black text-[10px] uppercase tracking-widest shadow-premium hover:bg-brand-green-dark transition-all">Approuver</button>
                              <button className="flex-1 md:flex-none px-10 py-4 border-2 border-red-100 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Rejeter</button>
                           </div>
                        </div>
                      ))}
                   </div>
                 </motion.div>
               )}

               {activeTab === 'settings' && (
                 <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12">
                     <div className="bg-white p-12 rounded-none shadow-premium border border-slate-100">
                        <div className="flex items-center gap-4 mb-12">
                           <div className="w-14 h-14 bg-brand-cream rounded-none flex items-center justify-center text-brand-green-dark">
                             <Settings className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="text-3xl font-serif font-black italic text-brand-green-dark italic-only">Paramètres Plateforme</h3>
                              <p className="text-sm font-serif italic text-slate-400">Gestion des frais et commissions globales</p>
                           </div>
                        </div>

                        <form className="space-y-10">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Taux Cashback Membre</label>
                                 <div className="relative">
                                    <input type="number" defaultValue="3" className="w-full h-14 px-6 bg-brand-cream border-none outline-none focus:ring-2 focus:ring-brand-gold rounded-none font-black text-brand-green-dark" />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-brand-gold">%</span>
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commission Admin</label>
                                 <div className="relative">
                                    <input type="number" defaultValue="7" className="w-full h-14 px-6 bg-brand-cream border-none outline-none focus:ring-2 focus:ring-brand-gold rounded-none font-black text-brand-green-dark" />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-brand-gold">%</span>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Frais Abonnement Mensuel</label>
                              <div className="relative">
                                 <input type="number" defaultValue="500" className="w-full h-14 px-6 bg-brand-cream border-none outline-none focus:ring-2 focus:ring-brand-gold rounded-none font-black text-brand-green-dark" />
                                 <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-brand-gold italic">FCFA</span>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Support Plateforme</label>
                              <input type="email" defaultValue="support@ibc.ci" className="w-full h-14 px-6 bg-brand-cream border-none outline-none focus:ring-2 focus:ring-brand-gold rounded-none font-serif italic text-brand-green-dark" />
                           </div>

                           <button 
                             type="button"
                             onClick={() => setShowSaveModal(true)}
                             className="w-full py-5 bg-brand-green text-brand-gold-light font-black text-sm uppercase tracking-[0.3em] rounded-none shadow-premium hover:brightness-110 transition-all flex items-center justify-center gap-4 shimmer"
                           >
                             <Save className="w-5 h-5" />
                             Sauvegarder les Paramètres
                           </button>
                        </form>
                     </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-green-dark/90 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-sm bg-white rounded-none p-10 text-center shadow-premium">
                <div className="w-16 h-16 bg-brand-cream text-brand-gold rounded-none flex items-center justify-center mx-auto mb-6">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif font-black italic text-brand-green-dark mb-4">Confirmer ?</h4>
                <p className="text-sm font-serif italic text-slate-500 mb-8 leading-relaxed">Voulez-vous vraiment modifier les taux et frais de la plateforme IBC ? Ces changements seront effectifs immédiatement.</p>
                <div className="flex gap-4">
                   <button onClick={() => setShowSaveModal(false)} className="flex-1 py-4 border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-50">Annuler</button>
                   <button onClick={() => setShowSaveModal(false)} className="flex-1 py-4 bg-brand-green text-brand-gold-light font-black text-[10px] uppercase tracking-widest rounded-none shadow-premium">Confirmer</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
