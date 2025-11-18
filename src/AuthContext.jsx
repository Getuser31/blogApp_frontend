import React, { createContext, useState, useContext, useEffect } from "react";
import {useApolloClient} from "@apollo/client/react";
import { ME_QUERY } from "./graphql/queries.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state
    const client = useApolloClient();

    // On initial load, check for a token and verify it with the backend
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            setLoading(false);
            return;
        }

        // Use the ME_QUERY to get the user's role
        client.query({ query: ME_QUERY })
            .then(({ data }) => {
                if (data && data.me) {
                    // Set the full user object on successful session validation
                    setUser({
                        token,
                        ...data.me, // Spread the user data (id, name)
                        role: data.me.role.name // Flatten the role name
                    });
                }
            })
            .catch(error => {
                // This can happen if the token is expired or invalid
                console.error("Session validation failed:", error.message);
                logout(); // Clean up the invalid session
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // The login function now accepts the full user object from the mutation
    const login = (loginPayload) => {
        if (loginPayload?.token && loginPayload?.user) {
            const { token, user: userData } = loginPayload;
            localStorage.setItem('userToken', token);
            setUser({
                token,
                ...userData, // Spread the user data (id, name)
                role: userData.role.name // Flatten the role name
            });
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
        // Clear Apollo Client cache to remove any protected data
        client.resetStore();
    };

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);