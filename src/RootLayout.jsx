import React from 'react';
import {Outlet} from 'react-router-dom';
import Menu from "./components/menu.jsx";
import Footer from "./components/footer.jsx";

const RootLayout = () => {
    return (
        <>
            <Menu/>
            <Outlet/>
            <Footer/>
        </>
    );
};

export default RootLayout;