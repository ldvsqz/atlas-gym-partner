import React, { useState, useEffect } from 'react';
import SetStats from './SetStats';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StatService from '../../../Firebase/statsService';
import Util from '../../assets/Util';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
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
                    <Button onClick={handleOpen}>Historial</Button>
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
                            <TableContainer component={Paper} sx={{ mt: 4 }}>
                                <Table sx={{ minWidth: '100%' }} aria-label="simple table" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="right">Peso</TableCell>
                                            <TableCell align="right">Estatura</TableCell>
                                            <TableCell align="right">IMC</TableCell>
                                            <TableCell align="right">Grasa corp</TableCell>
                                            <TableCell align="right">Musculo</TableCell>
                                            <TableCell align="right">Grasa viceral</TableCell>
                                            <TableCell align="right">Edad met</TableCell>
                                            <TableCell align="right">Kcal</TableCell>
                                            <TableCell align="right">Torso</TableCell>
                                            <TableCell align="right">Cintura</TableCell>
                                            <TableCell align="right">Cadera</TableCell>
                                            <TableCell align="right">Brazo</TableCell>
                                            <TableCell align="right">Pierna</TableCell>
                                            <TableCell align="right">Pantorrilla</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allStats.map((stat, indexE) => (
                                            <TableRow key={indexE} sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '4px' }}>
                                                <TableCell sx={{ padding: '5px' }} align="left">{util.formatDateShort(stat.date)}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.weight_kg}kg</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.Height_cm}cm</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.IMC}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">%{stat.body_fat}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">%{stat.muscle}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">%{stat.visceral_fat}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.metabolic_age}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.kcal}</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.chest_back_cm}cm</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.waist_cm}cm</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.hip_cm}cm</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.l_amr_cm}/{stat.r_amr_cm}cm</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.l_quad_cm}/{stat.r_quad_cm}cm</TableCell>
                                                <TableCell sx={{ padding: '5px' }} align="right">{stat.l_calf_cm}/{stat.r_calf_cm}cm</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
        </div>
    )
}

export default StatsHistory;

