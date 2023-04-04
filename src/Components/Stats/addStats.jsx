import React, { useState } from 'react';
import StatsService from '../../../Firebase/statsService';

function addStats() {
  const [formData, setFormData] = useState({
    dni: '',
    routine_start_date: '',
    routine_end_date: '',
    habits: {
      smoke: false,
      drink: false,
      running: false,
      lifting: false,
    },
    considerations: {
      recent_surgeries: '',
      risks_factors: '',
    },
    weight_kg: 0,
    Height_cm: 0,
    IMC: 0,
    body_fat: 0,
    muscle: 0,
    visceral_fat: 0,
    metabolic_age: 0,
    kcal: 0,
    chest_back_cm: 0,
    waist_cm: 0,
    abdomen_cm: 0,
    hip_cm: 0,
    r_amr_cm: 0,
    l_amr_cm: 0,
    r_quad_cm: 0,
    l_quad_cm: 0,
    r_calf_cm: 0,
    l_calf_cm: 0,
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (event) => {        
    event.preventDefault();
    // Envía los datos al servidor mediante una llamada a la API
    try {
      StatsService.add({newStats})
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Fecha de inicio:
        <input
          type="date"
          name="routine_start_date"
          value={formData.routine_start_date}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Fecha de cambio:
        <input
          type="date"
          name="routine_end_date"
          value={formData.routine_end_date}
          onChange={handleInputChange}
        />
      </label>
      <fieldset>
        <legend>Habitos</legend>
        <label>
          Fuma:
          <input
            type="checkbox"
            name="habits.smoke"
            checked={formData.habits.smoke}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Bebe:
          <input
            type="checkbox"
            name="habits.drink"
            checked={formData.habits.drink}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Corre:
          <input
            type="checkbox"
            name="habits.running"
            checked={formData.habits.running}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Levanta pesas:
          <input
            type="checkbox"
            name="habits.lifting"
            checked={formData.habits.lifting}
            onChange={handleInputChange}
          />
        </label>
      </fieldset>
      <fieldset>
        <legend>COnsideraciones</legend>
        <label>
          Cirugías recientes:
          <input
            type="text"
            name="considerations.recent_surgeries"
            value={formData.considerations.recent_surgeries}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Factores de riesgo:
          <input
            type="text"
            name="considerations.risks_factors"
            value={formData.considerations.risks_factors}
            onChange={handleInputChange}
          />
        </label>
      </fieldset>
      <label>
        Peso (kg):
        <input
          type="number"
          name="weight_kg"
          value={formData.weight_kg}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Estatura (cm):
        <input
          type="number"
          name="Height_cm"
          value={formData.Height_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        IMC:
        <input
          type="number"
          name="IMC"
          value={formData.IMC}
          onChange={handleInputChange}
        />
      </label>
      <label>
        % Grasa corporal:
        <input
          type="number"
          name="%body_fat"
          value={formData['%body_fat']}
          onChange={handleInputChange}
        />
      </label>
      <label>
        % Musculo:
        <input
          type="number"
          name="%muscle"
          value={formData['%muscle']}
          onChange={handleInputChange}
        />
      </label>
      <label>
        % Grasa viceral:
        <input
          type="number"
          name="visceral_fat"
          value={formData.visceral_fat}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Edad metabólica:
        <input
          type="number"
          name="metabolic_age"
          value={formData.metabolic_age}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Kcal:
        <input
          type="number"
          name="kcal"
          value={formData.kcal}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Pecho/espalda (cm):
        <input
          type="number"
          name="chest_back_cm"
          value={formData.chest_back_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Cintura (cm):
        <input
          type="number"
          name="waist_cm"
          value={formData.waist_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Abdomen (cm):
        <input
          type="number"
          name="abdomen_cm"
          value={formData.abdomen_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Cadera (cm):
        <input
          type="number"
          name="hip_cm"
          value={formData.hip_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Brazo derecho (cm):
        <input
          type="number"
          name="r_amr_cm"
          value={formData.r_amr_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Brazo izquierdo (cm):
        <input
          type="number"metabólica
          name="l_amr_cm"
          value={formData.l_amr_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Pioerna derecha (cm):
        <input
          type="number"
          name="r_quad_cm"
          value={formData.r_quad_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Pierna izquierda (cm):
        <input
          type="number"
          name="l_quad_cm"
          value={formData.l_quad_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Pantorrilla derecha (cm):
        <input
          type="number"
          name="r_calf_cm"
          value={formData.r_calf_cm}
          onChange={handleInputChange}
        />
      </label>
      <label>
      Pantorrilla izquierda (cm):
        <input
          type="number"
          name="l_calf_cm"
          value={formData.l_calf_cm}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={() => handleDelete(client.uid)}>Guardar</button>
    </form>
  )
}

export default addStats;
