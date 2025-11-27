import React from "react";

const Error = (error) => {
    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-red-400 font-sans">
            <p>Error: {error.message}</p>
        </div>
    );
}

export default Error