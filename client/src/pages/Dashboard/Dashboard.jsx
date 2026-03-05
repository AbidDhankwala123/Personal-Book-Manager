import { useContext, useEffect, useState } from "react"
import search from "../../assets/search.png"
import styles from "./Dashboard.module.css"
import { useNavigate } from "react-router-dom";
import DeleteBook from "../../components/DeleteBook/DeleteBook";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import BookContext from "../../context/BookContext";

const Dashboard = () => {

    const { showDeletePopup, setDeletePopup, setDeleteBookId, editBook, listBooks, books, count, loading, successMessage, setSuccessMessage, setLogoutMessage } = useContext(BookContext);
    const navigate = useNavigate();

    const [status, setStatus] = useState("");
    const [statusArray, setStatusArray] = useState([]);
    const [tagsInput, setTagsInput] = useState("");

    useEffect(() => {

        const tagsArray = tagsInput
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        listBooks(statusArray, tagsArray);

    }, [statusArray, tagsInput, listBooks]);

    useEffect(() => {
        if (!successMessage) return;

        toast.success(successMessage, {
            position: "top-center",
            autoClose: 2000
        });

        setSuccessMessage("");
    }, [successMessage]);

    useEffect(() => {
        const showWelcome = localStorage.getItem("showWelcome");
        if (showWelcome === "true") {
            toast.success(`Welcome ${localStorage.getItem("name")}`, {
                position: "top-center",
                autoClose: 2000
            })
            localStorage.removeItem("showWelcome");
        }
    }, [])

    const handleDelete = (id) => {
        setDeletePopup(true);
        setDeleteBookId(id);
    }

    const handleLogout = () => {
        setLogoutMessage("You are Logged Out Successfully");
        localStorage.clear();
        navigate("/login");
    }

    const handleChange = e => {
        const newStatus = e.target.value
        setStatus(newStatus);
        if (!newStatus) return;
        setStatusArray(prev => prev.includes(newStatus) ? prev : [...prev, newStatus]);
    }

    const handleClear = () => {
        setStatus("");
        setStatusArray([]);
    }

    const handleCross = status => {
        if (statusArray.length === 1) setStatus("");
        setStatusArray(statusArray.filter(s => s !== status));
    }

    const handleMarkStatusChange = (e, id) => {
        const newStatus = e.target.value;
        if (!newStatus) return;
        editBook(id, { status: newStatus });
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.logout_btn}>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className={styles.filterbooks_container}>
                <div>
                    <img src={search} className={styles.search_icon} alt='search' />
                    <input type="text" name='tags' placeholder='Type tags (comma separated)' value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={styles.type_tag} />
                </div>

                <div className={styles.status_container}>
                    <select name="status" className={styles.status_dropdown} value={status} onChange={handleChange}>
                        <option value="">Status</option>
                        <option value="Want to Read">Want to Read</option>
                        <option value="Reading">Reading</option>
                        <option value="Completed">Completed</option>
                    </select>


                    <div className={styles.selected_status}>
                        {statusArray?.map((status) => {
                            return (
                                <div key={status}>
                                    <span>{status}</span>
                                    <span onClick={() => handleCross(status)}>X</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className={styles.clear_and_addbook_btn}>
                        <button className={`${styles.btns} ${styles.clear_btn}`} onClick={handleClear}>Clear</button>
                        <button className={`${styles.btns} ${styles.addbook_btn}`} onClick={() => navigate("/addBook")}>+ Add Book</button>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", width: "70vw" }}>
                <h1 style={{ marginBottom: "1rem" }}>My Books</h1>
                <p style={{ fontSize: "2rem", fontWeight: 600 }}>Total Book Count : {count}</p>
            </div>

            {loading && <Loader />}
            {books && books.length > 0 ? books.map((book) => {
                return (
                    <div className={styles.list_books} key={book._id}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h3>{book.title}</h3>
                            <span><strong>Status</strong> : {book.status}</span>
                        </div>
                        <hr />
                        <p><strong>Author : </strong>{book.author}</p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <strong>Tags:</strong>
                            <div className={styles.tags}>
                                {book.tags?.map((tag) => {
                                    return (
                                        <span key={tag}>{tag}</span>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={styles.edit_delete_btns}>
                            <select name="status" defaultValue="" onChange={e => handleMarkStatusChange(e, book._id)}>
                                <option value="">Mark Status as:</option>
                                <option value="Want to Read">Want to Read</option>
                                <option value="Reading">Reading</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button onClick={() => navigate(`/editBook/${book._id}`)}>Edit Book</button>
                            <button onClick={() => handleDelete(book._id)}>Delete Book</button>
                        </div>

                    </div>

                )
            }) : <p><strong>Books not Found!</strong></p>}

            {showDeletePopup && <DeleteBook />}
        </div>
    )
}

export default Dashboard