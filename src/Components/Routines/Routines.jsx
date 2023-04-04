import React from "react";
import "./Routines.css";

function Routines(props) {
  const [coach, setCoach] = React.useState("Jota");
  const [objective, setObjective] = React.useState("Definición");

  const handleCoachChange = (event) => {
    setCoach(event.target.coach);
  };

  const handleObjectiveChange = (event) => {
    setObjective(event.target.objective);
  };

  return (
    <div>
      <h1>Routines</h1>
      <br />
      <label>ID:</label>
      <input type="text" />
      <br />
      <label>Entrenador:</label>
      <select value={coach} onChange={handleCoachChange}>
        <option value="Jota">Jota</option>

        <option value="Luigi">Luigi</option>

        <option value="Pepito">Pepito</option>
      </select>
      <br />
      <label>Objetivo:</label>
      <select value={objective} onChange={handleObjectiveChange}>
        <option value="am">Aumento de masa muscular</option>

        <option value="def">Definición</option>

        <option value="other">Other example</option>
      </select>
    </div>
  );
}

export default Routines;
