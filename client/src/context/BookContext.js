import { createContext, useCallback, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BookContext = createContext();

export const BookContextProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [logoutMessage, setLogoutMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const jwtToken = localStorage.getItem("jwtToken");

    const [showDeletePopup, setDeletePopup] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState("");

    const navigate = useNavigate();

    const listBooks = useCallback(() => {
        if (!jwtToken) return;
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
                console.error(error.response?.data?.message);
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
                toast.error(error.response?.data?.message, {
                    position: "top-center",
                    autoClose: 1000
                })
            })
            .finally(() => {
                setLoading(false);
            })
    }, [jwtToken, navigate])

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
                console.error(error.response?.data?.message);
                if (error.response.status === 401) {
                    toast.error("Invalid Session or Session expired. Please Log In again", {
                        position: "top-center",
                        autoClose: 2000
                    });
                    localStorage.clear();
                    setTimeout(() => navigate("/login"), 2000);
                    return;
                }
                toast.error(error.response?.data?.message, {
                    position: "top-center",
                    autoClose: 2000
                })
            })
            .finally(() => {
                setLoading(false);
            })
    }
    return (
        <BookContext.Provider value={{ showDeletePopup, setDeletePopup, deleteBookId, setDeleteBookId, books, setBooks, loading, setLoading, count, setCount, logoutMessage, setLogoutMessage, successMessage, setSuccessMessage, listBooks, editBook }}>
            {children}
        </BookContext.Provider>
    )
}

export default BookContext