import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, deleteUser } from "firebase/auth";
import { app } from "./firebase"
import UserService from './userService';
import UserModel from "../src/models/UserModel";
import { Timestamp } from 'firebase/firestore';
import { DEFAULT_GYM_ID } from './tenant';

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();

const createAppError = (code, message) => {
    const error = new Error(message);
    error.code = code;
    return error;
};

const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const normalizedEmail = (res.user.email || '').trim().toLowerCase();
    const userExists = await UserService.existsByUid(res.user.uid);
    if (userExists) {
        const user = await UserService.get(res.user.uid);
        return user;
    } else {
        const user = new UserModel(
            res.user.birthday || Timestamp.now(),
            '',
            normalizedEmail,
            (res.user.displayName || '').trim(),
            res.user.phoneNumber || '',
            res.user.uid,
            Timestamp.now(),
            DEFAULT_GYM_ID,
        );
        await UserService.add(user);
        return user;
    }
};


const logInWithEmailAndPassword = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
};


const registerWithEmailAndPassword = async (dni, birthday, phone, name, email, password) => {
    const normalizedDni = (dni || '').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPhone = (phone || '').trim();
    const normalizedName = (name || '').trim();

    const res = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = new UserModel(
        birthday,
        normalizedDni,
        normalizedEmail,
        normalizedName,
        normalizedPhone,
        res.user.uid,
        Timestamp.now(),
        DEFAULT_GYM_ID,
    );

    try {
        await UserService.add(user);
        return user;
    } catch (error) {
        try {
            await deleteUser(res.user);
        } catch (deleteError) {
            console.warn('Error deleting auth user after profile creation failed');
        }
        throw createAppError('app/profile-create-failed', 'No se pudo crear el perfil del usuario.');
    }
};


const sendPasswordReset = async (email) => {
    const response = await sendPasswordResetEmail(auth, email);
    return response;
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
