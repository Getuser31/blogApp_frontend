import React from 'react';
import {Outlet} from 'react-router-dom';
import Menu from "./components/menu.jsx";
import Footer from "./components/footer.jsx";

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Menu/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default RootLayout;
