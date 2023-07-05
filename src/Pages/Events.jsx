import React from 'react';
import Menu from '../Components/Menu/Menu';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


function Events({ menu }) {

  return (
    <div>
      {menu}
      <Container fixed>
      </Container>
    </div>
  );
}

export default Events;