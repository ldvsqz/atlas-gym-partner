import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore"
import { db } from "./firebase"
import { app } from "./firebase"
import UserService from './userService';

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();


const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            UserService.add({
                uid: user.uid,
                dni: '',
                birthday: user.birthday,
                phone: user.phoneNumber,
                name: user.displayName,
                email: user.email
            })
        }
    } catch (err) {
        return err
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        return err
    }
};

const registerWithEmailAndPassword = async (dni, birthday, phone, name, email, password) => {
    const userExists = await UserService.exists(dni)
    if (!userExists) {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            //verificar si el usuario ya existe, crearlo en caso contrario
            UserService.add({
                uid: user.uid,
                dni,
                birthday,
                phone,
                name,
                email
            })
        } catch (err) {
            return err
        }
    } else {
        return err
    }
};

const sendPasswordReset = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

const logout = () => {
    signOut(auth);
};


export {
    signInWithGoogle,
    signInWithEmailAndPassword,
    auth,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout
};