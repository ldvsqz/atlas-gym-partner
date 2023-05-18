import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// services and utilities
import UserService from '../../../Firebase/userService';
import Util from '../../assets/Util';
//MUI
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
//components
import Menu from '../../Components/Menu/Menu';

function User() {
  const [Users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const util = new Util();


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
        <Typography variant="h5" gutterBottom >
          Usuarios
        </Typography>
        <TextField label="Buscar usuario" variant="standard"
          value={searchTerm}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e);
          }}
          InputProps={{
            startAdornment: focused ? null : (
              <InputAdornment position="start">
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" height={40} />
          </Stack>
        ) : (
          <Box sx={{ width: '100%' }}>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Teléfono</TableCell>
                    <TableCell align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '4px', cursor: 'pointer' }} onClick={() => handleViewProfile(user.uid)}>
                      <TableCell sx={{ padding: '10px' }} >{user.name}, {getAge(user.birthday)}</TableCell>
                      <TableCell sx={{ padding: '10px' }} align="center">{user.phone}</TableCell>
                      <TableCell sx={{ padding: '10px' }} align="center">{util.formatDateShort(user.until)}</TableCell>
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
