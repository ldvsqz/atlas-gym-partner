import React, { useState } from 'react';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import NoDrinksIcon from '@mui/icons-material/NoDrinks';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';
import SetStats from '../../Components/Stats/SetStats';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Stats(props) {
    const {stats} = props
    const [open, setOpen] = useState(false);
    const [statsState, setStats] = useState(stats);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function formatDate(_date) {
        const date = new Date(_date);
        const formattedDate = date.toLocaleString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' });
        return formattedDate;

    }

 

    return (
        <div>
            <Button onClick={handleOpen}>Ver medidas</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <SetStats stats={stats} uid={stats.uid} isEditing={true} onSave={(updatedStats) => setStats(updatedStats)} />
                    <Button onClick={handleClose}><CloseIcon /></Button>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Medidas del {formatDate(stats.date)}
                    </Typography>
                    <fieldset>
                        <legend>Habitos</legend>
                        <Grid container sx={{ color: 'text.primary' }}>
                            <Grid item xs={6}>
                                Fuma: {stats.habits.smoke ? <SmokingRoomsIcon /> : <SmokeFreeIcon />}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Bebe: {stats.habits.drink ? <LocalBarIcon /> : <NoDrinksIcon />}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                Corre: {stats.habits.running ? <DirectionsRunIcon /> : <AirlineSeatReclineExtraIcon />}
                            </Grid>
                            <Grid item xs={6}>
                                Levanta pesas: {stats.habits.lifting ? <FitnessCenterIcon /> : <AirlineSeatReclineExtraIcon />}
                            </Grid>
                        </Grid>
                    </fieldset>
                    <fieldset>
                        <legend>Consideraciones</legend>
                        <Grid container sx={{ color: 'text.primary' }}>
                            <Grid item xs={6}>
                                Cirugías recientes: {stats.considerations.recent_surgeries}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Factores de riesgo: {stats.considerations.risks_factors}
                                </Typography>
                            </Grid>
                        </Grid>
                    </fieldset>

                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={6}>
                            Peso: {stats.weight_kg}kg
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Estatura: {stats.Height_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            IMC: {stats.IMC}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Grasa corporal: %{stats.body_fat}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            Musculo: %{stats.muscle}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Grasa viceral: %{stats.visceral_fat}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            Edad metabólica: {stats.metabolic_age}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Kcal: {stats.kcal}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            Pecho/espalda: {stats.chest_back_cm}cm
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Cintura: {stats.waist_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            Abdomen: {stats.abdomen_cm}cm
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Cadera: {stats.hip_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            Brazo derecho: {stats.r_amr_cm}cm
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Brazo izquierdo: {stats.l_amr_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            Pioerna derecha: {stats.r_quad_cm}cm
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Pierna izquierda: {stats.l_quad_cm}cm
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            Pantorrilla derecha: {stats.r_calf_cm}cm
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Pantorrilla izquierda: {stats.l_calf_cm}cm
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>


            </Modal>
        </div>
    )
}

export default Stats;
