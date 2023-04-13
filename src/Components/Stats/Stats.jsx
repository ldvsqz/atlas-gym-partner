import React, { useState } from 'react';
import SetStats from '../../Components/Stats/SetStats';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Util from '../../assets/Util';
import './SetStats.css';

function Stats(props) {
    const { stats } = props
    const [open, setOpen] = useState(false);
    const [statsState, setStats] = useState(stats);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const util = new Util();

    return (
        <div>
            <Button onClick={handleOpen}>Ver medidas</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {util.formatDate(stats.date)}
                </DialogTitle>
                <DialogContent>

                    <Typography variant="h6" gutterBottom>
                        Hábitos
                    </Typography>
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Fuma: {stats.habits.smoke ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Bebe: {stats.habits.drink ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Corre: {stats.habits.running ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Pesas: {stats.habits.lifting ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom>
                        Consideraciones
                    </Typography>
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={12}>
                            Cirugías recientes: {stats.considerations.recent_surgeries}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Factores de riesgo: {stats.considerations.risks_factors}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom>
                        Medidas
                    </Typography>
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Peso: {stats.weight_kg}kg
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Estatura: {stats.Height_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                IMC: {stats.IMC}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Grasa corp: %{stats.body_fat}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Musculo: %{stats.muscle}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Grasa viceral: %{stats.visceral_fat}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Edad metabólica: {stats.metabolic_age}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Kcal: {stats.kcal}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Pecho/espalda: {stats.chest_back_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Cintura: {stats.waist_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Abdomen: {stats.abdomen_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Cadera: {stats.hip_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Brazo izq: {stats.l_amr_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Brazo der: {stats.r_amr_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Pierna izq: {stats.l_quad_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Pioerna der: {stats.r_quad_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Pant. izq: {stats.l_calf_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">
                                Pant. der: {stats.r_calf_cm}cm
                            </Typography>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <div className='edit-button'>
                        <SetStats stats={stats} uid={stats.uid} isEditing={true} onSave={(updatedStats) => setStats(updatedStats)} />
                    </div>
                    <Button onClick={() => setOpen(false)}>Historial</Button>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                </DialogActions>

            </Dialog>
        </div >
    )
}

export default Stats;
