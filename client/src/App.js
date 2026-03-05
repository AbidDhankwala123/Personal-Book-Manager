import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard/Dashboard"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import Navbar from "./components/Navbar/Navbar"
import axios from "axios"
import { useCallback, useState } from "react"
import AddOrEditBook from "./pages/AddOrEditBook/AddOrEditBook"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();

  const showNavbar = location.pathname === "/" || location.pathname === "/login";

  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(0);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const jwtToken = localStorage.getItem("jwtToken");

  const navigate = useNavigate();

  const listBooks = useCallback(() => {
    setLoading(true);
    axios.get("http://localhost:5000/books",
      {
        headers:
        {
          "Authorization": "Bearer " + jwtToken
        }
      })
      .then(response => {
        console.log(response);
        setBooks(response.data.books);
        setCount(response.data.count)
      })
      .catch(error => {
        console.error(error.response.data.message);
        if (error.response.status === 401) {
          toast.error("Invalid Session or Session expired. Please Log In again", {
            position: "top-center",
            autoClose: 2000
          });
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 1000
        })
      })
      .finally(() => {
        setLoading(false);
      })
  }, [jwtToken])

  const editBook = (bookId, bookDetailsObject) => {
    setLoading(true);
    axios.patch(`http://localhost:5000/updateBook/${bookId}`, bookDetailsObject,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken
        }
      }
    )
      .then(response => {
        navigate("/dashboard");
        listBooks();
        setSuccessMessage(response.data.message);
      })
      .catch(error => {
        console.error(error.response.data.message);
        if (error.response.status === 401) {
          toast.error("Invalid Session or Session expired. Please Log In again", {
            position: "top-center",
            autoClose: 2000
          });
          localStorage.clear();
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000
        })
      })
      .finally(() => {
        setLoading(false);
      })
  }
  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={jwtToken ? <Navigate to="/dashboard" /> : <Register loading={loading} setLoading={setLoading} />} />
        <Route path="/login" element={jwtToken ? <Navigate to="/dashboard" /> : <Login loading={loading} setLoading={setLoading} logoutMessage={logoutMessage} />} />
        <Route path="/dashboard" element={jwtToken ? <Dashboard setSuccessMessage={setSuccessMessage} successMessage={successMessage} setLogoutMessage={setLogoutMessage} loading={loading} setLoading={setLoading} listBooks={listBooks} books={books} count={count} editBook={editBook} /> : <Navigate to="/login" />} />
        <Route path="/addBook" element={jwtToken ? <AddOrEditBook setSuccessMessage={setSuccessMessage} loading={loading} setLoading={setLoading} listBooks={listBooks} editBook={editBook} /> : <Navigate to="/login" />} />
        <Route path="/editBook/:bookId" element={jwtToken ? <AddOrEditBook setSuccessMessage={setSuccessMessage} loading={loading} setLoading={setLoading} listBooks={listBooks} editBook={editBook} /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App