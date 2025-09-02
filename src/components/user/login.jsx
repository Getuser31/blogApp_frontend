import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        setError(null); // Reset error on a new attempt

        const url = `${import.meta.env.VITE_API_BASE_URL}/login`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                // Pass the credentials in the request body
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API errors (e.g., wrong password)
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            // IMPORTANT: Only set token and navigate *after* a successful login
            localStorage.setItem('userToken', data.token);
            navigate('/');

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <p>You need to log in to access the application.</p>
            {/* Use the form's onSubmit event */}
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Log In</button>
            </form>
            {/* Display an error message to the user if login fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;