import React from "react";
import {useNavigate} from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();

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
                    <li className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer">
                        Edit Article
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Admin;