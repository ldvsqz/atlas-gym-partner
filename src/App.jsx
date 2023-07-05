import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { colors } from '@mui/material';
import Menu from "./Components/Menu/Menu";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Events from "./Pages/Events";
import Users from "./Pages/User/Users";
import User from "./Pages/User/User";
import Settings from "./Pages/Settings/Settings";
import Exercises from "./Pages/Exercises/Exercises";
import Aboutus from "./Pages/Aboutus/Aboutus";
import ResetPassword from './Pages/ResetPassword/ResetPassword';


function App() {
  const [themeMode, setThemeMode] = useState(localStorage.getItem("THEME") || 'light');

  useEffect(() => {
    localStorage.setItem("THEME", themeMode);
  }, [themeMode]);


  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: themeMode == 'dark' ? colors.deepOrange : colors.blueGrey
        },
      }),
    [themeMode]
  );


  const getMenu = (header = "Atlas") => (<Menu header={header} toggleThemeMode={toggleThemeMode} themeMode={themeMode} />);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events menu={getMenu("Eventos")} />} />
          <Route path="/users" element={<Users menu={getMenu("Personas")}/>} />
          <Route path="/settings" element={<Settings menu={getMenu("Configuración")}/>} />
          <Route path="/exercises" element={<Exercises menu={getMenu("Ejercicios")}/>} />
          <Route path="/aboutus" element={<Aboutus menu={getMenu("Sobre nosotros")}/>} />
          <Route path="/user/:uid" element={<User menu={getMenu("Atlas")}/>} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
