import React, { useEffect, useState } from 'react'
import {logout} from "./../../../Firebase/authFunctions"
import { Link, useNavigate } from "react-router-dom";

function Logout() {
    const [logged, setLogged] = useState(true)
    const navigate = useNavigate();
    const log_out = () => {
        setLogged(!logged)
        logout();
      };

    useEffect(()=> {
        if (logged == false) {
            navigate("/")
        }
    })

  return (
    <>
    <button onClick={log_out}>Log out</button>
    </>
  )
}

export default Logout