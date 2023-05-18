import { collection, deleteDoc, updateDoc, getDocs, doc, getDoc, setDoc, query, where, limit } from 'firebase/firestore';
import { db } from "./firebase"



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
        const userRef = doc(db, 'users', user.uid);
        try {
            return await setDoc(userRef, user);
        } catch (error) {
            return error;
        }
    }


    //get user data from a single user by ID
    async get(userId) {
        const userRef = doc(db, 'users', userId);
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
            const userRef = doc(db, 'users', dni);
            const documentSnapshot = await getDoc(userRef);
            return documentSnapshot.exists();
        } catch (error) {
            return error;
        }
    }


    //get all users
    async getAll() {
        const usersRef = collection(db, 'users');
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
        const userRef = doc(db, 'users', uid);
        try {
            return await deleteDoc(userRef);
        } catch (error) {
            return error
        }
    }


    //Update user data by passing user ID and new Data
    async update(uid, newData) {
        const userRef = doc(db, 'users', uid);
        try {
            return await updateDoc(userRef, newData);
        } catch (error) {
            return error;
        }
    }

    async getByEMail(email) {
        const statsRef = collection(db, 'users');
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




