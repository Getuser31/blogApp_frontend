import React from 'react';
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";
import {Outlet} from "react-router-dom";

const AdminLayout = () => {
    return (
        <AdminProtectedRoute>
            <Outlet />
        </AdminProtectedRoute>
    );
};

export default AdminLayout;