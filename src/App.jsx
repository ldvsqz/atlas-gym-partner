// import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Events from "./Pages/Events";
import Users from "./Pages/User/Users";
import User from "./Pages/User/User";
import Settings from "./Pages/Settings/Settings";
import Exercises from "./Pages/Exercises/Exercises";
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import { colors } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: colors.deepOrange,
    secondary: colors.teal,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.deepOrange,
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' exact element={<Login />} />
          <Route path='/reset' exact element={<ResetPassword />} />
          <Route path='/register' element={<Register />} />
          <Route path='/events' element={<Events />} />
          <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/exercises' element={<Exercises />} />
          <Route path='/user/:uid' element={<User />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
