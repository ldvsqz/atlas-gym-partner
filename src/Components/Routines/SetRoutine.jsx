import React, { useState, useEffect } from 'react';
//MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// Services and utilities
import { backExercises } from '../../assets/exercises/back-exercises';
import { chestExercises } from '../../assets/exercises/chest-exercises';
import { deltsExercises } from '../../assets/exercises/delts-exercises';
import { coreExercises } from '../../assets/exercises/core-exercises';
import { armsExercises } from '../../assets/exercises/arms-exercises';
import { legsExercises } from '../../assets/exercises/legs-exercises';
import { cardioExercises } from '../../assets/exercises/cardio-exercises';
import RoutineService from '../../../Firebase/RoutineService';
import Util from '../../assets/Util';

import TransferList from './TransferList';
import ExerciseImage from "../../Components/ExerciseImage/ExerciseImage";
import Alert from "../../Components/Alert/Alert";
import { Timestamp } from 'firebase/firestore';


function SetRoutine(props) {
    const { uid, onSaveRoutine } = props
    const [routineState, setRoutine] = useState({ uid: uid, target: '', routine: [] });
    const [exercisesList, setExercisesList] = useState([]);
    const [backExercisesState, setBackExercises] = useState(backExercises);
    const [chestExercisesState, setChestExercises] = useState(chestExercises);
    const [deltsExercisesState, setDeltsExercises] = useState(deltsExercises);
    const [absExercisesState, setAbsExercises] = useState(coreExercises);
    const [armsExercisesState, setArmsExercises] = useState(armsExercises);
    const [legsExercisesState, setLegsExercises] = useState(legsExercises);
    const [cardioExercisesState, setCardioExercises] = useState(cardioExercises);
    const [value, setValue] = useState('1');

    const util = new Util();

    useEffect(() => { }, []);


    const handleAddDay = () => {
        const routine = { ...routineState }
        routine.routine.push({ day: exercisesList })
        setRoutine(routine);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    function removeExercise(newList) {
        const updatedList = exercisesList.filter((exercise) => !newList.includes(exercise));
        setExercisesList(updatedList);
    }

    function handleSaveRoutine(response) {
        if (response) {
            const newRoutineState = { ...routineState, date: Timestamp.now() };
            RoutineService.add(newRoutineState);
            onSaveRoutine(routineState);
            handleCleanRoutine();
        }
    }


    function handleCleanRoutine() {
        const routine = { ...routineState }
        routine.routine = [];
        setRoutine(routine);
        setBackExercises(backExercises);
        setChestExercises(chestExercises);
        setDeltsExercises(deltsExercises);
        setAbsExercises(coreExercises);
        setArmsExercises(armsExercises);
        setLegsExercises(legsExercises);
        setCardioExercises(cardioExercises);
    }

    const restoreExercise = (newList) => {
        newList.forEach((exercise) => {
            switch (exercise.bodyPart) {
                case 'espalda':
                    setBackExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                case 'pecho':
                    setChestExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                case 'deltoides':
                    setDeltsExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                case 'core':
                    setAbsExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                case 'brazos':
                case 'antebrazos':
                    setArmsExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                case 'piernas':
                    setLegsExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                case 'cardio':
                    setCardioExercises((prevExercises) => [...prevExercises, exercise]);
                    break;
                default:
                    break;
            }
        });
    };



    return (
        <div>
            <Accordion sx={{ mt: 1 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography>
                        Agregar rutina
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example" variant="scrollable">
                                    <Tab label="Espalda" value="1" sx={{ width: '50%' }}/>
                                    <Tab label="Pecho" value="2" sx={{ width: '50%' }}/>
                                    <Tab label="Hombro" value="3" sx={{ width: '50%' }}/>
                                    <Tab label="Abdomen" value="4" sx={{ width: '50%' }}/>
                                    <Tab label="Brazos" value="5" sx={{ width: '50%' }}/>
                                    <Tab label="Pierna" value="6" sx={{ width: '50%' }}/>
                                    <Tab label="Cardio" value="7" sx={{ width: '50%' }}/>
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <TransferList leftList={backExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setBackExercises(backExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                            <TabPanel value="2">
                                <TransferList leftList={chestExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setChestExercises(chestExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                            <TabPanel value="3">
                                <TransferList leftList={deltsExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setDeltsExercises(deltsExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                            <TabPanel value="4">
                                <TransferList leftList={absExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setAbsExercises(absExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                            <TabPanel value="5">
                                <TransferList leftList={armsExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setArmsExercises(armsExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                            <TabPanel value="6">
                                <TransferList leftList={legsExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setLegsExercises(legsExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                            <TabPanel value="7">
                                <TransferList leftList={cardioExercisesState} rightList={exercisesList}
                                    onTransferRight={(newList) => {
                                        setExercisesList(exercisesList.concat(newList))
                                        setCardioExercises(cardioExercisesState.filter((ex) => !newList.includes(ex)))
                                    }}
                                    onTransferLeft={(newList) => {
                                        removeExercise(newList)
                                        restoreExercise(newList)
                                    }}
                                    addAsADay={() => {
                                        removeExercise(exercisesList)
                                        restoreExercise(exercisesList)
                                        handleAddDay()
                                    }} />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </AccordionDetails>
            </Accordion>
            {routineState.routine.length !== 0 &&
                <Grid container sx={{ color: 'text.primary' }}>
                    {
                        routineState.routine.map((day, indexD) => (
                            <Grid item xs={12} key={indexD} sx={{ mt: 1 }}>
                                <Accordion >
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
                                                        <TableCell>Ejercicio</TableCell>
                                                        <TableCell>Series</TableCell>
                                                        <TableCell>Objetivo</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {day.day.map((exercise, indexE) => (
                                                        <TableRow key={exercise.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '4px' }}>
                                                            <TableCell sx={{ padding: '10px' }} ><ExerciseImage exercise={exercise} /></TableCell>
                                                            <TableCell sx={{ padding: '10px' }} >{exercise.sets}</TableCell>
                                                            <TableCell sx={{ padding: '10px' }} >{exercise.bodyPart}/{exercise.target}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))
                    }
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={6}>
                            <Alert buttonName={"Guardar rutina"}
                                title={"Guardar rutina"}
                                message={`¿Desea guardar esta rutina como la actual?`}
                                onResponse={(response) => handleSaveRoutine(response)} />
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handleCleanRoutine}>Limpiar</Button>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </div>
    );

}

export default SetRoutine;
