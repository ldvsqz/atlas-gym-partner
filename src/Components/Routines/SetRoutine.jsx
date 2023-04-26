import React, { useState, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { exercises } from '../../assets/Exercises';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TransferList from './TransferList';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Typography from '@mui/material/Typography';

import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


function SetRoutine(props) {
    const { uid } = props
    const [routineState, setRoutine] = useState({
        uid: uid,
        target: '',
        routine: []
    });
    const [exercisesList, setRExercisesList] = useState([]);
    const [backExercises, setBackExercises] = useState();
    const [chestExercises, setChestExercises] = useState();
    const [deltsExercises, setDeltsExercises] = useState();
    const [absExercises, setAbsExercises] = useState();
    const [armsExercises, setArmsExercises] = useState();
    const [legsExercises, setLegsExercises] = useState();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [value, setValue] = useState('1');

    useEffect(() => {
        setBackExercises(
            exercises.filter((exercise) => exercise.bodyPart.toLowerCase().includes('espalda'))
        )
        setChestExercises(
            exercises.filter((exercise) => exercise.bodyPart.toLowerCase().includes('pecho'))
        )
        setDeltsExercises(
            exercises.filter((exercise) => exercise.bodyPart.toLowerCase().includes('deltoides'))
        )
        setAbsExercises(
            exercises.filter((exercise) => exercise.target.toLowerCase().includes('abdominales'))
        )
        setArmsExercises(
            exercises.filter((exercise) => exercise.bodyPart.toLowerCase().includes('parte superior de los brazos') || exercise.bodyPart.toLowerCase().includes('antebrazos'))
        )
        setLegsExercises(
            exercises.filter((exercise) => exercise.bodyPart.toLowerCase().includes('piernas superiores') || exercise.bodyPart.toLowerCase().includes('piernas inferiores'))
        )
    }, [setBackExercises, setChestExercises, setDeltsExercises, setAbsExercises, setArmsExercises, setLegsExercises]);


    const handleAddDay = () => {
        const routine = { ...routineState }
        routine.routine.push({ day: exercisesList })
        console.log(routine);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <>
            {!open && <Button onClick={handleOpen}>Agregar rutina</Button>}
            {open && <div>
                <Button onClick={handleClose}>Cerrar</Button>
                <Box sx={{ width: '92%', maxWidth: 700, typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example" variant="scrollable">
                                <Tab sx={{ width: '16.6%' }} label="Espalda" value="1" />
                                <Tab sx={{ width: '16.6%' }} label="Pecho" value="2" />
                                <Tab sx={{ width: '16.6%' }} label="Hombro" value="3" />
                                <Tab sx={{ width: '16.6%' }} label="Abdomen" value="4" />
                                <Tab sx={{ width: '16.6%' }} label="Brazos" value="5" />
                                <Tab sx={{ width: '16.6%' }} label="Pierna" value="6" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <TransferList leftList={backExercises} rightList={exercisesList} onTransfer={(newList) => {
                                setRExercisesList(exercisesList.concat(newList))
                                console.log(newList);
                                setBackExercises(backExercises.filter((ex) => !newList.includes(ex)))
                            }} />
                        </TabPanel>
                        <TabPanel value="2">
                            <TransferList leftList={chestExercises} rightList={exercisesList} onTransfer={(newList) => {
                                setRExercisesList(exercisesList.concat(newList))
                                setChestExercises(chestExercises.filter((ex) => !newList.includes(ex)))
                            }} />
                        </TabPanel>
                        <TabPanel value="3">
                            <TransferList leftList={deltsExercises} rightList={exercisesList} onTransfer={(newList) => {
                                setRExercisesList(exercisesList.concat(newList))
                                setDeltsExercises(deltsExercises.filter((ex) => !newList.includes(ex)))
                            }} />
                        </TabPanel>
                        <TabPanel value="4">
                            <TransferList leftList={absExercises} rightList={exercisesList} onTransfer={(newList) => {
                                setRExercisesList(exercisesList.concat(newList))
                                setAbsExercises(absExercises.filter((ex) => !newList.includes(ex)))
                            }} />
                        </TabPanel>
                        <TabPanel value="5">
                            <TransferList leftList={armsExercises} rightList={exercisesList} onTransfer={(newList) => {
                                setRExercisesList(exercisesList.concat(newList))
                                setArmsExercises(armsExercises.filter((ex) => !newList.includes(ex)))
                            }} />
                        </TabPanel>
                        <TabPanel value="6">
                            <TransferList leftList={legsExercises} rightList={exercisesList} onTransfer={(newList) => {
                                setRExercisesList(exercisesList.concat(newList))
                                setLegsExercises(legsExercises.filter((ex) => !newList.includes(ex)))
                            }} />
                        </TabPanel>
                    </TabContext>
                    <Button onClick={handleAddDay}>Agregar como día de rutina</Button>
                </Box>
            </div>
            }


        </>
    );

}

export default SetRoutine;
