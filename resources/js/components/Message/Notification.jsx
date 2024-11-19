import { useState, useEffect } from 'react';

export default function Notification({ message, type ,setMessage }) {
    const [isVisible, setIsVisible] = useState(true);

    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);

        }, 3000);

        return () => clearTimeout(timer);
    }, [message, type]);

    
    if (!isVisible) {
        setMessage('');
        return null;
    }

    return (
        <div 
            className={`notification-message ${type === 1 ? "error" : "success" }`} 
            >
            <span>{message}</span>
        </div>
    );
}
