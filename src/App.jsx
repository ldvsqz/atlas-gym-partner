import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Events from "./Pages/Events";
import Users from "./Pages/User/Users";
import User from "./Pages/User/User";
import ResetPassword from './Pages/ResetPassword/ResetPassword';


function App() {
  return (
    <>
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
    </>
  )
}

export default App
