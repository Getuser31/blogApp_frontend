/**
 * A centralized API client that wraps the native fetch function.
 * It automatically adds the Authorization header with the bearer token
 * for requests to protected endpoints.
 */

const getAuthToken = () => {
    return localStorage.getItem('userToken');
};

export const apiClient = async (endpoint, options = {}) => {
    const token = getAuthToken();

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    // Add the Authorization header if a token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    // For DELETE requests or other methods that might not return a body
    if (response.status === 204) {
        return null;
    }

    return response.json();
};