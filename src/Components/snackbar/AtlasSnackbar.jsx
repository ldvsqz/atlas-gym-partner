import React from 'react';
import { Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AtlasSnackbar = ({ message, open, severity, handleClose }) => {
  //severity = error | warning | info | success
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Duración en milisegundos antes de que el Snackbar se cierre automáticamente
      onClose={handleClose} // Función para manejar el cierre del Snackbar
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AtlasSnackbar;