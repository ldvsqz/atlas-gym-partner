import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function ExerciseImage(props) {
    const { exercise } = props
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <ListItemButton onClick={handleOpen}>
                <ListItemText id={exercise.id} primary={exercise.name} />
            </ListItemButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogContent>
                    <Card sx={{ width: 280 }}>
                        <CardHeader
                            title={exercise.name}
                        />
                        <CardMedia
                            component="img"
                            image={exercise.gifUrl}
                            alt=""
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Objetivo: {exercise.bodyPart}/{exercise.target}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Equipo: {exercise.equipment}
                            </Typography>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ExerciseImage;
