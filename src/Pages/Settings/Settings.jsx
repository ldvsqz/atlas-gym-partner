import React from 'react';
import { Box } from '@mui/material';
import ModuleSettings from './ModuleSettings';
import TenantService from '../../../Firebase/tenantService';
import { useAuthProfile } from '../../hooks/useAuthProfile';
import { useSnackbar } from '../../Components/snackbar/AtlasSnackbar';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

function Settings({ menu }) {
  const { profile } = useAuthProfile();
  const { showSnackbar } = useSnackbar();
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    TenantService.getCurrentTenant()
      .then((currentTenant) => {
        setTenant(currentTenant);
        setName(currentTenant?.name || '');
      })
      .catch(() => showSnackbar('No se pudo cargar el gimnasio.', 'error'));
  }, [showSnackbar]);

  const saveTenantName = async () => {
    try {
      await TenantService.renameTenant(tenant.id, name);
      setTenant({ ...tenant, name: name.trim() });
      setName(name.trim());
      showSnackbar('Nombre del gimnasio actualizado.', 'success');
    } catch {
      showSnackbar('No se pudo actualizar el nombre del gimnasio.', 'error');
    }
  };

  return (
    <div>
      {menu}
      <Stack spacing={1} sx={{ px: 3, pt: 3, maxWidth: 600 }}>
        <Typography variant="h6">Gimnasio</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Nombre del gimnasio"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={!tenant}
          />
          <Button variant="contained" onClick={saveTenantName} disabled={!tenant || !name.trim() || profile?.rol === 1}>
            Guardar
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ py: 2 }}>
        <ModuleSettings />
      </Box>
    </div>
  );
}

export default Settings;
