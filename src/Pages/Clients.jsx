import React, { useState, useEffect } from 'react';
import UserService from '../../Firebase/userService';

function Clients() {

  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Obtener todos los usuarios cuando se monta el componente
    UserService.getAll().then(users =>
      setClients(users)
    ).catch(error =>
      console.error('Error al obtener los usuarios:', error)
    );
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  console.log(clients);
  const filteredClients = clients && clients.filter(client => {
    const searchRegex = new RegExp(searchTerm, 'gi');
    return client.name.match(searchRegex);
  });

  return (
    <div>
      <h1>Clientes</h1>
      <input type="text" placeholder="Buscar cliente" onChange={handleSearch} />
      <ul>
        {filteredClients.map(client => (
          <li key={client.uid}>{client.name} ({client.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;