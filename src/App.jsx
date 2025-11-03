import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Articles from "./components/articles/articles.jsx";
import { useAuth } from "./AuthContext.jsx";

const App = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <nav className="bg-gray-800 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold hover:text-indigo-400">My Blog</Link>
                    <div>
                        {/* Here is the conditional check! */}
                        {user && user.role === 'Admin' && (
                            <Link to="/admin" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md mr-4 font-semibold">
                                Admin Panel
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <Articles />
        </div>
    );

}

export default App