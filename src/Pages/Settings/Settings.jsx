import React from 'react';
import { Box } from '@mui/material';
import ModuleSettings from './ModuleSettings';

function Settings({ menu }) {
  return (
    <div>
      {menu}
      <Box sx={{ py: 2 }}>
        <ModuleSettings />
      </Box>
    </div>
  );
}

export default Settings;
