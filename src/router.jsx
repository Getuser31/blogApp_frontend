import { createBrowserRouter, Navigate} from "react-router-dom";
import App from "./App";
import Login from "./components/user/login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const router = createBrowserRouter([
    {path: '/', element: <Navigate to="/articles" replace />},
    { path: "/login", element: <Login /> },

    {
        path: '/articles',
        element: (
            <ProtectedRoute>
                <App/>
            </ProtectedRoute>
        ),
    }
    ]
)

export default router