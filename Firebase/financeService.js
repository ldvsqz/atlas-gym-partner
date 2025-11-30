import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc,
    doc,
    query,
    where,
    orderBy
} from 'firebase/firestore';


const COLLECTION_NAME = 'finances';

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
        console.info('Adding finance:', finance);
        try {
            const financeRef = collection(db, COLLECTION_NAME);
            const docRef = doc(financeRef);
            finance['id'] = docRef.id;
            await setDoc(docRef, finance);
        } catch (error) {
            console.error('Error trying to insert finance:', error);
        }
    }

    async getAll() {
        const financeRef = collection(db, COLLECTION_NAME);
        try {
            const querySnapshot = await getDocs(financeRef);
            const finances = [];
            querySnapshot.forEach((doc) => {
                finances.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return finances;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }

    async delete(id) {
        const financeRef = doc(db, COLLECTION_NAME, id);
        try {
            await deleteDoc(financeRef);
            console.log('finance deleted successfully');
        } catch (error) {
            console.error('Error trying to delete finance:', error);
        }
    }


    //Update finance data by passing finance ID and new Data
    async update(id, newFinance) {
        console.info('Updating finance:', id);
        const financeRef = doc(db, COLLECTION_NAME, id);
        try {
            await updateDoc(financeRef, newFinance);
        } catch (error) {
            console.error('Error trying to update finance data:', error);
        }
    }
}

export default FinanceService.getInstance();