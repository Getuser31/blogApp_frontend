import React from "react";

const Loading = () => {
    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-white font-sans">
            <div className="text-center">
                <p>Loading data from the API...</p>
            </div>
        </div>
    );
}

export default Loading;