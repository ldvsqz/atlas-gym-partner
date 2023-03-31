import './App.css'
import Menu from "./Components/Menu/Menu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import Clients from "./Pages/Clients";
import Profile from "./Pages/Profile";


function App() {
  return (
    <>
    <Router>
      <Menu/>
      <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/events' element={<Events/>} />
          <Route path='/clients' element={<Clients/>} />
          <Route path='/perfil:id' element={<Profile/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
