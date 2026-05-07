import { ibcToast } from '../utils/ibc-toast';

export interface IBCTransaction {
  id: string;
  date: string;
  heure: string;
  membreId: string;
  partenaireNom: string;
  montant: number;
  partenaireShare: number;
  membreCashback: number;
  adminCommission: number;
  statut: string;
}

export interface IBCStats {
  totalTransactions: number;
  totalRevenus7pct: number;
  totalCashback3pct: number;
  totalMembres: number;
  totalPartenaires: number;
}

/**
 * 1. Génère un ID unique alphanumérique
 */
export const genererID = (prefix = 'IBC'): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
};

/**
 * 3. Récupère le solde du wallet d'un utilisateur
 */
export const getSolde = (userId: string): number => {
  const solde = localStorage.getItem(`ibc_wallet_${userId}`);
  return solde ? Number(solde) : 0;
};

/**
 * 4. Crédite le wallet
 */
export const crediterWallet = (userId: string, montant: number): number => {
  const nouveauSolde = getSolde(userId) + montant;
  localStorage.setItem(`ibc_wallet_${userId}`, nouveauSolde.toString());
  return nouveauSolde;
};

/**
 * 4. Débite le wallet
 */
export const debiterWallet = (userId: string, montant: number): number => {
  const nouveauSolde = getSolde(userId) - montant;
  localStorage.setItem(`ibc_wallet_${userId}`, nouveauSolde.toString());
  return nouveauSolde;
};

/**
 * 2. Valide une transaction entre un membre et un partenaire
 */
export const validerTransaction = (membreId: string, partenaireNom: string, montant: number): IBCTransaction => {
  const partenaireShare = montant * 0.90;
  const membreCashback = montant * 0.03;
  const adminCommission = montant * 0.07;

  const now = new Date();
  const transaction: IBCTransaction = {
    id: genererID('T'),
    date: now.toLocaleDateString('fr-FR'),
    heure: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    membreId,
    partenaireNom,
    montant,
    partenaireShare,
    membreCashback,
    adminCommission,
    statut: "Validé"
  };

  // Sauvegarde de la transaction
  const history = JSON.parse(localStorage.getItem('ibc_transactions') || '[]');
  history.unshift(transaction);
  localStorage.setItem('ibc_transactions', JSON.stringify(history));

  // Crédit du cashback au membre
  crediterWallet(membreId, membreCashback);

  // Notification (via window.ibcToast exposé dans ibc-toast.ts)
  if ((window as any).ibcToast) {
    (window as any).ibcToast.cashback(`Cashback de ${membreCashback.toLocaleString()} FCFA crédité sur votre wallet ! 🎉`);
  }

  return transaction;
};

/**
 * 5. Récupère l'historique des transactions filtré par rôle
 */
export const getTransactions = (userId: string, role: 'membre' | 'partenaire' | 'admin'): IBCTransaction[] => {
  const history: IBCTransaction[] = JSON.parse(localStorage.getItem('ibc_transactions') || '[]');
  
  if (role === 'membre') {
    return history.filter(t => t.membreId === userId);
  } else if (role === 'partenaire') {
    // Dans cette version simplifiée, on utilise le businessName comme filtre
    return history.filter(t => t.partenaireNom === userId);
  }
  
  return history;
};

/**
 * 6. Gère le prélèvement mensuel de l'abonnement
 */
export const prelevementAbonnement = (membreId: string): boolean => {
  const solde = getSolde(membreId);
  const montantAbonnement = 500;

  if (solde >= montantAbonnement) {
    debiterWallet(membreId, montantAbonnement);
    
    const logs = JSON.parse(localStorage.getItem('ibc_abonnements') || '[]');
    logs.push({ membreId, date: new Date().toISOString(), montant: montantAbonnement });
    localStorage.setItem('ibc_abonnements', JSON.stringify(logs));
    
    return true;
  } else {
    // On pourrait mettre à jour le statut dans la DB Firebase ici
    if ((window as any).ibcToast) {
      (window as any).ibcToast.error("Solde insuffisant pour le renouvellement de votre abonnement (500 FCFA).");
    }
    return false;
  }
};

/**
 * 7. Statistiques pour l'administrateur
 */
export const getStatsAdmin = (): IBCStats => {
  const transactions = getTransactions('', 'admin');
  
  const totalRevenus7pct = transactions.reduce((acc, t) => acc + t.adminCommission, 0);
  const totalCashback3pct = transactions.reduce((acc, t) => acc + t.membreCashback, 0);
  
  // Simulation de comptage
  const totalMembres = 1248; // A lier dynamiquement à Firebase plus tard
  const totalPartenaires = 156;

  return {
    totalTransactions: transactions.length,
    totalRevenus7pct,
    totalCashback3pct,
    totalMembres,
    totalPartenaires
  };
};

// ==========================================
// BLOC DE TEST (Commenté)
// ==========================================
/*
const test = () => {
    const mId = "IBC-A4F2B1C9";
    console.log("Solde initial:", getSolde(mId));
    validerTransaction(mId, "Restaurant Le Plateau", 15000);
    console.log("Nouveau solde (doit avoir +450):", getSolde(mId));
};
// test();
*/
