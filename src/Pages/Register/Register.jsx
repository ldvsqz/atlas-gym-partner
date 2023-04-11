import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
} from "./../../../Firebase/authFunctions";
import "./Register.css";
import ResetPassword from "../ResetPassword/ResetPassword";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(dni, birthday, phone, name, email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate(`/user/${uid}`, { state: { uid } });
  }, [user, loading]);
  return (
    <div className="register">
      <div className="register__container">
      <input
          type="text"
          className="register__textBox"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Número de cédula"
        />
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
        />
        <input
          type="date"
          className="register__textBox"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          placeholder="Fecha de nacimiento"
        />
        <input
          type="text"
          className="register__textBox"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Número de teléfono"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;