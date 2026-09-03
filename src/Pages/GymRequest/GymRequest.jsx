import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, MenuItem, TextField, Typography } from '@mui/material';
import { useSnackbar } from '../../Components/snackbar/AtlasSnackbar';
import TenantService from '../../../Firebase/tenantService';
import { useAuthProfile } from '../../hooks/useAuthProfile';

function GymRequest({ menu }) {
  const { user, profile } = useAuthProfile();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [saving, setSaving] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [requestType, setRequestType] = useState(profile?.gymId ? 'transfer' : 'join');
  const [gymId, setGymId] = useState('');

  useEffect(() => {
    if (profile?.gymId) return;
    TenantService.getAll().then(setTenants).catch(() => {
      showSnackbar('No se pudieron cargar los gimnasios.', 'error');
    });
  }, [showSnackbar]);

  if (profile?.gymId) {
    return (
      <>
        {menu}
        <Container sx={{ mt: 4 }}>
          <Typography variant="h5">Solicitud no disponible</Typography>
          <Typography sx={{ mt: 2 }}>Ya perteneces a un gimnasio. Solicita un traslado desde tu perfil de usuario.</Typography>
        </Container>
      </>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    if ((requestType === 'join' || requestType === 'transfer') && !gymId) return;
    if (requestType === 'new' && !name.trim()) return;
    setSaving(true);
    try {
      if (requestType === 'join') {
        await TenantService.requestMembership(user, gymId, details, profile);
      } else if (requestType === 'transfer') {
        await TenantService.requestTransfer(user, gymId, details, profile);
      } else {
      await TenantService.requestGym(user, name, details, profile);
      }
      setName('');
      setDetails('');
      setGymId('');
      showSnackbar('Solicitud enviada para aprobación.', 'success');
      navigate(`/user/${user.uid}`, { state: { uid: user.uid } });
    } catch (error) {
      showSnackbar('No se pudo enviar la solicitud.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {menu}
      <Container component="form" maxWidth="sm" sx={{ mt: 4 }} onSubmit={submit}>
        <Typography variant="h5" gutterBottom>Solicitudes de gimnasio</Typography>
        <TextField select fullWidth label="Tipo de solicitud" value={requestType} onChange={(event) => setRequestType(event.target.value)} margin="normal">
          {!profile?.gymId && <MenuItem value="join">Solicitar unirse a un gimnasio existente</MenuItem>}
          <MenuItem value="new">Solicitar crear un gimnasio nuevo</MenuItem>
        </TextField>
        {(requestType === 'join' || requestType === 'transfer') ? (
          <TextField select fullWidth required label="Gimnasio" value={gymId} onChange={(event) => setGymId(event.target.value)} margin="normal">
            {tenants.map((tenant) => <MenuItem key={tenant.id} value={tenant.id}>{tenant.name}</MenuItem>)}
          </TextField>
        ) : (
          <TextField fullWidth required label="Nombre del gimnasio" value={name} onChange={(event) => setName(event.target.value)} margin="normal" />
        )}
        <TextField fullWidth multiline rows={4} label="Detalles" value={details} onChange={(event) => setDetails(event.target.value)} margin="normal" />
        <Button type="submit" variant="contained" disabled={saving}>Enviar solicitud</Button>
      </Container>
    </>
  );
}

export default GymRequest;
