import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ApolloProvider} from "@apollo/client/react";
import App from './App.jsx'
import Login from "./components/user/login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import client from "./api/apolloClient.js";

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <App/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: <Login/>
    }
])

createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
        <RouterProvider router={router}/>
    </ApolloProvider>
)
