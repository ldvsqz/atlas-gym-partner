import React, { useState } from 'react';
import SetStats from '../../Components/Stats/SetStats';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatsHistory from "../../Components/Stats/StatsHistory";
import StatsChart from "../../Components/Stats/StatsChart";
import Util from '../../assets/Util';
import StatsModel from '../../models/StatsModel'
import StatService from '../../../Firebase/statsService';
import './SetStats.css';

function Stats({ stats = new StatsModel() }) {
    const util = new Util();
    const [open, setOpen] = useState(false);
    const [statsState, setStats] = useState(stats);
    const [expanded, setExpanded] = useState(true);
    const [currentRol, setRol] = useState(localStorage.getItem("ROL"));

    const handleOpen = async () => {
        const lastStats = await StatService.getLast(stats.uid);
        if (lastStats) {
            setStats(lastStats);
        }
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleChange = () => {
        setExpanded(!expanded);
    };
    return (
        <div>
            {stats ? (
                <div>
                    <Button align="center" onClick={handleOpen} sx={{ width: '100%' }}>Ver medidas</Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Medidas del {util.formatDate(util.getDateFromFirebase(stats.date))}
                        </DialogTitle>
                        <DialogContent>
                            {/* 
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Hábitos
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container sx={{ color: 'text.primary' }}>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Fuma:</b> {statsState.habits.smoke ? 'Sí' : 'No'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Bebe:</b> {statsState.habits.drink ? 'Sí' : 'No'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Corre:</b> {statsState.habits.running ? 'Sí' : 'No'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Pesas:</b> {statsState.habits.lifting ? 'Sí' : 'No'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                                    */}

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Consideraciones
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container sx={{ color: 'text.primary' }}>
                                        {/*
                                        <Grid item xs={12}>
                                            <b>Cirugías recientes:</b> {statsState.considerations.recent_surgeries}
                                        </Grid>
                                        */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <b>Factores de riesgo:</b> {statsState.considerations.risks_factors}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded} onChange={handleChange}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Medidas
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container sx={{ color: 'text.primary' }}>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Estatura:</b> {statsState.Height_cm}cm
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Peso base:</b> {statsState.weight_kg}kg
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Peso salida:</b> {statsState.weight_kg_end}kg
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>IMC:</b> {statsState.IMC}
                                            </Typography>
                                        </Grid>
                                        {/* 
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Grasa corp:</b> {statsState.body_fat}%
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Musculo:</b> {statsState.muscle}%
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Grasa viceral:</b> {statsState.visceral_fat}%
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Edad met:</b> {statsState.metabolic_age}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Kcal:</b> {statsState.kcal}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Torso:</b> {statsState.chest_back_cm}cm
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Cintura:</b> {statsState.waist_cm}cm
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Cadera:</b> {statsState.hip_cm}cm
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Brazo:</b> {statsState.l_amr_cm}/{statsState.r_amr_cm}cm
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Pierna:</b> {statsState.l_quad_cm}/{statsState.r_quad_cm}cm
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1">
                                                <b>Pantorrilla:</b> {statsState.l_calf_cm}/{statsState.r_calf_cm}cm
                                            </Typography>
                                        </Grid>
                                                */}
                                    </Grid>
                                </AccordionDetails>
                                {/* 
                                <StatsHistory uid={stats.uid} />
                                */}
                                <StatsChart uid={stats.uid} />
                            </Accordion>


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} fullWidth>Cancelar</Button>
                            {currentRol == 0 && <SetStats stats={stats} uid={stats.uid} isEditing={true} onSave={(updatedStats) => setStats(updatedStats)} />}
                        </DialogActions>

                    </Dialog>
                </div >
            ) : (
                <Typography variant="subtitle1" gutterBottom>
                    No tiene medidas registradas
                </Typography >
            )
            }
        </div>
    )
}

export default Stats;
