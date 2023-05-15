import React, { useEffect, useState } from 'react'
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { logout } from "./../../../Firebase/authFunctions"
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

function Logout() {
  const [logged, setLogged] = useState(true)
  const navigate = useNavigate();
  const log_out = () => {
    setLogged(!logged)
    logout();
  };

  useEffect(() => {
    if (logged == false) {
      navigate("/")
    }
  })

  return (
    <ListItemButton onClick={log_out}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary={"Log out"} />
    </ListItemButton>
  )
}

export default Logout