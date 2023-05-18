import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../../../Firebase/authFunctions";
import { TextField, Button, Typography, Container, ListItemIcon } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import UserService from '../../../Firebase/userService'
import "./Login.css";
import AtlasSnackbar from "../../Components/snackbar/AtlasSnackbar";
import GoogleIcon from '@mui/icons-material/Google';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [openSnack, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      UserService.get(user.uid).then(userData => {
        if (!!userData) {
          const uid = user.uid;
          localStorage.setItem('UID', uid);
          localStorage.setItem('ROL', userData.rol);
          navigate(`/user/${uid}`, { state: { uid } });
        }
      });
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
        label="Correo electrocnico"
        type="email"
        placeholder="Correo electrocnico"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Contraseña"
        placeholder="Contraseña"
        fullWidth
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary" fullWidth onClick={
        () => signInWithEmailAndPassword(auth, email, password)
          .catch(err => {
            handleShowSnackbar();
          })}
      >
        Iniciar sesión
      </Button>
      <Button type="submit" variant="contained" color="primary" fullWidth onClick={signInWithGoogle} sx={{ mt: 2 }}>
        <ListItemIcon>
          <GoogleIcon />
        </ListItemIcon>
        Iniciar sesión con Google
      </Button>
      <Typography variant="body1" align="center" gutterBottom>
        <Link to="/reset">Recuperar contraseña</Link>
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        ¿No tienes cuenta? <Link to="/register">Registrar</Link>.
      </Typography>
      <AtlasSnackbar message="Correo o contraseña inválidos" open={snackbarOpen} severity="error" handleClose={handleSnackbarClose}/>
    </Container >
  );
}
export default Login;