import React, { useState, useEffect } from 'react';
import UserService from '../../../Firebase/userService';
import SetUser from "./SetUser";
import Menu from '../../Components/Menu/Menu';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


function User() {
  const [Users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selecteduser, setSelecteduser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      const UsersData = await UserService.getAll();
      setUsers(UsersData);
      setFilteredUsers(UsersData);
      setLoading(false)
    };
    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredUsersData = Users.filter((user) =>
      user.name.toLowerCase().includes(term)
    );
    setFilteredUsers(filteredUsersData);
  };

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('¿Estás seguro que quieres eliminar este usuario?');
    if (confirmDelete) {
      await UserService.delete(uid);
      const updatedUsersData = Users.filter((user) => user.uid !== uid);
      setUsers(updatedUsersData);
      setFilteredUsers(updatedUsersData);
    }
  };

  const getAge = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleViewProfile = (uid) => {
    navigate(`/user/${uid}`, { state: { uid } });
  };


  return (

    <div>
      <Menu />
      <Container fixed>
        {loading ? (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 1080 }}>
            <Typography variant="h4" gutterBottom>
              Lista de usuarios
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="left">Edad</TableCell>
                    <TableCell align="left">Teléfono</TableCell>
                    <TableCell align="left">Correo</TableCell>
                    <TableCell align="center">Detalles</TableCell>
                    <TableCell align="center">Editar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">{user.name}</TableCell>
                      <TableCell align="left">{getAge(user.birthday)}</TableCell>
                      <TableCell align="left">{user.phone}</TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">
                        <Button onClick={() => handleViewProfile(user.uid)}>Ver</Button>
                      </TableCell>
                      <TableCell align="center">
                      <SetUser
                          user={user}
                          onSave={(updateduser) => {
                            const updatedUsersData = Users.map((user) =>
                              user.uid === updateduser.uid ? updateduser : user
                            );
                            setUsers(updatedUsersData);
                            setFilteredUsers(updatedUsersData);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default User;
