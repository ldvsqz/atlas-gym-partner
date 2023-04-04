import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import UserService from "./userService";
import { app } from "./firebase"

const auth = getAuth(app)

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
    signInWithEmailAndPassword,
    auth,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout
};