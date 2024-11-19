import React from 'react';
import './logout.css';
import { useStateContext } from '../Providers/ContextProvider';
import { Navigate } from 'react-router-dom';

const LogoutModal = (props) => {
    const {setLogout} = props; 
    const {logout} = useStateContext();
    const handleLogout = () => {
        setLogout(false)
        logout();
        window.location.reload();
    };
    
    return (

        <div className="warning-general">
            <div className="confirm-div">
                <img src="../Images/tag-logo1.png" alt="" />
                <p>
                    {/* <strong>You are about to log out.</strong> */}
                    <strong>Are you sure want leave ?</strong>
                </p>
                <div className="modals-container">
                    <button className="red-btn" onClick={() => setLogout(false)}>Cancel</button>
                    <button className="green-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};
export default LogoutModal;
