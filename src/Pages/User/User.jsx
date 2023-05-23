import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// MUI
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
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
//components
import Menu from '../../Components/Menu/Menu';
import SetUser from "./SetUser";
import Alert from '../../Components/Alert/Alert';
import Routines from '../../Components/Routines/Routines';
import SetRoutine from "../../Components/Routines/SetRoutine";
import SetStats from '../../Components/Stats/SetStats';
import Stats from '../../Components/Stats/Stats';
import AtlasSnackbar from "../../Components/snackbar/AtlasSnackbar";
//serives and utilities
import StatService from '../../../Firebase/statsService';
import UserService from '../../../Firebase/userService';
import RoutineService from '../../../Firebase/RoutineService';
import Util from '../../assets/Util';

function User() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [routine, setRoutine] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentRol, setRol] = useState(localStorage.getItem("ROL"))
  const util = new Util();

  useEffect(() => {
    if (location.state) {
      const uid = location.state.uid;
      const fechClientData = async () => {
        setLoading(true);
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
  }, [location.state]);


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleShowSnackbar = () => {
    setSnackbarOpen(true);
  };



  function handleOnRenew(response) {
    if (response) {
      const today = new Date(); // fecha actual
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const refreshedUser = user;
      refreshedUser['until'] = nextMonth.toString();
      setUser(refreshedUser);
      UserService.update(user.uid, refreshedUser).then(() => {
        handleShowSnackbar()
      });
    }
  }
  async function handleOnsetRoutine() {
    const userRoutine = await RoutineService.getLast(user.uid);
    console.log(userRoutine);
    setRoutine(userRoutine);
  }


  return (
    <div>
      <Menu />
      <Container fixed>
        {loading ? (
          <Stack spacing={1} sx={{ width: '100%', mt: 4 }}>
            <Skeleton animation="wave" variant="rectangular" height={60} />
            <Skeleton animation="wave" variant="rectangular" height={40} />
            <Skeleton animation="wave" variant="rectangular" height={40} />
            <Skeleton animation="wave" variant="rectangular" height={40} />
          </Stack>
        ) : (
          <Box sx={{ width: '100%', mt: 4 }}>

            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Avatar alt={user.name} src="" />
                  <Typography variant="subtitle1" gutterBottom>
                    {user.name}, {util.getAge(user.birthday)}
                  </Typography>
                </Stack>

              </Grid>
              <Grid item xs={6}>
                <SetUser user={user}
                  onSave={(updatedUser) =>
                    setUser(updatedUser)
                  } />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Activo hasta: {util.formatDate(user.until)}
                </Typography>
              </Grid>
              <Grid item xs={currentRol == 0 ? 6 : 12}>
                {currentRol == 0 && (new Date(user.until).getDate() < new Date().getDate())  && <Alert
                  buttonName={"Renovar suscripción"}
                  title={"Renovar suscripción"}
                  message={`¿Desea renovar la suscripciónde: ${user.name}?`}
                  onResponse={(response) =>
                    handleOnRenew(response)} />
                }
              </Grid>
            </Grid>



            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  {user.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  {user.email}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Typography variant="h6" align='center'>
              Medidas
            </Typography>
            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={currentRol == 0 ? 6 : 12}>
                <Stats stats={stats} sx={{ width: '100%'}}/>
              </Grid>
              <Grid item xs={6}>
                {currentRol == 0 && <SetStats stats={stats} uid={user.uid} isEditing={false} onSave={(updatedStats) =>
                  setStats(updatedStats)} />
                }
              </Grid>
            </Grid>

            <Divider />
            <Routines routine={routine} />
            {currentRol == 0 && <SetRoutine uid={user.uid} onSaveRoutine={(newRoutine) => {
              handleOnsetRoutine()
            }} />
            }
          </Box>
        )}
        <AtlasSnackbar message="Correo o contraseña inválidos" open={snackbarOpen} severity="info" handleClose={handleSnackbarClose} />
      </Container>
    </div>
  );
}

export default User;