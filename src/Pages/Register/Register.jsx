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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AtlasSnackbar from "../../Components/snackbar/AtlasSnackbar";
import dayjs from 'dayjs';

const today = dayjs();

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();




  const register = () => {
    if (!name) {
      handleShowSnackbar();
    }
    registerWithEmailAndPassword(dni, birthday.toString(), phone, name, email, password).catch(() => {
        handleShowSnackbar();
      })
  };



  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      const uid = user.uid
      localStorage.setItem('UID', uid);
      localStorage.setItem('ROL', 1);
      navigate(`/user/${uid}`, { state: { uid } });
    }
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
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DatePicker
          label="Fecha de nacimiento"
          align="center"
          fullWidth
          maxDate={today}
          onChange={(newDate) => setBirthday(newDate)} />
      </LocalizationProvider>
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