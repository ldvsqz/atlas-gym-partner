import React, { useState, useEffect } from 'react';
import UserService from '../../../Firebase/userService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
    const updatedUser = { ...user };
    UserService.update(updatedUser.uid, updatedUser)
    onSave(updatedUser);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>Editar</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField id="standard-basic" label="Pantorrilla izquierda cm" variant="standard"
            value={userState.name} onChange={(event) => setUserState(
              {
                ...userState,
                name: { name: event.target.value },
              }
            )} />
          <TextField id="standard-basic" label="Pantorrilla izquierda cm" variant="standard"
            value={userState.email} onChange={(event) => setUserState(
              {
                ...userState,
                email: { email: event.target.value },
              }
            )} />
          <TextField id="standard-basic" label="Pantorrilla izquierda cm" variant="standard"
            value={userState.phone} onChange={(event) => setUserState(
              {
                ...userState,
                phone: { phone: event.target.value },
              }
            )} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Basic date picker" onChange={(newDate) => setUserState(
              {
                ...userState,
                birthday: { birthday: newDate },
              }
            )} />
          </LocalizationProvider>

          <Button onClick={handleSubmit}>Guardar cambios</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default SetUser;
