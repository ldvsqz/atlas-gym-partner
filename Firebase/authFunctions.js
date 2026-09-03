import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, deleteUser } from "firebase/auth";
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { app, db } from "./firebase"
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

const checkRegistrationAvailability = async ({ dni = '', email = '' }) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedDni = (dni || '').trim();

    if (!normalizedEmail && !normalizedDni) {
        return { available: true };
    }

    const checks = [];

    if (normalizedDni) {
        checks.push(getDocs(query(collection(db, 'users'), where('dni', '==', normalizedDni), limit(1))));
    }

    if (normalizedEmail) {
        checks.push(getDocs(query(collection(db, 'users'), where('email', '==', normalizedEmail), limit(1))));
    }

    const snapshots = await Promise.all(checks);
    const available = snapshots.every((snapshot) => snapshot.empty);
    return { available };
};


const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const normalizedEmail = (res.user.email || '').trim().toLowerCase();
    const userExists = await UserService.existsByUid(res.user.uid);
    const { available } = await checkRegistrationAvailability({ email: normalizedEmail });
    if (userExists) {
        const user = await UserService.get(res.user.uid);
        return user;
    } else if (!available) {
        throw createAppError('app/registration-unavailable', 'Ya existe un perfil registrado con estos datos.');
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

    const { available } = await checkRegistrationAvailability({
        dni: normalizedDni,
        email: normalizedEmail,
    });

    if (!available) {
        throw createAppError('app/registration-unavailable', 'Ya existe un perfil registrado con estos datos.');
    }

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
