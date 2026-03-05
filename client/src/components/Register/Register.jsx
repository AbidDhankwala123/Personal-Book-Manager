import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const Register = ({ setLoading, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        let temp = {};

        if (!formData.name.trim()) {
            temp.name = "Name is required";
        }
        else if (formData.name.length < 3) {
            temp.name = "Name must be at least 3 characters";
        }

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

        if (!formData.confirmPassword.trim()) {
            temp.confirmPassword = "Confirm Password is required";
        }
        else if (formData.confirmPassword !== formData.password) {
            temp.confirmPassword = "Password and Confirm Password do not match";
        }

        setErrors(temp);

        return Object.keys(temp).length > 0;
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (validate()) return;

        setLoading(true);
        axios.post("http://localhost:5000/register", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log(response);
                navigate("/dashboard");
                localStorage.setItem("jwtToken", response.data.jwtToken);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("showWelcome", "true");
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                setErrors({});
            })
            .catch(error => {
                console.error(error.response.data.message);
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
        <div className={styles.container}>
            <div className={styles.form_container} >
                <h1 className={styles.header}>Create an account</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.input_div}>
                        <label>Name</label>
                        <input type="text" name="name" placeholder='Name' value={formData.name} onChange={handleChange} />
                        {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
                    </div>
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
                    <div className={styles.input_div}>
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder='Confirm Password' value={formData.confirmPassword} onChange={handleChange} />
                        {errors.confirmPassword && <small style={{ color: "red" }}>{errors.confirmPassword}</small>}
                    </div>
                    <div className={styles.btn}>
                        <button type='submit' disabled={loading}>{loading ? "Registering..." : "Sign Up"}</button>
                    </div>
                </form>
                <p>Already have an account? <Link to="/login">Sign In</Link> </p>
            </div>
        </div>
    )
}

export default Register