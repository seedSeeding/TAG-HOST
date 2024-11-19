import React, { useEffect, useState } from 'react';

const NotifCard = ({ type, message ,setMessage }) => {
    const [visible, setVisible] = useState(true);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setVisible(false);
    //         setMessage('')
    //     }, 3000); 
    //     return () => clearTimeout(timer); 
    // }, []);
    const handleCloseNotif = () => {
        setVisible(false);
        setMessage('')
    };
    if (!visible) return null;

    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 space-y-2 p-4">
            {type === "s" && (
                <div onClick={handleCloseNotif} role="alert"  className="bg-green-400 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-2 rounded-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transform hover:scale-105">
                    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                    <p className="text-lg font-semibold" >Success - {message}!</p>
                </div>
            )}

            {type === "i" && (
                <div onClick={handleCloseNotif} role="alert" className="bg-[#6c757d] bg-[#6c757d] border-l-4 border-[#6c757d] dark:border-blue-700 text-white dark:text-blue-100 p-2 rounded-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-blue-200 dark:hover:bg-blue-800 transform hover:scale-105">
                    <svg stroke="currentColor" viewBox="0 0 24 24" fill="white" className="h-5 w-5 flex-shrink-0 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                    <p className="text-lg font-semibold">Info - {message}.</p>
                </div>
            )}

            {type === "w" && (
                <div onClick={handleCloseNotif} role="alert" className="bg-yellow-500 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-2 rounded-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform hover:scale-105">
                    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                    <p className="text-lg font-semibold">Warning - {message}.</p>
                </div>
            )}

            {type === "e" && (
                <div onClick={handleCloseNotif} role="alert" className="bg-red-500 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 p-2 rounded-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-red-200 dark:hover:bg-red-800 transform hover:scale-105">
                    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                    <p className="text-lg font-semibold">Error - {message}.</p>
                </div>
            )}
        </div>
    );
};

export default NotifCard;
