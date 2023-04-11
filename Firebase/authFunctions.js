import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore"
import {db} from "./firebase"
import {app} from "./firebase"
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
            email : user.email
        })
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
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
            console.error(err);
            alert(err.message);
        }
    } else {
        console.error("el usuario ya existe");
        alert("el usuario ya existe");
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
    console.log("here!")
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