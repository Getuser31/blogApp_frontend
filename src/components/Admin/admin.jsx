import React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../AuthContext.jsx";

const Admin = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log(user)

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-indigo-400 mb-8">Admin Panel</h1>
                <ul className="space-y-4">
                    <li className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
                        onClick={() => navigate("/admin/addArticle")}
                    >
                        Add Article
                    </li>
                    <li className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
                        onClick={() => navigate("/articles")}
                    >
                        Edit Article
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Admin;