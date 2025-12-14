import { collection, deleteDoc, updateDoc, getDocs, doc, getDoc, setDoc, query, where, limit } from 'firebase/firestore';
import { db } from "./firebase"

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
        const userData = { ...user }; // Convert UserModel object to plain JavaScript object
        try {
            await setDoc(userRef, userData);
            return true;
        } catch (error) {
            console.log(error);
        }
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
        try {
            const userRef = doc(db, COLLECTION_NAME, dni);
            const documentSnapshot = await getDoc(userRef);
            return documentSnapshot.exists();
        } catch (error) {
            return error;
        }
    }

    async existsByEMail(email) {
        const usersRef = collection(db, COLLECTION_NAME);
        const q = query(usersRef, where('email', '==', email), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            return true;
        } else {
            return false;
        }
    }


    //get all users
    async getAll() {
        const usersRef = collection(db, COLLECTION_NAME);
        try {
            const querySnapshot = await getDocs(usersRef);
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return users;
        } catch (error) {
            return error;
        }
    }


    //delete a single user by ID
    async delete(uid) {
        const userRef = doc(db, COLLECTION_NAME, uid);
        try {
            return await deleteDoc(userRef);
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
        const statsRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await query(statsRef, where('email', '==', email), limit(1));
        if (querySnapshot.docs) {
            const documentSnapshot = querySnapshot.docs[0];
            const stats = {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            };
            return stats;
        } else {
            return null;
        }
    }
}


export default UserService.getInstance();




