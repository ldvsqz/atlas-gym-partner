import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

function Settings({ menu }) {
  return (
    <div>
      {menu}
      <Container fixed>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <SettingsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Configuración
          </Typography>
          <Typography color="text.secondary">
            Esta sección estará disponible próximamente.
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default Settings;
