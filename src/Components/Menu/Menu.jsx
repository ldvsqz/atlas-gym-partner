import React, { useState } from "react";
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
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import "./Menu.css";




function Menu() {

  const [uid, setUid] = useState(localStorage.getItem("UID"))
  const [currentRol, setRol] = useState(localStorage.getItem("ROL"))
  const [showMenu, setMenu] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setMenu(open);
  };

  const handleOnNavigate = () => {
    setUid(localStorage.getItem("UID"))<
    navigate(`/user/${uid}`, { state: { uid } });
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
          <Toolbar sx={{ marginRight: "auto" }}>
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              color="inherit"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Atlas
            </Typography>
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