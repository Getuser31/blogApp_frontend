import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {ApolloProvider} from "@apollo/client/react";
import client from "./api/apolloClient.js";
import router from "./router.jsx";
import './index.css'
import {AuthProvider} from "./AuthContext.jsx";
import './i18n/i18n.js';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </ApolloProvider>
    </StrictMode>
)
