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
                    Medidas del {util.formatDate(statsState.date)}
                </DialogTitle>
                <DialogContent>

                    <Typography variant="h6" gutterBottom>
                        Hábitos
                    </Typography>
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Fuma: {statsState.habits.smoke ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Bebe: {statsState.habits.drink ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Corre: {statsState.habits.running ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Pesas: {statsState.habits.lifting ? 'Sí' : 'No'}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom>
                        Consideraciones
                    </Typography>
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={12}>
                            Cirugías recientes: {statsState.considerations.recent_surgeries}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Factores de riesgo: {statsState.considerations.risks_factors}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom>
                        Medidas
                    </Typography>
                    <Grid container sx={{ color: 'text.primary' }}>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Peso: {statsState.weight_kg}kg
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Estatura: {statsState.Height_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                IMC: {statsState.IMC}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Grasa corp: %{statsState.body_fat}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Musculo: %{statsState.muscle}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Grasa viceral: %{statsState.visceral_fat}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Edad met: {statsState.metabolic_age}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Kcal: {statsState.kcal}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Torso: {statsState.chest_back_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Cintura: {statsState.waist_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Cadera: {statsState.hip_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Brazo: {statsState.l_amr_cm}/{statsState.r_amr_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Pierna: {statsState.l_quad_cm}/{statsState.r_quad_cm}cm
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                                Pantorrilla: {statsState.l_calf_cm}/{statsState.r_calf_cm}cm
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={() => setOpen(false)}>Historial</Button>
                    <SetStats stats={stats} uid={stats.uid} isEditing={true} onSave={(updatedStats) => setStats(updatedStats)} />
                </DialogActions>

            </Dialog>
        </div >
    )
}

export default Stats;
