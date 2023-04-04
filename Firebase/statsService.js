import { collection, deleteDoc, updateDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from "./firebase"



class StatService {

    static #instance;

    static getInstance() {
        if (!StatService.#instance) {
            StatService.#instance = new StatService();
        }
        return StatService.#instance;
    }

    constructor() { }


    //add a stats to firebase
    async add(stats) {
        const statsRef = doc(db, 'stats', stats.dni);
        try {
            await setDoc(statsRef, stats);
        } catch (error) {
            console.error('Error trying to insert stats:', error);
        }
    }


    //get stats data from a single stats by ID
    async get(statsId) {
        const statsRef = doc(db, 'stats', statsId);
        try {
            const documentSnapshot = await getDoc(statsRef);
            if (documentSnapshot.exists()) {
                const stats = {
                    id: documentSnapshot.id,
                    ...documentSnapshot.data()
                };
                return stats;
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    }

    //get all stats
    async getAll() {
        const statsRef = collection(db, 'stats');
        try {
            const querySnapshot = await getDocs(statsRef);
            const stats = [];
            querySnapshot.forEach((doc) => {
                stats.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return stats;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }


    //delete a single stats by ID
    async delete(dni) {
        const statsRef = doc(db, 'stats', dni);
        try {
            await deleteDoc(statsRef);
            console.log('stats deleted successfully');
        } catch (error) {
            console.error('Error trying to delete stats:', error);
        }
    }


    //Update stats data by passing stats ID and new Data
    async update(dni, newData) {
        const statsRef = doc(db, 'stats', dni);
        try {
            await updateDoc(statsRef, newData);
            console.log('stats data updated successfully');
        } catch (error) {
            console.error('Error trying to update stats data:', error);
        }
    }

    async getLast(dni) {
        if (!dni) {
            return null
        }
        const statsRef = collection(db, 'stats');
        const querySnapshot = await query(statsRef, where('dni', '==', dni), orderBy('routine_start_date', 'desc'), limit(1)); 
        if (querySnapshot.docs) {
            const documentSnapshot = querySnapshot.docs[0];
            const stats = {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            };
            return stats;
        } else {
            console.log(`No se encontró ningún usuario con DNI ${dni}`);
            return null;
        }
    }

    async getByDni(dni) {
        const statsRef = collection(db, 'stats');
        const query = query(statsRef, where('dni', '==', dni));
        const querySnapshot = await getDocs(query);

        const stats = [];

        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                stats.push({
                    id: doc.id,
                    ...doc.data()
                });
            }
        });

        return stats;
    }





}


export default StatService.getInstance();



