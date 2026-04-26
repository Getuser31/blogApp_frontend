import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from "../../graphql/mutations";
import {useAuth} from "../../AuthContext.jsx";
import {useTranslation} from "react-i18next";

const Login = () => {
    const {t} = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login: authLogin} = useAuth()

    const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            authLogin(data.login);
            navigate('/');
        },
        onError: (error) => {
            console.error("Login mutation failed:", error);
        }
    });

    const handleLogin = async (event) => {
        event.preventDefault();
        login({ variables: { email, password } });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">{t('login.title')}</h1>
                    <p className="text-gray-500 text-center mt-2 font-medium">{t('login.subtitle')}</p>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                                    {t('login.email')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 transition-colors"
                                    placeholder={t('login.emailPlaceholder')}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                    {t('login.password')}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 transition-colors"
                                    placeholder={t('login.passwordPlaceholder')}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
                                {error.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 text-white font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? t('login.loggingIn') : t('login.logIn')}
                        </button>
                    </form>
                </div>
                <p className="text-gray-500 text-center text-xs mt-6 font-medium">
                    {t('login.protectedArea')}
                </p>
            </div>
        </div>
    );
};

export default Login;
