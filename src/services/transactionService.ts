// =============================================================
// transactionService.ts — Moteur financier IBC
// Répartition : 90% Partenaire | 3% Cashback Membre | 7% Admin
// IMPORTANT : IBC n'est PAS une plateforme de réservation.
// Le membre consomme SUR PLACE, paie, puis le système répartit.
// =============================================================

import { ibcToast } from '../utils/ibc-toast';

// --- INTERFACES ---

export interface IBCTransaction {
  id: string;
  date: string;
  heure: string;
  membreId: string;
  partenaireNom: string;
  montant: number;
  partenaireShare: number;   // 90%
  membreCashback: number;    // 3%
  adminCommission: number;   // 7%
  statut: 'Transaction validée' | 'Revenu enregistré' | 'En attente';
}

export interface IBCStats {
  totalTransactions: number;
  totalRevenus7pct: number;
  totalCashback3pct: number;
  totalMembres: number;
  totalPartenaires: number;
}

// --- GÉNÉRATION ID UNIQUE ---

/**
 * Génère un ID unique IBC : "IBC-" + 8 caractères alphanumériques majuscules
 * Ex: IBC-A4F2B1C9
 */
export const genererID = (prefix = 'IBC'): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
};

// --- GESTION WALLET ---

/**
 * Récupère le solde du wallet d'un utilisateur depuis localStorage
 */
export const getSolde = (userId: string): number => {
  const solde = localStorage.getItem(`ibc_wallet_${userId}`);
  return solde ? Number(solde) : 0;
};

/**
 * Crédite le wallet d'un utilisateur
 */
export const crediterWallet = (userId: string, montant: number): void => {
  const soldeActuel = getSolde(userId);
  localStorage.setItem(`ibc_wallet_${userId}`, String(soldeActuel + montant));
};

/**
 * Débite le wallet d'un utilisateur
 * Retourne false si solde insuffisant
 */
export const debiterWallet = (userId: string, montant: number): boolean => {
  const soldeActuel = getSolde(userId);
  if (soldeActuel < montant) return false;
  localStorage.setItem(`ibc_wallet_${userId}`, String(soldeActuel - montant));
  return true;
};

// --- VALIDATION TRANSACTION (COEUR DU SYSTÈME IBC) ---

/**
 * Valide une transaction IBC.
 * Appelé par le PARTENAIRE après que le membre ait payé sa facture sur place.
 * 
 * Répartition automatique sur chaque paiement :
 * - 90% → Partenaire (son revenu)
 * - 3%  → Membre (cashback sur son wallet)
 * - 7%  → Admin IBC (commission plateforme)
 * 
 * @param membreId - ID unique du membre (ex: IBC-A4F2B1C9)
 * @param partenaireNom - Nom de l'établissement partenaire
 * @param montant - Montant total de la facture en FCFA
 */
export const validerTransaction = (
  membreId: string,
  partenaireNom: string,
  montant: number
): IBCTransaction => {
  // Calcul de la répartition
  const partenaireShare  = Math.round(montant * 0.90);
  const membreCashback   = Math.round(montant * 0.03);
  const adminCommission  = Math.round(montant * 0.07);

  // Création de la transaction
  const now = new Date();
  const transaction: IBCTransaction = {
    id: genererID('TXN'),
    date: now.toLocaleDateString('fr-FR'),
    heure: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    membreId,
    partenaireNom,
    montant,
    partenaireShare,
    membreCashback,
    adminCommission,
    statut: 'Transaction validée',
  };

  // Sauvegarde dans localStorage
  const existing = localStorage.getItem('ibc_transactions');
  const transactions: IBCTransaction[] = existing ? JSON.parse(existing) : [];
  transactions.unshift(transaction); // Ajout en tête de liste
  localStorage.setItem('ibc_transactions', JSON.stringify(transactions));

  // Créditer le cashback sur le wallet du membre
  crediterWallet(membreId, membreCashback);

  // Notification cashback au membre
  ibcToast.cashback(`💰 Cashback de ${membreCashback.toLocaleString('fr-FR')} FCFA crédité sur votre wallet !`);

  // Passer le statut à "Revenu enregistré"
  transaction.statut = 'Revenu enregistré';

  return transaction;
};

// --- RÉCUPÉRATION DES TRANSACTIONS ---

/**
 * Récupère les transactions filtrées par rôle
 * @param userId - ID de l'utilisateur
 * @param role - 'membre' | 'partenaire' | 'admin'
 */
export const getTransactions = (
  userId: string,
  role: 'membre' | 'partenaire' | 'admin'
): IBCTransaction[] => {
  const existing = localStorage.getItem('ibc_transactions');
  const all: IBCTransaction[] = existing ? JSON.parse(existing) : [];

  if (role === 'admin') return all;
  if (role === 'membre') return all.filter(t => t.membreId === userId);
  if (role === 'partenaire') return all.filter(t => t.partenaireNom === userId);
  return [];
};

// Alias pour compatibilité avec le code existant
export const getTransactionsForUser = getTransactions;

// --- STATISTIQUES ADMIN ---

/**
 * Retourne les KPIs globaux pour le dashboard admin
 */
export const getStatsAdmin = (): IBCStats => {
  const existing = localStorage.getItem('ibc_transactions');
  const all: IBCTransaction[] = existing ? JSON.parse(existing) : [];

  return {
    totalTransactions: all.length,
    totalRevenus7pct: all.reduce((acc, t) => acc + t.adminCommission, 0),
    totalCashback3pct: all.reduce((acc, t) => acc + t.membreCashback, 0),
    totalMembres: Number(localStorage.getItem('ibc_total_membres') || 0),
    totalPartenaires: Number(localStorage.getItem('ibc_total_partenaires') || 0),
  };
};

// --- PRÉLÈVEMENT ABONNEMENT MENSUEL ---

/**
 * Prélève 500 FCFA/mois sur le wallet du membre
 * Si solde insuffisant → statut abonnement = 'expiré'
 */
export const prelevementAbonnement = (membreId: string): boolean => {
  const FRAIS_ABONNEMENT = 500;
  const success = debiterWallet(membreId, FRAIS_ABONNEMENT);

  if (!success) {
    ibcToast.error('Solde insuffisant pour le renouvellement de votre abonnement IBC.');
    // Marquer l'abonnement comme expiré
    const abonnements = JSON.parse(localStorage.getItem('ibc_abonnements') || '{}');
    abonnements[membreId] = { statut: 'expiré', date: new Date().toISOString() };
    localStorage.setItem('ibc_abonnements', JSON.stringify(abonnements));
    return false;
  }

  // Enregistrer le paiement
  const abonnements = JSON.parse(localStorage.getItem('ibc_abonnements') || '{}');
  abonnements[membreId] = { statut: 'actif', date: new Date().toISOString() };
  localStorage.setItem('ibc_abonnements', JSON.stringify(abonnements));
  ibcToast.success('Abonnement IBC renouvelé avec succès !');
  return true;
};

// Alias utilisé dans certains composants
export { getSolde as getSoldeWallet };
