import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // You can return a loading spinner here if you want
        return null;
    }

    // After loading, check if the user is authenticated and is an admin.
    // The role comes from the 'ME_QUERY' in your AuthContext.
    // I've updated this from `user.isAdmin` to `user.role === 'Admin'`.
    if (!user || user.role !== 'Admin') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AdminProtectedRoute;