import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Dashboard from "./pages/Dashboard/Dashboard"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import Navbar from "./components/Navbar/Navbar"

const App = () => {
  const location = useLocation();

  const showNavbar = location.pathname === "/register" || location.pathname === "/login";
  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App