import React from "react";
import Articles from "./components/articles/articles.jsx";

const App = () => {
    return (
        <div className="bg-[#A17141] min-h-screen">
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Articles />
            </main>
        </div>
    );
};

export default App;