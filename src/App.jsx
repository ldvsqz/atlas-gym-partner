import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Events from "./Pages/Events";
import Clients from "./Pages/Clients/Clients";
import Profile from "./Pages/Profile";


function App() {
  return (
    <>
    <Router>
      <Routes>
          <Route path='/' exact element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/events' element={<Events/>} />
          <Route path='/clients' element={<Clients/>} />
          <Route path='/perfil/:uid' element={<Profile/>} />

      </Routes>
    </Router>
    </>
  )
}

export default App
