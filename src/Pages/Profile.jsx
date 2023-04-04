import React from 'react';
import Menu from '../Components/Menu/Menu';
import Stats from '../Components/Stats/addStats';
import { useLocation } from 'react-router-dom';
import StatService from '../../Firebase/statsService';
//import RoutinesService from '../../Firebase/routinesService';
import Routines from '../Components/Routines/Routines';

function Profile() {
  const location = useLocation();
  const client = location?.state?.client;
  console.log(client);
  const userStats = StatService.getLast(client?.uid)
  //const userRoutine = RoutinesService.getLast(dni)
  //const userSub = SUbscriptionsService.getLast(dni)

  const getAge = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };


  return (
    <div>
      <Menu />
      <h1>{client?.name}</h1>
      <p>Edad: {getAge(client?.birthday)}</p>
      <p>Correo: {client?.email}</p>
      <p>Teléfono: {client?.phone}</p>
      <p>Suscrito hasta: userSub.date</p>
    </div>
  );
}

export default Profile;