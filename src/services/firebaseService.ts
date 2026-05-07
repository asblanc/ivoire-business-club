import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firebaseService = {
  async createUserProfile(uid: string, data: any) {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        balance: 0,
        status: 'BRONZE',
        memberId: Math.random().toString(36).substring(2, 10).toUpperCase(),
        createdAt: Timestamp.now(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${uid}`);
    }
  },

  async getUserProfile(uid: string) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${uid}`);
    }
  },

  async getPartnerByOwner(uid: string) {
    try {
      const q = query(collection(db, 'partners'), where('ownerUid', '==', uid));
      const snap = await getDocs(q);
      return snap.empty ? null : snap.docs[0].data();
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'partners');
    }
  },

  async recordTransaction(memberUid: string, partnerId: string, amount: number) {
    try {
      const cashback = amount * 0.03;
      const platformGain = amount * 0.07;
      const partnerNet = amount * 0.90;

      const transData = {
        memberUid,
        partnerId,
        amount,
        cashbackAmount: cashback,
        platformGain,
        partnerNet,
        timestamp: Timestamp.now(),
      };

      await addDoc(collection(db, 'transactions'), transData);

      // Update member balance (In a real app, use a Cloud Function for this)
      const userRef = doc(db, 'users', memberUid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0;
        await updateDoc(userRef, {
          balance: currentBalance + cashback
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'transactions');
    }
  }
};
