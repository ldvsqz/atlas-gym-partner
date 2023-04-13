import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from '../../Components/Menu/Menu';
import SetUser from "./SetUser";
import SetStats from '../../Components/Stats/SetStats';
import Stats from '../../Components/Stats/Stats';
import StatService from '../../../Firebase/statsService';
import UserService from '../../../Firebase/userService';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Util from '../../assets/Util';
import Alert from '../../Components/Alert/Alert'
//import RoutinesService from '../../Firebase/routinesService';
//import Routines from '../../Components/Routines/Routines';

function User() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const util = new Util();
  console.log(user);

  useEffect(() => {
    if (location.state) {
      const uid = location.state.uid;
      const fetchClient = async () => {
        const userData = await UserService.get(uid);
        const userStats = await StatService.getLast(uid);
        setUser(userData);
        setStats(userStats);
        setLoading(false);
      };
      fetchClient();
    }
  }, [location.state]);



  function handleOnRenew(response) {
    if (response) {
      const today = new Date(); // fecha actual
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setUser({ ...user, until: nextMonth.toString() })
      UserService.update(user.uid, user)
    }
  }


  return (
    <div>
      <Menu />
      <Container fixed>
        {loading ? (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item xs={8}>
                <Typography variant="h5" gutterBottom>
                  {user.name}, {util.getAge(user.birthday)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <SetUser user={user} 
                onSave={(updatedUser) =>
                setUser(updatedUser)
                }/>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h6" gutterBottom>
                  Activo hasta: {util.formatDate(user.until)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
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

            <Typography variant="h6" gutterBottom>
              Rutina
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default User;