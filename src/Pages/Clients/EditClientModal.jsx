import React, { useState } from 'react';
import UserService from '../../../Firebase/userService';

function EditClientModal({ client, isOpen, onClose, onSave }) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [birthday, setBirthday] = useState(client.birthday);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedClient = { ...client, name, email, phone, birthday };
    UserService.update(updatedClient.dni, updatedClient)
    onSave(updatedClient);
  };

  return (
    <div className="modal" style={{ display: isOpen ? "block" : "none" }}>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <label>
            Npmbre:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Correo:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Teléfono:
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            Fecha de nacimiento:
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </label>
          <button type="submit">Guardar</button>
        </form>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default EditClientModal;
