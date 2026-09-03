import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { logout } from "./../../../Firebase/authFunctions"
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

function Logout() {
  const navigate = useNavigate();
  const log_out = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <ListItemButton onClick={log_out}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary={"Cerrar sesión"} />
    </ListItemButton>
  )
}

export default Logout