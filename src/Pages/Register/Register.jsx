import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from '@mui/material';
import {
  auth,
  registerWithEmailAndPassword,
} from "./../../../Firebase/authFunctions";
import "./Register.css";
import ResetPassword from "../ResetPassword/ResetPassword";
import AtlasSnackbar from "../../Components/snackbar/AtlasSnackbar";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();




  const register = () => {
    if (!name) {
      handleShowSnackbar();
    }
    registerWithEmailAndPassword(dni, birthday, phone, name, email, password).catch(err => {
      handleShowSnackbar();
    })
  };



  useEffect(() => {
    if (loading) return;
    if (user) navigate(`/user/${uid}`, { state: { uid } });
  }, [user, loading]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleShowSnackbar = () => {
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Atlas
      </Typography>
      <TextField
        label="Número de cédula"
        fullWidth
        margin="normal"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        placeholder="Número de cédula"
      />
      <TextField
        label="Nombre completo"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre completo"
      />
      <TextField
        label="Fecha de nacimiento"
        fullWidth
        margin="normal"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        placeholder="Fecha de nacimiento"
      />
      <TextField
        label="Número de teléfono"
        fullWidth
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Número de teléfono"
      />
      <TextField
        label="Correo electrocnico"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
      />
      <TextField
        type="password"
        label="Contraseña"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <Button variant="contained" color="primary" fullWidth onClick={register}>
        Register
      </Button>
      <Typography variant="body1" align="center" gutterBottom>
        ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>.
      </Typography>
      <AtlasSnackbar message="Datos inválidos" open={snackbarOpen} severity="error" handleClose={handleSnackbarClose} />
    </Container >
  );
}
export default Register;