import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from '@mui/icons-material/Settings';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InfoIcon from '@mui/icons-material/Info';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ToggleButton from '@mui/material/ToggleButton';
import { auth } from "../../../Firebase/authFunctions";
import "./Menu.css";




function Menu({ header, toggleThemeMode, themeMode }) {
  const [uid, setUid] = useState(localStorage.getItem("UID"))
  const [currentRol, setRol] = useState(localStorage.getItem("ROL"));
  const [showMenu, setMenu] = useState(false);
  const dark = localStorage.getItem("THEME");
  const [darkTheme, setDarkTheme] = useState(dark == 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/'); // Redirect to the login page if user is not authenticated
      }
    };

    checkAuthState(); // Check authentication state on component mount

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/'); // Redirect to the login page if user is not authenticated
      }
    });

    return () => {
      unsubscribe(); // Cleanup the auth state change listener on component unmount
    };
  }, []);


  useEffect(() => {
    const theme = darkTheme ? 'dark' : 'light';
    localStorage.setItem("THEME", theme);
  }, [darkTheme]);


  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setMenu(open);
  };

  const handleOnNavigate = () => {
    setUid(localStorage.getItem("UID"));
    navigate(`/user/${uid}`, { state: { uid } });
  }

  const handleOnswitchTheme = () => {
    toggleThemeMode()
    setDarkTheme(!darkTheme);
  }


  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem key={"Mi perfil"} disablePadding>
          <ListItemButton onClick={() => handleOnNavigate()}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Mi perfil"} />
          </ListItemButton>
        </ListItem>

        {currentRol == 0 && <ListItem key={"Personas"} disablePadding>
          <ListItemButton component={Link} to="/users">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Personas"} />
          </ListItemButton>
        </ListItem>
        }


        <ListItem key={"Eventos"} disablePadding>
          <ListItemButton component={Link} to="/events">
            <ListItemIcon>
              <EmojiEventsIcon />
            </ListItemIcon>
            <ListItemText primary={"Eventos"} />
          </ListItemButton>
        </ListItem>

        {currentRol == 0 && <ListItem key={"Configuración"} disablePadding>
          <ListItemButton component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Configuración"} />
          </ListItemButton>
        </ListItem>
        }

        {currentRol == 0 && <ListItem key={"Ejercicios"} disablePadding>
          <ListItemButton component={Link} to="/exercises">
            <ListItemIcon>
              <FitnessCenterIcon />
            </ListItemIcon>
            <ListItemText primary={"Ejercicios"} />
          </ListItemButton>
        </ListItem>
        }
        <ListItem key={"Sobre nosotros"} disablePadding>
          <ListItemButton component={Link} to="/aboutus">
            <ListItemIcon>
              <InfoIcon sx={{ color: "#ff5722" }} />
            </ListItemIcon>
            <ListItemText primary={"Sobre nosotros"} />
          </ListItemButton>
        </ListItem>

        <Divider />
        <ListItem key={"logout"} disablePadding>
          <Logout />
        </ListItem>
      </List>
    </Box >
  );


  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" >
          <Toolbar >
            <IconButton
              sx={{ width: 50 }}
              onClick={toggleDrawer(true)}
              edge="start"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginRight: "auto" }}>
              {header}
            </Typography>
            <div style={{ marginLeft: "auto" }}>
              <ToggleButton
                value=""
                selected={darkTheme}
                onChange={() => { handleOnswitchTheme(!darkTheme) }}
              >
                {darkTheme ? <DarkModeIcon /> : <LightModeIcon />}
              </ToggleButton>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        anchor={"left"}
        open={showMenu}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </div>
  );
}

export default Menu;