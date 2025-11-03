import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from "../../graphql/mutations";
import {useAuth} from "../../AuthContext.jsx";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login: authLogin} = useAuth()

    // The useMutation hook returns a function to trigger the mutation and an object with loading/error states.
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            // Pass the entire login payload to the auth context
            // authLogin handles setting the token in localStorage
            authLogin(data.login);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-900/70 backdrop-blur rounded-2xl shadow-2xl border border-gray-800 p-8">
                    <h1 className="text-3xl font-extrabold text-white text-center">Welcome back</h1>
                    <p className="text-gray-400 text-center mt-2">Log in to access your account</p>

                    {/* Use the form's onSubmit event */}
                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-300">
                                {error.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-white font-semibold transition-colors"
                        >
                            {loading ? 'Logging in…' : 'Log In'}
                        </button>
                    </form>
                </div>
                <p className="text-gray-500 text-center text-xs mt-6">
                    Protected area • Please authenticate to continue
                </p>
            </div>
        </div>
    );
};

export default Login;