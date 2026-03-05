import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard/Dashboard"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import Navbar from "./components/Navbar/Navbar"
import AddOrEditBook from "./pages/AddOrEditBook/AddOrEditBook"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { BookContextProvider } from "./context/BookContext"

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname === "/" || location.pathname === "/login";
  const jwtToken = localStorage.getItem("jwtToken");

  return (
    <div>
      <BookContextProvider>
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={jwtToken ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/login" element={jwtToken ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={jwtToken ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/addBook" element={jwtToken ? <AddOrEditBook /> : <Navigate to="/login" />} />
          <Route path="/editBook/:bookId" element={jwtToken ? <AddOrEditBook /> : <Navigate to="/login" />} />
        </Routes>
      </BookContextProvider>
      <ToastContainer />
    </div>
  )
}

export default App