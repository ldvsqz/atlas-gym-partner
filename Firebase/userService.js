import { collection, deleteDoc, updateDoc, getDocs, doc, getDoc, setDoc, query, where, limit } from 'firebase/firestore';
import { db } from "./firebase"
import { DEFAULT_GYM_ID } from './tenant';
import { cachedRequest, invalidateRequests } from './requestCache';

const COLLECTION_NAME = 'users';

class UserService {

    static #instance;

    static getInstance() {
        if (!UserService.#instance) {
            UserService.#instance = new UserService();
        }
        return UserService.#instance;
    }

    constructor() { }


    //add a user to firebase
    async add(user) {
        const userRef = doc(db, COLLECTION_NAME, user.uid);
        const userData = { ...user, gymId: user.gymId || DEFAULT_GYM_ID }; // Convert UserModel object to plain JavaScript object
        await setDoc(userRef, userData);
        return true;
    }



    //get user data from a single user by ID
    async get(uid) {
        const userRef = doc(db, COLLECTION_NAME, uid);
        try {
            const documentSnapshot = await getDoc(userRef);
            if (documentSnapshot.exists()) {
                const user = {
                    id: documentSnapshot.id,
                    ...documentSnapshot.data()
                };
                return user;
            }
        } catch (error) {
            return error;
        }
    }

    async exists(dni) {
        return this.existsByDni(dni);
    }

    async existsByUid(uid) {
        const userRef = doc(db, COLLECTION_NAME, uid);
        const documentSnapshot = await getDoc(userRef);
        return documentSnapshot.exists();
    }

    async existsByDni(dni) {
        const usersRef = collection(db, COLLECTION_NAME);
        const q = query(usersRef, where('dni', '==', dni), limit(1));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
    }

    async existsByEMail(email) {
        const usersRef = collection(db, COLLECTION_NAME);
        const q = query(usersRef, where('email', '==', email), limit(1));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
    }

    async existsByEmail(email) {
        return this.existsByEMail(email);
    }


    //get all users
    async getAll() {
        return cachedRequest('users:all', async () => {
            const usersRef = collection(db, COLLECTION_NAME);
            const querySnapshot = await getDocs(query(usersRef, where('gymId', '==', DEFAULT_GYM_ID)));
            return querySnapshot.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
        });
    }


    //delete a single user by ID
    async delete(uid) {
        const userRef = doc(db, COLLECTION_NAME, uid);
        try {
            const result = await deleteDoc(userRef);
            invalidateRequests('users:all');
            return result;
        } catch (error) {
            return error
        }
    }


    //Update user data by passing user ID and new Data
    update(uid, newData) {
        return new Promise((resolve, reject) => {
            const userRef = doc(db, COLLECTION_NAME, uid);
            const userData = { ...newData }; // Convert UserModel object to plain JavaScript object
            updateDoc(userRef, userData)
                .then(() => {
                    resolve(); // Resolves the promise without any value
                })
                .catch((error) => {
                    reject(error); // Rejects the promise with the error
                });
        });
    }


    async getByEMail(email) {
        const usersRef = collection(db, COLLECTION_NAME);
        const q = query(usersRef, where('email', '==', email), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const documentSnapshot = querySnapshot.docs[0];
            const user = {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            };
            return user;
        } else {
            return null;
        }
    }
}


export default UserService.getInstance();
