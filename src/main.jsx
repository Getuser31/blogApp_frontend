import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import App from './App.jsx'
import Login from "./components/user/login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

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
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
