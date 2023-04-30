import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExerciseImage from '../../Components/ExerciseImage/ExerciseImage';
import Util from '../../assets/Util';


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
    const { leftList, rightList, onTransferLeft, onTransferRight } = props;
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const util = new Util();


    useEffect(() => {
        setLeft(leftList);
        setRight(rightList);
    }, [])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);


    const handleSearch = (event) => {
        const term = util.removeAccents(event.target.value.toLowerCase());
        setSearchTerm(term);
        if (!!term) {

            const filteredExercises = left.filter((ex) =>
                util.removeAccents(ex.name.toLowerCase()).includes(term) ||
                util.removeAccents(ex.equipment.toLowerCase()).includes(term) ||
                util.removeAccents(ex.bodyPart.toLowerCase()).includes(term) ||
                util.removeAccents(ex.target.toLowerCase()).includes(term)
            );
            setLeft(filteredExercises);
        } else {
            setLeft(leftList);
        }
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleCheckedRight = () => {
        onTransferRight(leftChecked);
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        onTransferLeft(rightChecked)
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };


    const ExercisesList = (items) => (
        <Paper sx={{ width: '500px', minWith: '40%', height: 400, overflow: 'auto', mt: 2 }}>
            <List dense component="div" role="list">
                {items.map((exercise) => {
                    return (
                        <ListItem
                            key={exercise.id}
                            secondaryAction={
                                <Checkbox
                                    edge="start"
                                    onChange={handleToggle(exercise)}
                                    checked={checked.indexOf(exercise) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': exercise.id,
                                    }}
                                />
                            }
                        >
                            <ExerciseImage exercise={exercise} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );


    const RoutineList = (items) => (
        <Paper sx={{ width: '500px', minWith: '40%', height: 400, overflow: 'auto', mt: 2 }}>
            <List dense component="div" role="list">
                {items.map((exercise, index) => {
                    return (
                        <ListItem
                            key={exercise.id}
                            secondaryAction={
                                <Checkbox
                                    onChange={handleToggle(exercise)}
                                    checked={checked.indexOf(exercise) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': exercise.id,
                                    }}
                                />
                            }
                        >
                            <TextField id="standard-basic" label="Sets" variant="outlined" sx={{ maxWidth: '65px', padding: '1' }}
                                value={exercise.sets}
                                onChange={(event) =>
                                    setRight((prevRight) => {
                                        const newRight = [...prevRight];  // create a new array to avoid mutating state directly
                                        newRight[index] = {  // update the item at index with a new object
                                            ...newRight[index],  // copy the original properties of the item
                                            sets: event.target.value,  // set the new value for the 'sets' property
                                        };
                                        return newRight;  // return the updated array to set the new state
                                    })
                                }
                            />
                            <ExerciseImage exercise={exercise} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );


    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
                <TextField label="Buscar ejercicio" variant="standard"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e);
                    }}
                />
                {ExercisesList(left)}
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5, minWidth: '30px' }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5, minWidth: '30px' }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                {right.length !== 0 && <Button>Agregar como rutina</Button>}
                {RoutineList(right)}
            </Grid>
        </Grid>
    );
}