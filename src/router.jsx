import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./components/user/login.jsx";
import Admin from "./components/Admin/admin.jsx";
import AddArticle from "./components/Admin/Articles/addArticle.jsx";
import Article from "./components/articles/article.jsx";
import AdminLayout from "./AdminLayout.jsx";
import RootLayout from "./RootLayout.jsx";
import EditArticle from "./components/articles/editArticle.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Navigate to="/articles" replace /> },
            { path: "edit/:id", element: <EditArticle/>},
            { path: "/login", element: <Login /> },
            {
                path: "admin",
                element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
                children: [
                    { index: true, element: <Admin /> },
                    { path: "addArticle", element: <AddArticle /> },
                ],
            },
            { path: '/article/:id', element: <Article /> },
            {
                path: '/articles',
                element: (
                    <App />
                ),
            }
        ]
    }
]);

export default router;