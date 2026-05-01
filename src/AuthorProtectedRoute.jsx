import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const AuthorProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user || (user.role !== 'Author' && user.role !== 'Admin')) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AuthorProtectedRoute;