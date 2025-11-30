import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, CircularProgress, Typography } from '@mui/material';
import StatService from '../../../Firebase/statsService';
import Util from '../../assets/Util';

function StatsChart({ uid }) {
    const [open, setOpen] = useState(false);
    const util = new Util();
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchStatsHistory = async () => {
            try {
                setLoading(true);
                // Fetch all stats for the user
                const allStats = await StatService.getAllByUID(uid);

                if (allStats && allStats.length > 0) {
                    // Sort by date (oldest first)
                    const sortedStats = allStats.reverse();

                    // Map to chart format
                    const data = sortedStats.map((stat) => ({
                        date: util.formatDateShort(util.getDateFromFirebase(stat.date)),
                        weight: stat.weight_kg,
                        height: stat.Height_cm,
                        imc: stat.IMC,
                    }));

                    setChartData(data);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching stats history:', err);
                setError('Error loading chart data');
            } finally {
                setLoading(false);
            }
        };

        if (uid) {
            fetchStatsHistory();
        }
    }, [uid]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (chartData.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary">
                    No hay datos de historial disponibles
                </Typography>
            </Box>
        );
    }

    return (
        <div>
            <Button onClick={handleOpen} fullWidth>Gráfico</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Progreso de peso
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 340, height: 300, mt: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#8884d8"
                                    name="Peso (kg)"
                                    dot={{ fill: '#8884d8', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="imc"
                                    stroke="#82ca9d"
                                    name="IMC "
                                    dot={{ fill: '#82ca9d', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Aceptar</Button>
                </DialogActions>

            </Dialog>
        </div >

    );
}

export default StatsChart;
