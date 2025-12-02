import { collection, deleteDoc, updateDoc, getDocs, doc, getDoc, addDoc, setDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from "./firebase"

const COLLECTION_NAME = 'stats';

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
        console.info('Adding stats:', stats);
        try {
            const statsRef = collection(db, COLLECTION_NAME);
            const docRef = doc(statsRef);
            stats['id'] = docRef.id;
            await setDoc(docRef, stats);
        } catch (error) {
            console.error('Error trying to insert stats:', error);
        }
    }


    //get stats data from a single stats by ID
    async get(statsId) {
        const statsRef = doc(db, COLLECTION_NAME, statsId);
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
            console.error('Error al obtener estadisticas:', error);
        }
    }

    //get all stats
    async getAll() {
        const statsRef = collection(db, COLLECTION_NAME);
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
        const statsRef = doc(db, COLLECTION_NAME, dni);
        try {
            await deleteDoc(statsRef);
            console.log('stats deleted successfully');
        } catch (error) {
            console.error('Error trying to delete stats:', error);
        }
    }


    //Update stats data by passing stats ID and new Data
    async update(id, newStats) {
        console.info('Updating stats:', newStats);
        const statsRef = doc(db, COLLECTION_NAME, id);
        try {
            await updateDoc(statsRef, newStats);
        } catch (error) {
            console.error('Error trying to update stats data:', error);
        }
    }

    async getLast(uid) {
        if (!uid) {
            return null
        }
        const statsRef = collection(db, COLLECTION_NAME);
        const statsQuery = await query(statsRef, where('uid', '==', uid), orderBy('date', 'desc'), limit(1));
        try {
            const querySnapshot = await getDocs(statsQuery);
            if (querySnapshot.docs) {
                const documentSnapshot = querySnapshot.docs[0];
                const stats = {
                    id: documentSnapshot.id,
                    ...documentSnapshot.data()
                };
                return stats;
            }
        } catch (error) {
            return null;
        }
    }

    async getAllByUID(uid) {
        if (!uid) {
            return [];
        }

        const statsRef = collection(db, COLLECTION_NAME);
        const statsQuery = query(statsRef, where('uid', '==', uid), orderBy('date', 'desc'));

        try {
            const querySnapshot = await getDocs(statsQuery);

            const statsList = querySnapshot.docs.map((documentSnapshot) => {
                const stats = {
                    id: documentSnapshot.id,
                    ...documentSnapshot.data()
                };

                return stats;
            });

            return statsList;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return [];
        }
    }
}


export default StatService.getInstance();




