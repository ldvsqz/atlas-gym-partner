import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserService from '../../../Firebase/userService';
import Menu from '../../Components/Menu/Menu';
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
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

function User() {
  const [Users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
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
          <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
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
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="left">Teléfono</TableCell>
                    <TableCell align="left">Estado</TableCell>
                    <TableCell align="center">Detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">{user.name}, {getAge(user.birthday)}</TableCell>
                      <TableCell align="left">{user.phone}</TableCell>
                      <TableCell align="left">{user.until}</TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleViewProfile(user.uid)}>Ver</Button>
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
