import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, History, Star, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface MemberDashboardProps {
  profile: any;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ profile }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ID Card */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-brand-gold" />
            <h3 className="label-caps !opacity-100 italic text-brand-gold font-bold">Identité du Membre Elite</h3>
          </div>
          
          <div className="relative aspect-[16/9] w-full max-w-2xl overflow-hidden shadow-premium bg-brand-green-dark border-2 border-brand-gold shimmer group flex flex-col sm:flex-row">
            {/* Left accent panel */}
            <div className="sm:w-1/3 bg-brand-green-dark p-10 flex flex-col justify-between relative overflow-hidden text-white border-r border-brand-gold/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold opacity-5 transform translate-x-12 -translate-y-12 rounded-none" />
               
               <div className="z-10">
                 <Logo size="md" className="mb-4" />
                 <p className="label-caps text-brand-gold-light opacity-60 text-[8px] font-bold">Réseau d'Affaires</p>
               </div>

               <div className="mt-8 z-10">
                  <p className="label-caps text-white/40 mb-3 text-[7px] font-black">Membre Certifié</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-brand-gold/30 flex items-center justify-center font-serif font-black text-brand-gold italic bg-white/5">
                      {profile?.name?.substring(0, 2).toUpperCase() || 'ID'}
                    </div>
                    <div>
                      <p className="text-xl font-serif italic text-white leading-tight font-black tracking-tighter">{profile?.name || '---'}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Right content panel */}
            <div className="sm:w-2/3 bg-brand-cream p-10 flex flex-col justify-between">
              <header className="flex justify-between items-start">
                <div>
                  <span className={`px-4 py-1 border-2 border-brand-gold text-brand-green-dark text-[9px] tracking-[0.3em] font-black mb-4 inline-block shadow-lg ${profile?.status === 'GOLD' ? 'gradient-gold' : 'bg-white'}`}>
                    {profile?.status || 'BRONZE'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="label-caps text-brand-green-dark/40 text-[7px] font-black">Frais de Club Mensuels</p>
                  <p className="text-xl font-serif font-black text-brand-green-dark tracking-tighter italic">500 <span className="text-[10px]">FCFA</span></p>
                </div>
              </header>

              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <div className="border-l-2 border-brand-gold pl-6">
                    <p className="label-caps mb-1 italic text-brand-green-dark/40 text-[7px] font-black">Identifiant Unique</p>
                    <p className="text-4xl font-serif font-black tracking-tighter text-brand-green-dark italic">#{profile?.memberId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white border-2 border-brand-gold shadow-premium shrink-0">
                  <QRCodeSVG 
                    value={profile?.memberId || 'N/A'} 
                    size={80}
                    level="H"
                    includeMargin={false}
                    fgColor="#1B5E35"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="lg:col-span-4 flex flex-col justify-end">
          <div className="bg-brand-green-dark p-12 border-2 border-brand-gold/30 shadow-premium relative overflow-hidden group hover:border-brand-gold transition-colors duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-none -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
            
            <p className="label-caps mb-4 text-brand-gold !opacity-100 font-bold tracking-widest italic">Cashback Disponible</p>
            <h3 className="text-6xl font-serif font-black text-white leading-none tracking-tighter italic mb-2">
              {profile?.balance?.toLocaleString() || 0} <span className="text-lg text-brand-gold font-normal">FCFA</span>
            </h3>
            
            <div className="h-px w-full bg-brand-gold/20 my-8" />
            
            <div className="flex justify-between text-[9px] mb-12 text-white/40 font-black uppercase tracking-[0.3em]">
              <span>Distribution: 3% Membre</span>
            </div>

            <button className="w-full py-5 bg-brand-gold text-brand-green-dark font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all flex items-center justify-center gap-2 shimmer active:scale-95">
              Accès au Catalogue
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* History section */}
      <div className="pt-20 border-t border-brand-gold/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <p className="label-caps mb-3 text-brand-gold font-bold">Activités Récentes</p>
            <h3 className="text-4xl font-serif font-black italic text-brand-green-dark">Suivi des Avantages</h3>
          </div>
          <button className="text-[9px] uppercase tracking-[0.3em] font-black hover:text-brand-gold transition-colors">Tout l'historique</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { name: "La Réserve", type: "Restaurant Premium", amount: "+ 4 500", date: "Hier à 21:12" },
            { name: "Villa Blanche", type: "Espace Loisirs", amount: "+ 8 200", date: "15 Octobre" },
            { name: "Lounge 777", type: "Bar & Club", amount: "+ 1 150", date: "12 Octobre" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-10 border border-brand-cream shadow-premium hover:border-brand-gold transition-colors duration-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-serif font-black italic mb-1 tracking-tight">{item.name}</h4>
                  <p className="text-[8px] uppercase tracking-widest font-bold text-brand-green-dark/40">{item.type}</p>
                </div>
                <div className="w-10 h-10 border border-brand-gold/10 flex items-center justify-center text-brand-gold bg-brand-cream/5 rounded-none group-hover:bg-brand-gold group-hover:text-brand-green-dark transition-colors duration-500">
                  <Star className="w-4 h-4" />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-serif font-black text-brand-green-dark italic">{item.amount} <span className="text-[10px]">FCFA</span></span>
                <span className="text-[8px] font-black uppercase text-brand-green-dark/30">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
