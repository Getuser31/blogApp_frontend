import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "./App";
import Login from "./components/user/login.jsx";
import Admin from "./components/Admin/admin.jsx";
import AddArticle from "./components/Admin/Articles/addArticle.jsx";
import Article from "./components/articles/article.jsx";
import AdminLayout from "./AdminLayout.jsx";
import RootLayout from "./RootLayout.jsx";
import EditArticle from "./components/articles/editArticle.jsx";
import Registration from "./components/user/registration.jsx";
import UserProfile from "./components/user/userProfile.jsx";
import PublishedArticles from "./components/articles/userArticles.jsx";
import Categories from "./components/Admin/categories.jsx";
import FavoriteArticles from "./components/user/favoriteArticles.jsx";
import UsersList from "./components/Admin/Users/usersList.jsx";
import AdminUserProfile from "./components/Admin/Users/adminUserProfile.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {index: true, element: <Navigate to="/articles" replace/>},
            {path: "edit/:id", element: <EditArticle/>},
            {path: "/login", element: <Login/>},
            {path: '/registration', element: <Registration/>},
            {path: '/userProfile', element: <UserProfile/>},
            {path: '/userArticles', element: <PublishedArticles/>},
            {path: '/favoriteArticle', element: <FavoriteArticles/>},
            {path: "addArticle", element: <AddArticle/>},
            {
                path: "admin",
                element: <AdminLayout/>,
                children: [
                    {index: true, element: <Admin/>},
                    {path: "categories", element: <Categories/>},
                    {path: "listOfUsers", element: <UsersList/>},
                    {path: "user/:id", element: <AdminUserProfile/>},
                ],
            },
            {path: '/article/:id', element: <Article/>},
            {
                path: '/articles',
                element: (
                    <App/>
                ),
            }
        ]
    }
]);

export default router;