import React, { useState, useEffect } from 'react';
import UserService from '../../../Firebase/userService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';


function SetUser(props) {
  const { user, onSave } = props;
  const [userState, setUserState] = useState(user);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    setUserState(userState)
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedUser = { ...userState };
    UserService.update(updatedUser.uid, updatedUser);
    onSave(updatedUser);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>Editar</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>
          {"Datos personales"}
        </DialogTitle>
        <DialogContent>
          <Grid container sx={{ color: 'text.primary' }}>
            <Grid item xs={12} mt={2}>
              <TextField id="standard-basic" label="Nombre completo" variant="standard"
                value={userState.name}
                onChange={(event) => setUserState(
                  {
                    ...userState,
                    name: event.target.value,
                  }
                )} />
            </Grid>
            <Grid item xs={12} mt={2}>
              <TextField id="standard-basic" label="Número telefónico" variant="standard"
                value={userState.phone}
                onChange={(event) => setUserState(
                  {
                    ...userState,
                    phone: event.target.value,
                  }
                )} />
            </Grid>
            <Grid item xs={12} mt={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Fecha de nacimiento"
                  onChange={(newDate) => setUserState(
                    {
                      ...userState,
                      birthday: newDate.toString(),
                    }
                  )} />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SetUser;
