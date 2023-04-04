import React, { useState, useEffect } from 'react';
import UserService from '../../../Firebase/userService';
import EditClientModal from "./EditClientModal";
import Menu from '../../Components/Menu/Menu';
import { useNavigate } from "react-router-dom";


function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchClients = async () => {
      const clientsData = await UserService.getAll();
      setClients(clientsData);
      setFilteredClients(clientsData);
    };
    fetchClients();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredClientsData = clients.filter((client) =>
      client.name.toLowerCase().includes(term)
    );
    setFilteredClients(filteredClientsData);
  };

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('¿Estás seguro que quieres eliminar este usuario?');
    if (confirmDelete) {
      await UserService.delete(uid);
      const updatedClientsData = clients.filter((client) => client.uid !== uid);
      setClients(updatedClientsData);
      setFilteredClients(updatedClientsData);
    }
  };

  const getAge = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleViewProfile = (uid, client) => {
    navigate(`/perfil/${uid}`, { state: { client } });
  };
  

  return (
    <div>
      <Menu />
      <h1>Clients</h1>
      <input
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Detalles</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.uid}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{getAge(client.birthday)}</td>
              <td>
                <button onClick={() => handleViewProfile(client.uid, client)}>Ver</button>
              </td>
              <td>
                <button onClick={() => setSelectedClient(client)}>Editar</button>
              </td>
              <td>
                <button onClick={() => handleDelete(client.uid)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          isOpen={true}
          onClose={() => setSelectedClient(null)}
          onSave={(updatedClient) => {
            const updatedClientsData = clients.map((client) =>
              client.uid === updatedClient.uid ? updatedClient : client
            );
            setClients(updatedClientsData);
            setFilteredClients(updatedClientsData);
            setSelectedClient(null);
          }}
        />
      )}

    </div>
  );
}

export default Clients;
