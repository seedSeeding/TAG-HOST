import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarChart, faHouseChimney, faQuestionCircle, faTriangleCircleSquare, faWrench } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";
import { useStateContext } from "../Providers/ContextProvider";
import apiService from "../services/apiService";
import { useEffect, useState } from "react";
import LogoutModal from "../Notifications/LogoutModal";

export default function DesignerLayout() {
    const { setUser } = useStateContext();
    const [logout, setLogout] = useState(false);
    const location = useLocation(); // Get the current route

    useEffect(() => {
        apiService.get("/user")
            .then((response) => setUser(response.data))
            .catch(error => console.log(error));
    }, []);

    const user = { name: "" };
    const emailBody = encodeURIComponent(
        `Hello,\n\nI would like to ask about your services and get more information on...\n\nBest regards,\n${user.name}`
    );

    const isActive = (path) => location.pathname === path; // Check if the route is active

    return (
        <section className="section designer-section">
            <div className="designer-left">
                <div className="designer-title">
                    <img src="/Images/logo.png" alt="tag-logo" />
                    <div>
                        <span>TAG Global Management</span>
                        <span>Corporation</span>
                    </div>
                </div>
                <nav className="designer-nav-con">
                    <Link
                        className={`designer-nav ${isActive('/designer/requests') ? 'active-nav' : ''}`}
                        to={'/designer/requests'}
                    >
                        <FontAwesomeIcon icon={faHouseChimney} className="designer-nav-icon" />
                        Pattern Approval
                    </Link>
                    <Link
                        className={`designer-nav ${isActive('/designer/records-data') ? 'active-nav' : ''}`}
                        to={'/designer/records-data'}
                    >
                        <FontAwesomeIcon icon={faTriangleCircleSquare} className="designer-nav-icon" />
                        Pattern Records
                    </Link>
                    <Link
                        className={`designer-nav ${isActive('/designer/dashboard') ? 'active-nav' : ''}`}
                        to={"/designer/dashboard"}
                    >
                        <FontAwesomeIcon icon={faBarChart} className="designer-nav-icon" />
                        Dashboard
                    </Link>
                    <Link
                        className={`designer-nav ${isActive('/designer/reports') ? 'active-nav' : ''}`}
                        to={'/designer/reports'}
                    >
                        <FontAwesomeIcon icon={faWrench} className="designer-nav-icon" />
                        Reports
                    </Link>
                    <Link
                        className="designer-nav"
                        onClick={() => setLogout(true)}
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="designer-nav-icon" />
                        Log out
                    </Link>
                </nav>
                <div className="designer-help-box">
                    <div>
                        <FontAwesomeIcon icon={faQuestionCircle} className="designer-help-logo" />
                    </div>
                    <div className="designer-help-text">
                        <span>Need help?</span>
                        <span>Contact Us</span>
                    </div>
                    <button className="designer-contact-btn">
                        <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=chantiledelarosa@gmail.com&subject=Message&body=${emailBody}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </a>
                    </button>
                </div>
            </div>
            <main className="disgner-page">
                <Outlet />
            </main>
            {logout && <LogoutModal setLogout={setLogout} />}
        </section>
    );
}
