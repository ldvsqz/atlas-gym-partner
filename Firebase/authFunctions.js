import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore"
import { db } from "./firebase"
import { app } from "./firebase"
import UserService from './userService';
import UserModel from "../src/models/UserModel";

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();


const signInWithGoogle = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const userExists = await UserService.exists(user.uid);
            if (!userExists) {
                UserService.add({
                    uid: user.uid,
                    dni: '',
                    birthday: user.birthday,
                    phone: user.phoneNumber,
                    name: user.displayName,
                    email: user.email
                });
            }
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
};


const logInWithEmailAndPassword = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};


const registerWithEmailAndPassword = (dni, birthday, phone, name, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userExists = await UserService.exists(dni);
            if (!userExists) {
                try {
                    const res = await createUserWithEmailAndPassword(auth, email, password);
                    const user = res.user;
                    // Verificar si el usuario ya existe, crearlo en caso contrario
                    UserService.add({
                        uid: user.uid,
                        dni,
                        birthday,
                        phone,
                        name,
                        email,
                        until: new Date().toString(),
                        rol: 1
                    });
                    resolve(user);
                } catch (err) {
                    reject(err);
                }
            } else {
                resolve(null); // Usuario ya existe, devolver null
            }
        } catch (error) {
            reject(error);
        }
    });
};


const sendPasswordReset = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await sendPasswordResetEmail(auth, email);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
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