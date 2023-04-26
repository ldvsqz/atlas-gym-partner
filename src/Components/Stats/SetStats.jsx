import React, { useState, useEffect } from 'react';
import StatsService from '../../../Firebase/statsService';
import StatsModel from '../../models/StatsModel'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import './SetStats.css';


function SetStats(props) {
  const { stats = new StatsModel(), uid = '', isEditing = false, onSave } = props;
  if (!isEditing) {
    stats.uid = uid;
    stats.date = isEditing ? stats.date : new Date().toString();
  }

  const [statsState, setStatsState] = useState(stats);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setStatsState(statsState)
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedStats = { ...statsState };
    handleClose();
    console.log(updatedStats);
    if (isEditing) {
      StatsService.update(updatedStats.id, updatedStats);
    } else {
      StatsService.add(updatedStats);
    }
    onSave(updatedStats);
  };

  function calculateIMC(weight_kg, Height_cm) {
    const HeightMeters = Height_cm / 10;
    const imc = weight_kg / (HeightMeters ** 2);
    return imc.toFixed(2);
  }

  return (
    <>
      <Button onClick={handleOpen}>{isEditing ? 'Editar' : 'Agregar nuevas'}</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isEditing ? 'Medidas actuales' : 'Nuevas medidas'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Hábitos
          </Typography>
          <FormControl sx={{ m: 3 }}>
            <Grid container sx={{ color: 'text.primary' }}>
              <Grid item sx={{ mt: 2, marginLeft: '15px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={statsState.habits.smoke}
                      onChange={(event) =>
                        setStatsState({
                          ...statsState,
                          habits: { ...statsState.habits, smoke: event.target.checked },
                        })
                      }
                    />
                  }
                  label="Fuma"
                />
              </Grid>
              <Grid item sx={{ mt: 2, marginLeft: '15px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={statsState.habits.drink}
                      onChange={(event) =>
                        setStatsState({
                          ...statsState,
                          habits: { ...statsState.habits, drink: event.target.checked },
                        })
                      }
                    />
                  }
                  label="Bebe"
                />
              </Grid>
              <Grid item sx={{ mt: 2, marginLeft: '15px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={statsState.habits.running}
                      onChange={(event) =>
                        setStatsState({
                          ...statsState,
                          habits: { ...statsState.habits, running: event.target.checked },
                        })
                      }
                    />
                  }
                  label="Corre"
                />
              </Grid>
              <Grid item sx={{ mt: 2, marginLeft: '15px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={statsState.habits.lifting}
                      onChange={(event) =>
                        setStatsState({
                          ...statsState,
                          habits: { ...statsState.habits, lifting: event.target.checked },
                        })
                      }
                    />
                  }
                  label="Pesas"
                />
              </Grid>
            </Grid>
          </FormControl>

          <Typography variant="h6" gutterBottom>
            Consideraciones
          </Typography>
          <Grid container sx={{ color: 'text.primary' }}>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Cirugías recientes" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                type="text"
                value={statsState.considerations.recent_surgeries}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    considerations: { ...statsState.considerations, recent_surgeries: event.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Factores de riesgo" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                type="text"
                value={statsState.considerations.risks_factors}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    considerations: { ...statsState.considerations, risks_factors: event.target.value },
                  })
                }
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Medidas
          </Typography>
          <Grid container sx={{ color: 'text.primary' }}>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Peso kg" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.weight_kg}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    weight_kg: event.target.value,
                    IMC: calculateIMC(statsState.weight_kg, statsState.Height_cm),
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Estatura cm" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.Height_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    Height_cm: event.target.value,
                    IMC: calculateIMC(statsState.weight_kg, statsState.Height_cm),
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="IMC" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.IMC}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    IMC: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Grasa corp %" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.body_fat}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    body_fat: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Músculo %" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.muscle}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    muscle: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Grasa viceral %" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.visceral_fat}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    visceral_fat: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Edad metabólica" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.metabolic_age}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    metabolic_age: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Kcal" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.kcal}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    kcal: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Pecho/espalda cm" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.chest_back_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    chest_back_cm: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Cintura cm" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.waist_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    waist_cm: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Cadera cm" variant="standard" sx={{ maxWidth: '90%', padding: '10px' }}
                value={statsState.hip_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    hip_cm: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Brazo izq cm" variant="standard" sx={{ maxWidth: '40%', padding: '10px' }}
                value={statsState.l_amr_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    l_amr_cm: event.target.value,
                    r_amr_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Brazo der cm" variant="standard" sx={{ maxWidth: '40%', padding: '10px' }}
                value={statsState.r_amr_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    r_amr_cm: event.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Pierna izq cm" variant="standard" sx={{ maxWidth: '40%', padding: '10px' }}
                value={statsState.l_quad_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    l_quad_cm: event.target.value,
                    r_quad_cm: event.target.value,
                  })
                }
              /><TextField id="standard-basic" label="Pierna der cm" variant="standard" sx={{ maxWidth: '40%', padding: '10px' }}
                value={statsState.r_quad_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    r_quad_cm: event.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField id="standard-basic" label="Pant. izq cm" variant="standard" sx={{ maxWidth: '40%', padding: '10px' }}
                value={statsState.l_calf_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    l_calf_cm: event.target.value,
                    r_calf_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Pant. der cm" variant="standard" sx={{ maxWidth: '40%', padding: '10px' }}
                value={statsState.r_calf_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    r_calf_cm: event.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>

    </>
  );

}

export default SetStats;
