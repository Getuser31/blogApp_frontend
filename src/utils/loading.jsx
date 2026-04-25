import React from "react";
import reactLogoUrl from "../assets/react.svg";

const Loading = () => {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6 text-gray-900 font-sans">
            <div className="text-center flex flex-col items-center gap-4">
                <img src={reactLogoUrl} className="animate-spin h-16 w-16" alt="Loading..." />
                <p className="font-medium text-gray-600">Loading data from the API...</p>
            </div>
        </div>
    );
}

export default Loading;
