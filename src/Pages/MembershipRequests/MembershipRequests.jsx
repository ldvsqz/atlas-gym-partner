import React, { useEffect, useState } from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';
import TenantService from '../../../Firebase/tenantService';
import { useSnackbar } from '../../Components/snackbar/AtlasSnackbar';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return 'No registrado';
  if (typeof value?.toDate === 'function') return value.toDate().toLocaleDateString('es-ES');
  return String(value);
};

const requesterFields = ['name', 'dni', 'email', 'phone', 'birthday', 'until', 'uid'];

function MembershipRequests({ menu }) {
  const [requests, setRequests] = useState([]);
  const { showSnackbar } = useSnackbar();

  const refresh = async () => {
    const membership = await TenantService.getMembershipRequests();
    setRequests(membership);
  };

  useEffect(() => {
    refresh().catch(() => showSnackbar('No se pudieron cargar las solicitudes.', 'error'));
  }, []);

  const approve = async (request) => {
    try {
      await TenantService.approveMembershipRequest(request.id, request);
      await refresh();
      showSnackbar('Usuario asignado al gimnasio.', 'success');
    } catch {
      showSnackbar('No se pudo aprobar la solicitud.', 'error');
    }
  };

  const reject = async (request) => {
    try {
      await TenantService.rejectMembershipRequest(request.id);
      await refresh();
      showSnackbar('Solicitud rechazada.', 'success');
    } catch {
      showSnackbar('No se pudo rechazar la solicitud.', 'error');
    }
  };

  return (
    <>
      {menu}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Solicitudes para unirse al gimnasio</Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          {requests.map((request) => (
            <Stack key={request.id} spacing={1} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1">Datos del solicitante</Typography>
              {requesterFields.map((field) => (
                <Typography key={field} variant="body2">
                  <strong>{field}:</strong> {formatValue(request.requester?.[field] || (field === 'email' ? request.requestedByEmail : null))}
                </Typography>
              ))}
              <Typography variant="body2"><strong>Gimnasio solicitado:</strong> {formatValue(request.gymId)}</Typography>
              <Typography variant="body2"><strong>Detalles:</strong> {formatValue(request.details)}</Typography>
              <Button variant="contained" onClick={() => approve(request)} sx={{ alignSelf: 'flex-start' }}>Aprobar</Button>
            </Stack>
          ))}
          {!requests.length && <Typography color="text.secondary">No hay solicitudes pendientes.</Typography>}
        </Stack>
      </Container>
    </>
  );
}

export default MembershipRequests;
