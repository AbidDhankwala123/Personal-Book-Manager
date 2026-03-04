import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import axios from "axios"

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = e => {
        e.preventDefault();

        axios.post("http://localhost:5000/register", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                navigate("/dashboard");
                console.log(response);

            })
            .catch(error => console.error(error.response.data))

    }
    return (
        <div className={styles.container}>
            <div className={styles.form_container} >
                <h1 className={styles.header}>Create an account</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.input_div}>
                        <label>Name</label>
                        <input type="text" name="name" placeholder='Name' value={formData.name} onChange={handleChange} />
                    </div>
                    <div className={styles.input_div}>
                        <label>Email</label>
                        <input type="text" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
                    </div>
                    <div className={styles.input_div}>
                        <label>Password</label>
                        <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} />
                    </div>
                    <div className={styles.input_div}>
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder='Confirm Password' value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                    <div className={styles.btn}>
                        <button type='submit'>Create Account</button>
                    </div>
                </form>
                <p>Already have an account? <Link to="/login">Sign In</Link> </p>
            </div>
        </div>
    )
}

export default Register