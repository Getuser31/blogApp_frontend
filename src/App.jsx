import React from "react";
import { useNavigate } from "react-router-dom";
import {  useApolloClient } from "@apollo/client/react";
import Articles from "./components/articles/articles.jsx";

const App = () => {
    const client = useApolloClient();
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem("userToken");
        await client.clearStore();
        navigate("/login");
    };

    return (
        <Articles handleLogout={handleLogout} />
    );

}

export default App