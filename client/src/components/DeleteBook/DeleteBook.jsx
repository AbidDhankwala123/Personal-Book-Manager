import styles from "./DeleteBook.module.css"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import BookContext from "../../context/BookContext";

const DeleteBook = () => {
  const { setDeletePopup, setDeleteBookId, deleteBookId, listBooks, loading, setLoading } = useContext(BookContext);
  const navigate = useNavigate();

  const handleDeleteBook = () => {
    setLoading(true);
    axios.delete(`http://localhost:5000/deleteBook/${deleteBookId}`,
      {
        headers:
        {
          "Authorization": "Bearer " + localStorage.getItem("jwtToken")
        }
      })
      .then(response => {
        console.log(response);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000
        })
        setDeletePopup(false);
        listBooks();
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
          autoClose: 2000
        })
      })
      .finally(() => {
        setLoading(false);
      })
  }
  const handleCancel = () => {
    setDeletePopup(false);
    setDeleteBookId("");
  }

  return (
    <div className={styles.deleteBook_container}>
      <div className={styles.deleteBook_popup}>
        <p>Are you confirm you want to delete?</p>
        <div className={styles.btn_container}>
          <button onClick={handleDeleteBook} disabled={loading}>{loading ? "Deleting..." : "Confirm Delete"}</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteBook
