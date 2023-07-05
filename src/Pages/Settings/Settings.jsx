import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Menu from '../../Components/Menu/Menu';


function Settings({ menu }) {

  return (
    <div>
      {menu}
      <Container fixed>
      </Container>
    </div>
  );
}

export default Settings;