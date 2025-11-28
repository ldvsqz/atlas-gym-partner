import { Timestamp } from 'firebase/firestore';

class StatsModel {
    constructor() {
      this.id = '';
      this.uid = '';
      this.date = Timestamp.now(),
      this.habits = {
        smoke: false,
        drink: false,
        running: false,
        lifting: false
      };
      this.considerations = {
        recent_surgeries: '',
        risks_factors: ''
      };
      this.weight_kg = 0.0;
      this.weight_kg_end = 0.0;
      this.Height_cm = 0;
      this.IMC = 0;
      this.body_fat = 0;
      this.muscle = 0;
      this.visceral_fat = 0;
      this.metabolic_age = 0;
      this.kcal = 0;
      this.chest_back_cm = 0;
      this.waist_cm = 0;
      this.abdomen_cm = 0;
      this.hip_cm = 0;
      this.r_amr_cm = 0;
      this.l_amr_cm = 0;
      this.r_quad_cm = 0;
      this.l_quad_cm = 0;
      this.r_calf_cm = 0;
      this.l_calf_cm = 0;
    }
  }
  export default StatsModel;
  