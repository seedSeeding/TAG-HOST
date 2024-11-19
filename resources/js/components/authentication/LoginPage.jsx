import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../Providers/ContextProvider";
import apiService from "../services/apiService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

export default function LoginPage() {
    const log_id = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { token, setToken, setRole, remember_me, set_remember_me } = useStateContext();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await apiService.post("login", {
                log_id: log_id.current.value,
                password: passwordRef.current.value,
                remember: rememberMe,
            });

            const data = response.data;
            if (response.status === 200) {
                console.log("Login Successful:", data);
                setToken(data.token);
                setRedirect(true);
                setRole(data.role);
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError(error.response.data.message || "Invalid credentials");
            } else if (error.response && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                setError(Object.values(validationErrors).join(" "));
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Error:", error);
        }
    };

    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
        if (e.target.checked) {
            set_remember_me(true);
        } else {
            set_remember_me(false);
        }
    };

    useEffect(() => {
        if (remember_me) {
            setRememberMe(true);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const emailBody = encodeURIComponent(
        `Hello,\n\nI would like to ask about your services and get more information on...\n\nBest regards,\nNewbie`
    );

    return (
        <>
            <section className="login-section section">
                <div className="login-form-container">
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="login-title">
                            <h1>Log In</h1>
                            <span>Welcome Back</span>
                        </div>
                        <div className="login-input-row">
                            <label htmlFor="login-id">LogID</label>
                            <input id="login-id" type="text" ref={log_id} placeholder="Enter your LogID" />
                        </div>
                        <div className="login-input-row">
                            <label htmlFor="login-password">Password</label>
                            <div className="password-container">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    ref={passwordRef}
                                    placeholder="Enter your Password"
                                />
                                <span
                                    className="eye-icon"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>
                        </div>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div>
                            {/* Uncomment if you want to include the "Remember me" functionality */}
                            {/* <div className="login-input-row switch-row">
                                <label className="switch">
                                    <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} />
                                    <span className="slider"></span>
                                </label>
                                <span className="remember-me">Remember me</span>
                            </div> */}
                        </div>
                        <button type="submit" className="">
                            LOG IN
                        </button>
                        <div className="contact-us">
                            Don’t have an account?
                            <span className="contact-link">
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=chantildelarosa@gmail.com&su=Message&body=${emailBody}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Contact Us
                                </a>
                            </span>
                        </div>
                    </form>
                </div>

                <div className="login-tag-image"></div>
            </section>
        </>
    );
}
