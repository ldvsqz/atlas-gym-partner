import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import Grid from '@mui/material/Grid';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

import Menu from '../../Components/Menu/Menu';
import SetUser from "./SetUser";
import StatService from '../../../Firebase/statsService';
import UserService from '../../../Firebase/userService';
import RoutineService from '../../../Firebase/RoutineService';
import Util from '../../assets/Util';
import Alert from '../../Components/Alert/Alert';
import Routines from '../../Components/Routines/Routines';
import SetRoutine from "../../Components/Routines/SetRoutine";
import SetStats from '../../Components/Stats/SetStats';
import Stats from '../../Components/Stats/Stats';

function User() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [routine, setRoutine] = useState({});
  const [loading, setLoading] = useState(true);
  const util = new Util();

  useEffect(() => {
    if (location.state) {
      const uid = location.state.uid;
      const fechClientData = async () => {
        const userData = await UserService.get(uid);
        const userStats = await StatService.getLast(uid);
        const userRoutine = await RoutineService.getLast(uid);
        setUser(userData);
        setStats(userStats);
        setRoutine(userRoutine);
        setLoading(false);
      };
      fechClientData();
    }
  }, []);



  function handleOnRenew(response) {
    if (response) {
      const today = new Date(); // fecha actual
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const refreshedUser = user;
      refreshedUser['until'] = nextMonth.toString();
      setUser(refreshedUser);
      UserService.update(user.uid, refreshedUser);
    }
  }
  async function handleOnsetRoutine() {
    const userRoutine = await RoutineService.getLast(user.uid);
    setRoutine(userRoutine);
  }


  return (
    <div>
      <Menu />
      <Container fixed>
        {loading ? (
          <Stack spacing={1} sx={{ mt: 4 }}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="rectangular" width={210} height={20} />
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />
          </Stack>
        ) : (
          <Box sx={{ width: '100%', mt: 4 }}>

            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={10}>
                <Stack direction="row" spacing={2}>
                  <Avatar alt={user.name} src="" />
                  <Typography variant="h5" gutterBottom>
                    {user.name}, {util.getAge(user.birthday)}
                  </Typography>
                </Stack>

              </Grid>
              <Grid item xs={2}>
                <SetUser user={user}
                  onSave={(updatedUser) =>
                    setUser(updatedUser)
                  } />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h6" gutterBottom>
                  Activo hasta: {util.formatDate(user.until)}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Alert buttonName={<AutorenewIcon />}
                  title={"Renovar suscripción"}
                  message={`¿Desea renovar la suscripciónde: ${user.name}?`}
                  onResponse={(response) =>
                    handleOnRenew(response)} />
              </Grid>
            </Grid>



            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={1}>
                <PhoneIcon />
              </Grid>
              <Grid item xs={11}>
                <Typography variant="subtitle1" gutterBottom>
                  {user.phone}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <AlternateEmailIcon />
              </Grid>
              <Grid item xs={11}>
                <Typography variant="subtitle1" gutterBottom>
                  {user.email}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>
              Medidas
            </Typography>
            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={6}>
                <Stats stats={stats} />
              </Grid>
              <Grid item xs={6}>
                {user.rol == 0 && <SetStats stats={stats} uid={user.uid} isEditing={false} onSave={(updatedStats) =>
                  setStats(updatedStats)} />
                }
              </Grid>
            </Grid>


            <Routines routine={routine} />
            <SetRoutine uid={user.uid} onSaveRoutine={(newRoutine) => {
              console.log(newRoutine);
              setRoutine(newRoutine);
            }} />
          </Box>
        )}
      </Container>
    </div>
  );
}

export default User;