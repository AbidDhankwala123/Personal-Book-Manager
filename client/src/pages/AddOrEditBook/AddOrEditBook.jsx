import { useContext, useEffect, useState } from 'react'
import styles from "./AddOrEditBook.module.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import BookContext from '../../context/BookContext'

const AddOrEditBook = () => {
    const { loading, setLoading, listBooks, setSuccessMessage, editBook } = useContext(BookContext);
    const navigate = useNavigate();
    const { bookId } = useParams();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [tags, setTags] = useState("");
    const [status, setStatus] = useState("");

    const jwtToken = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (bookId) {
            axios.get(`http://localhost:5000/book/${bookId}`,
                {
                    headers:
                    {
                        "Authorization": "Bearer " + jwtToken
                    }
                })
                .then(response => {
                    console.log(response);
                    setTitle(response.data.book.title);
                    setAuthor(response.data.book.author);
                    setTags(response.data.book.tags.join(", "));
                    setStatus(response.data.book.status);
                })
                .catch(error => {
                    console.error(error.response?.data?.message);
                    toast.error(error.response?.data?.message, {
                        position: "top-center",
                        autoClose: 2000
                    })
                })
        }
    }, [bookId, jwtToken])

    const bookDetailsObject = {
        title,
        author,
        tags,
        status
    }

    const addBook = () => {
        setLoading(true);
        axios.post("http://localhost:5000/addBook", bookDetailsObject,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken
                }
            })
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

    const handleSubmit = e => {
        e.preventDefault();

        if (!title.trim() || !author.trim() || !tags.trim() || !status) {
            return toast.error("All fields are required", {
                position: "top-center",
                autoClose: 2000
            })
        }

        if (bookId) {
            editBook(bookId, bookDetailsObject)
        }
        else {
            addBook();
        }
    }
    const handleCancel = () => navigate("/dashboard");

    return (
        <div className={styles.container}>
            <div className={styles.addOrEditBook_form_container}>
                <h2>{bookId ? "Edit Book Description" : "Add Book Description"}</h2>
                <form className={styles.addform} onSubmit={handleSubmit}>
                    <div className={styles.addform_div}>
                        <label>Title</label>
                        <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder='Enter your book title here' className={styles.book_input} />
                    </div>
                    <div className={styles.addform_div}>
                        <label>Author</label>
                        <input type="text" name="author" value={author} onChange={e => setAuthor(e.target.value)} placeholder='Enter the author name here' className={styles.book_input} />
                    </div>
                    <div className={styles.addform_div}>
                        <label>Tags</label>
                        <input type="text" name="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder='Enter the tags by comma separated' className={styles.book_input} />
                    </div>
                    <div className={styles.addform_div}>
                        <label>Select Status</label>
                        <select name="status" value={status} onChange={e => setStatus(e.target.value)} className={styles.dropdown}>
                            <option value="">Select</option>
                            <option value="Want to Read">Want to Read</option>
                            <option value="Reading">Reading</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className={styles.btns_container}>
                        <button className={`${styles.btns} ${styles.cancel_btn}`} onClick={handleCancel} type='button'>Cancel</button>
                        <button className={`${styles.btns} ${styles.addBook_btn}`} type='submit' disabled={loading}>{loading ? "Please Wait..." : bookId ? "Update Book" : "+ Add Book"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddOrEditBook