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
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Util from '../../assets/Util';
import ExerciseImage from "../../Components/ExerciseImage/ExerciseImage";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Routines(props) {
  const { routine } = props;
  const [routineState, setRoutineState] = useState(routine);
  const util = new Util();

  return (
    <Container fixed>
      <Typography variant="h6" gutterBottom>
        Rutina
      </Typography>
      <Box sx={{ width: '100%' }}>
        {routineState ? (<div>
          <Typography variant="subtitle1" gutterBottom>
            {routineState.objective}
          </Typography>
          {
            routineState.routine.map((day, indexD) => (
              <Accordion sx={{ margin: 1 }} key={indexD}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Día {indexD + 1}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell >Ejercicio</TableCell>
                          <TableCell>Series</TableCell>
                          <TableCell>Objetivo</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {day.day.map((exercise, indexE) => (
                          <TableRow key={indexE} sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '4px' }}>
                            <TableCell sx={{ padding: '5px' }} ><ExerciseImage exercise={exercise} /></TableCell>
                            <TableCell sx={{ padding: '5px' }} >{exercise.sets}</TableCell>
                            <TableCell sx={{ padding: '5px' }} >{exercise.bodyPart}/{exercise.target}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))
          }
        </div>
        ) : (
          <Typography variant="subtitle1" gutterBottom>
            No tiene rutinas registradas
          </Typography>)
        }
      </Box >
    </Container >
  );
}

export default Routines;
