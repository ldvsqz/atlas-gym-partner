import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Menu from '../../Components/Menu/Menu';


function Settings() {

  return (
    <div>
      <Menu />
      <Container fixed>
        <Typography variant="h5" gutterBottom >
          Configuraciones
        </Typography>
      </Container>
    </div>
  );
}

export default Settings;