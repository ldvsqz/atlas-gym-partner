import { db } from './firebase';
import { getCurrentGymId } from './tenant';
import { cachedRequest, invalidateRequests } from './requestCache';
import {
    collection,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc,
    doc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';


const COLLECTION_NAME = 'finances';
const CASHBOX_COLLECTION_NAME = 'monthlyCashboxes';

class FinanceService {
    static #instance;

    static getInstance() {
        if (!FinanceService.#instance) {
            FinanceService.#instance = new FinanceService();
        }
        return FinanceService.#instance;
    }

    constructor() { }

    //add a finance to firebase
    async add(finance) {
        try {
            const financeRef = collection(db, COLLECTION_NAME);
            const docRef = doc(financeRef);
            const gymId = await getCurrentGymId();
            const plainFinance = { ...finance, id: docRef.id, gymId };
            await setDoc(docRef, plainFinance);
            invalidateRequests('finance:all');
            return plainFinance;
        } catch (error) {
            console.error('Error trying to insert finance:', error);
            throw error;
        }
    }

    async getAll() {
        return cachedRequest('finance:all', async () => {
            const financeRef = collection(db, COLLECTION_NAME);
            const gymId = await getCurrentGymId();
            const querySnapshot = await getDocs(query(financeRef, where('gymId', '==', gymId)));
            return querySnapshot.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
        });
    }

    async delete(id) {
        const financeRef = doc(db, COLLECTION_NAME, id);
        try {
            await deleteDoc(financeRef);
            invalidateRequests('finance:all');
        } catch (error) {
            console.error('Error trying to delete finance:', error);
        }
    }


    //Update finance data by passing finance ID and new Data
    async update(id, newFinance) {
        const financeRef = doc(db, COLLECTION_NAME, id);
        try {
            const plainFinance = { ...newFinance };
            await updateDoc(financeRef, plainFinance);
            invalidateRequests('finance:all');
        } catch (error) {
            console.error('Error trying to update finance data:', error);
        }
    }

    async getMonthlyCashbox(month) {
        const cashboxRef = doc(db, CASHBOX_COLLECTION_NAME, month);
        try {
            const documentSnapshot = await getDoc(cashboxRef);
            if (!documentSnapshot.exists()) {
                return null;
            }

            return {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            };
        } catch (error) {
            console.error('Error trying to get monthly cashbox:', error);
            throw error;
        }
    }

    async saveMonthlyCashbox(month, cashbox) {
        const cashboxRef = doc(db, CASHBOX_COLLECTION_NAME, month);
        try {
            const currentCashbox = await getDoc(cashboxRef);
            const gymId = await getCurrentGymId();
            const payload = {
                ...cashbox,
                month,
                gymId,
                updatedAt: serverTimestamp(),
                ...(currentCashbox.exists() ? {} : { createdAt: serverTimestamp() })
            };

            await setDoc(cashboxRef, payload, { merge: true });
            invalidateRequests('finance:cashboxes');
            return { id: month, ...payload };
        } catch (error) {
            console.error('Error trying to save monthly cashbox:', error);
            throw error;
        }
    }

    async getAllMonthlyCashboxes() {
        try {
            return cachedRequest('finance:cashboxes', async () => {
              const cashboxRef = collection(db, CASHBOX_COLLECTION_NAME);
              const gymId = await getCurrentGymId();
              const querySnapshot = await getDocs(query(cashboxRef, where('gymId', '==', gymId)));
              const cashboxes = querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
              return cashboxes.sort((a, b) => {
                const monthA = (a.month || a.id || '').toString();
                const monthB = (b.month || b.id || '').toString();
                return monthB.localeCompare(monthA);
              });
            });
        } catch (error) {
            console.error('Error trying to get monthly cashbox history:', error);
            throw error;
        }
    }
}

export default FinanceService.getInstance();
