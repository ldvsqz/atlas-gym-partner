import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Events from "./Pages/Events";
import Users from "./Pages/User/Users";
import User from "./Pages/User/User";
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import { blue, teal } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: teal[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
          <Route path='/' exact element={<Login/>} />
          <Route path='/reset' exact element={<ResetPassword/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/events' element={<Events/>} />
          <Route path='/users' element={<Users/>} />
          <Route path='/user/:uid' element={<User/>} />
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App
