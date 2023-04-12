import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from '../../Components/Menu/Menu';
import SetStats from '../../Components/Stats/SetStats';
import Stats from '../../Components/Stats/Stats'
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
//import RoutinesService from '../../Firebase/routinesService';
//import Routines from '../../Components/Routines/Routines';

function User() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  console.log(location);


  useEffect(() => {
    if (location.state) {
      const uid = location.state.uid;
      const fetchClient = async () => {
        const userData = await UserService.get(uid);
        const userStats = await StatService.getLast(uid);
        setUser(userData);
        setStats(userStats);
        setLoading(false);
        console.log(stats);
      };
      fetchClient();
    }
  }, [location.state]);


  const getAge = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };


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
            <Typography variant="h4" gutterBottom>
              {user.name}, {getAge(user?.birthday)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Suscrito hasta: userSub.date
            </Typography>

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


            <Stats stats={stats} />
            <SetStats stats={stats} uid={user.uid} isEditing={false} onSave={(updatedStats) => setStats(updatedStats)} />
          </Box>
        )}
      </Container>
    </div>
  );
}

export default User;