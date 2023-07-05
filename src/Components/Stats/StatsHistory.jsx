import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import StatService from '../../../Firebase/statsService';
import Util from '../../assets/Util';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import './SetStats.css';

function StatsHistory({ uid }) {
    const [open, setOpen] = useState(false);
    const [allStats, setAllStats] = useState([]);
    const util = new Util();

    useEffect(() => {
        const fetchStatsHistory = async () => {
            const userStats = await StatService.getAllByUID(uid);
            setAllStats(userStats);
        };
        fetchStatsHistory();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            {allStats.length != 0 ? (
                <div>
                    <Button onClick={handleOpen} fullWidth>Historial</Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Historial de medidas
                        </DialogTitle>
                        <DialogContent>
                            <div style={{ display: 'flex', overflowX: 'auto' }}>
                                <List sx={{ whiteSpace: 'nowrap' }} style={{ whiteSpace: 'nowrap' }} dense>
                                    <ListItem key={"Fecha"}>
                                        <ListItemText primary={`Fecha: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Peso"}>
                                        <ListItemText primary={`Peso: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"IMC"}>
                                        <ListItemText primary={`IMC: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Grasa corp"}>
                                        <ListItemText primary={`Grasa corp: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Musculo"}>
                                        <ListItemText primary={`Musculo: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Grasa visceral"}>
                                        <ListItemText primary={`Grasa visceral: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Torso"}>
                                        <ListItemText primary={`Torso: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Cintura"}>
                                        <ListItemText primary={`Cintura: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem key={"Cadera"}>
                                        <ListItemText primary={`Cadera: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={`Brazo: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={`Pierna: `} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={`Pantorrilla: `} />
                                    </ListItem>
                                </List>
                                {allStats.map((stat, indexE) => (
                                    <List key={{ indexE }} sx={{ minWidth: '15%' }} style={{ color: indexE === 0 ? 'green' : 'inherit' }} dense>
                                        <ListItem key={indexE}>
                                            <ListItemText primary={util.formatDateShort(util.getDateFromFirebase(stat.date))} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.weight_kg}kg`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.IMC}`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.body_fat}%`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.muscle}%`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.visceral_fat}%`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.chest_back_cm}cm`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.waist_cm}cm`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.hip_cm}cm`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.l_amr_cm}/${stat.r_amr_cm}cm`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.l_quad_cm}/${stat.r_quad_cm}cm`} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem >
                                            <ListItemText primary={`${stat.l_calf_cm}/${stat.r_calf_cm}cm`} />
                                        </ListItem>
                                    </List>
                                ))}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Aceptar</Button>
                        </DialogActions>

                    </Dialog>
                </div >
            ) : (
                <Stack spacing={1} sx={{ width: '100%', mt: 2 }}>
                    <Skeleton animation="wave" variant="rectangular" height={10} />
                </Stack>
            )
            }
        </div >
    )
}

export default StatsHistory;

