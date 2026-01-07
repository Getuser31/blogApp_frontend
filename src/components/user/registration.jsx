import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@apollo/client/react";
import {ADD_USER} from "../../graphql/mutations.js";

const Registration = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate()
    
    const [addUser, {loading, error: apiError}] = useMutation(ADD_USER, {
        onCompleted: () => {
            navigate('/login')
        }, 
        onError: (error) => {
            setValidationError(error.message)
        }
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidationError('');

        if(user.username === '' || user.email === '' || user.password === '' || user.repeatPassword === ''){
            setValidationError("All fields are required");
            return;
        }

        if (user.password !== user.repeatPassword) {
            setValidationError("Passwords do not match");
            return;
        }
        
        try {
            await addUser({ 
                variables: { 
                    username: user.username, 
                    email: user.email, 
                    password: user.password, 
                    passwordRepeat: user.repeatPassword 
                } 
            })
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className="bg-[#A17141] min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Registration Page</h1>
                
                {validationError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {validationError}
                    </div>
                )}
                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {apiError.message}
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#A17141] focus:border-[#A17141] sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#A17141] focus:border-[#A17141] sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#A17141] focus:border-[#A17141] sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700">Repeat password:</label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            value={user.repeatPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#A17141] focus:border-[#A17141] sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B5E34] hover:bg-[#6F4B2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A17141] disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Registration;