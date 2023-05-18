import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../../Firebase/authFunctions";
import { TextField, Button, Typography, Container, ListItemIcon } from '@mui/material';
import "./ResetPassword.css";
import AtlasSnackbar from "../../Components/snackbar/AtlasSnackbar";


function ResetPassword() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    if (loading) return;
    if (user) navigate("/profile:id");
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
      <Button
        variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
        onClick={() => sendPasswordReset(email)
          .catch(err => {
            handleShowSnackbar()
          })}
      >
        Enviar correo de recuperación
      </Button>
      <Typography variant="body1" align="center" gutterBottom>
        <Link to="/">Iniciar sesión</Link>
      </Typography>
      <AtlasSnackbar message="Correo inválido" open={snackbarOpen} severity="error" handleClose={handleSnackbarClose} />
    </Container >
  );
}
export default ResetPassword;