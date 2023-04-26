import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
    const { leftList, rightList, onTransfer } = props;
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(leftList);
    const [right, setRight] = useState(rightList);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filteredExercises = left.filter((ex) =>
            ex.name.toLowerCase().includes(term) ||
            ex.equipment.toLowerCase().includes(term) ||
            ex.bodyPart.toLowerCase().includes(term) ||
            ex.target.toLowerCase().includes(term)
        );
        setLeft(filteredExercises);
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
        onTransfer(leftChecked);
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (items) => (
        <Paper sx={{ width: '250px', height: 400, overflow: 'auto', mt: 2 }}>
            <List dense component="div" role="list">
                {items.map((exercise) => {

                    return (
                        <ListItem
                            key={exercise.id}
                            role="listitem"
                            button
                            onClick={handleToggle(exercise)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(exercise) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': exercise.id,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={exercise.id} primary={exercise.name} />
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
                {customList(left)}
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
                <Typography variant="subtitle1">
                    Rutina del dia
                </Typography>
                {customList(right)}
            </Grid>
        </Grid>
    );
}