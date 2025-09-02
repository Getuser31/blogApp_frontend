import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from "../../graphql/mutations";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // The useMutation hook returns a function to trigger the mutation and an object with loading/error states.
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
        // This function runs automatically on a successful mutation.
        onCompleted: (data) => {
            localStorage.setItem('userToken', data.login.token);
            navigate('/');
        },
        // This helps in debugging and can be used to show user-friendly errors.
        onError: (error) => {
            console.error("Login mutation failed:", error);
        }
    });

    const handleLogin = async (event) => {
        event.preventDefault();
        // Call the mutation function with the required variables.
        login({ variables: { email, password } });
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
                <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
            </form>
            {/* Display an error message to the user if login fails */}
            {error && <p style={{ color: 'red' }}>{error.message}</p>}
        </div>
    );
};

export default Login;