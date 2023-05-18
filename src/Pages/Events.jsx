import React from 'react';
import Menu from '../Components/Menu/Menu';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


function Events() {

  return (
    <div>
      <Menu />
      <Container fixed>
        <Typography variant="h5" gutterBottom >
          Eventos
        </Typography>
      </Container>
    </div>
  );
}

export default Events;