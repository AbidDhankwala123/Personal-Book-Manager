import { Link, useNavigate } from 'react-router-dom'
import styles from "./Login.module.css"
import { useContext, useEffect, useState } from "react";
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import BookContext from '../../context/BookContext';

const Login = () => {
    const { setLoading, loading, logoutMessage, setLogoutMessage } = useContext(BookContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    useEffect(() => {
        if (!logoutMessage) return;

        toast.success(logoutMessage, {
            position: "top-center",
            autoClose: 2000
        });

        setLogoutMessage("");
    }, [logoutMessage]);

    const validate = () => {
        let temp = {};

        if (!formData.email.trim()) {
            temp.email = "Email is required";
        }
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            temp.email = "Invalid email format";
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/;
        if (!formData.password.trim()) {
            temp.password = "Password is required";
        }
        else if (!passwordRegex.test(formData.password)) {
            temp.password = "Password must be 8+ chars, include uppercase, lowercase, digit & special char"
        }

        setErrors(temp);

        return Object.keys(temp).length > 0;
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (validate()) return;

        setLoading(true);

        axios.post("http://localhost:5000/login", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log(response);
                localStorage.setItem("jwtToken", response.data.jwtToken);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("showWelcome", "true");
                navigate("/dashboard");
                setFormData({ email: "", password: "" });
                setErrors({});
            })
            .catch(error => {
                console.error(error.response?.data?.message);
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
        <div className={styles.container}>
            <div className={styles.form_container} >
                <h1 className={styles.header}>Already have an account?</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.input_div}>
                        <label>Email</label>
                        <input type="text" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
                        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                    </div>
                    <div className={styles.input_div}>
                        <label>Password</label>
                        <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} />
                        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
                    </div>
                    <div className={styles.btn}>
                        <button type='submit' disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
                    </div>
                </form>
                <p>Don't have an account? <Link to="/">Sign Up</Link> </p>
            </div>
        </div>
    )
}

export default Login