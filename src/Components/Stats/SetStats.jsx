import React, { useState, useEffect } from 'react';
import StatsService from '../../../Firebase/statsService';
import StatsModel from '../../models/StatsModel'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloseIcon from '@mui/icons-material/Close';

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

function SetStats(props) {
  const { stats = new StatsModel(), uid = '', isEditing = false, onSave } = props;
  if (!isEditing) {
    stats.uid = uid;
    stats.date = new Date().toString();
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
    if (isEditing) {
      StatsService.update(updatedStats.id, updatedStats);
    } else {
      StatsService.add(updatedStats);
    }
    console.log(updatedStats);
    onSave(updatedStats);
    handleClose();
  };

  function calculateIMC(weight_kg, Height_cm) {
    const HeightMeters = Height_cm / 10;
    const imc = weight_kg / (HeightMeters ** 2);
    return imc.toFixed(2);
  }

  return (
    <div>
      <Button onClick={handleOpen}>{isEditing ? 'Editar medidas actuales' : 'Agregar nuevas medidas'}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button onClick={handleClose}><CloseIcon /></Button>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend">Hábitos</FormLabel>
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
                label="Levanta pesas"
              />
            </FormControl>
            <fieldset>
              <legend>Consideraciones</legend>
              <TextField id="standard-basic" label="Cirugías recientes" variant="standard"
                type="text"
                value={statsState.considerations.recent_surgeries}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    considerations: { ...statsState.considerations, recent_surgeries: event.target.value },
                  })
                }
              />
              <TextField id="standard-basic" label="Factores de riesgo" variant="standard"
                type="text"
                value={statsState.considerations.risks_factors}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    considerations: { ...statsState.considerations, risks_factors: event.target.value },
                  })
                }
              />
            </fieldset>
            <fieldset>
              <legend>Medidas</legend>
              <TextField id="standard-basic" label="Peso kg" variant="standard"
                value={statsState.weight_kg}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    weight_kg: event.target.value,
                    IMC: calculateIMC(statsState.weight_kg, statsState.Height_cm),
                  })
                }
              />
              <TextField id="standard-basic" label="Estatura cm" variant="standard"
                value={statsState.Height_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    Height_cm: event.target.value,
                    IMC: calculateIMC(statsState.weight_kg, statsState.Height_cm),
                  })
                }
              />
              <TextField id="standard-basic" label="IMC" variant="standard"
                value={statsState.IMC}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    IMC: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Grasa corporal %" variant="standard"
                value={statsState.body_fat}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    body_fat: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Musculo %" variant="standard"
                value={statsState.muscle}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    muscle: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Grasa viceral %" variant="standard"
                value={statsState.visceral_fat}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    visceral_fat: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Edad metabólica" variant="standard"
                value={statsState.metabolic_age}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    metabolic_age: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Kcal" variant="standard"
                value={statsState.kcal}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    kcal: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Pecho/espalda cm" variant="standard"
                value={statsState.chest_back_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    chest_back_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Cintura cm" variant="standard"
                value={statsState.waist_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    waist_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Abdomen cm" variant="standard"
                value={statsState.abdomen_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    abdomen_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Cadera cm" variant="standard"
                value={statsState.hip_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    hip_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Brazo derecho cm" variant="standard"
                value={statsState.r_amr_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    r_amr_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Brazo izquierdo cm" variant="standard"
                value={statsState.l_amr_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    l_amr_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Pioerna derecha cm" variant="standard"
                value={statsState.r_quad_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    r_quad_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Pierna izquierda cm" variant="standard"
                value={statsState.l_quad_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    l_quad_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Pantorrilla derecha cm" variant="standard"
                value={statsState.r_calf_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    r_calf_cm: event.target.value,
                  })
                }
              />
              <TextField id="standard-basic" label="Pantorrilla izquierda cm" variant="standard"
                value={statsState.l_calf_cm}
                onChange={(event) =>
                  setStatsState({
                    ...statsState,
                    l_calf_cm: event.target.value,
                  })
                }
              />
            </fieldset>
            <Button type="submit">Guardar</Button>
          </form>
        </Box>
      </Modal>
    </div >
  );

}

export default SetStats;
