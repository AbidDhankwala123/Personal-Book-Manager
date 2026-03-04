import { Link, useNavigate } from 'react-router-dom'
import styles from "./Login.module.css"
import { useState } from "react";
import axios from "axios"

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = e => {
        e.preventDefault();

        axios.post("http://localhost:5000/login", formData, {
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
                <h1 className={styles.header}>Already have an account?</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.input_div}>
                        <label>Email</label>
                        <input type="text" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
                    </div>
                    <div className={styles.input_div}>
                        <label>Password</label>
                        <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} />
                    </div>
                    <div className={styles.btn}>
                        <button type='submit'>Sign In</button>
                    </div>
                </form>
                <p>Don;t have an account? <Link to="/register">Sign Up</Link> </p>
            </div>
        </div>
    )
}

export default Login