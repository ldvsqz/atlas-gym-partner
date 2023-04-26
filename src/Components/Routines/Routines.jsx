import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import RoutineService from '../../../Firebase/RoutineService';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Routines(props) {
  const { uid } = props
  const [routineState, setRoutine] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchClient = async () => {
      //const storedRoutine = localStorage.getItem('ROUTINE');
      //console.log(storedRoutine);
      //if (!storedRoutine) {
      //localStorage.setItem('ROUTINE', routine);
      //}
      const routine = await RoutineService.getLast(uid);
      setRoutine(routine);
      setLoading(false);
    };
    fetchClient();
  }, [setRoutine]);



  return (
    <Container fixed>
      <Typography variant="h6" gutterBottom>
        Rutina
      </Typography>
      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', mt: 4 }} />
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
        </Stack>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          {routineState ? (<div>
            <Typography variant="subtitle1" gutterBottom>
              {routineState.objective}
            </Typography>
            {
              routineState.days.map((day, index) => (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell key={index}>{day.name}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {day.exercises.map((exercise, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '4px' }}>
                          <TableCell sx={{ padding: '10px' }} >{exercise.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ))
            }
          </div>
          ) : (
            <Typography variant="subtitle1" gutterBottom>
              No tiene rutinas registradas
            </Typography>)}
        </Box>
      )}
    </Container>
  );
}

export default Routines;
