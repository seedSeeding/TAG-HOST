import { createContext, useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

const stateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    setRole: () => {},
    userRole: null,
    logout: () => {},
    load_user: () => {},
    storage: null,
    remember_me: null,
    set_remember_me: () => {},
    reload:false,
    setReload:() => {}
});

export const ContextProvider = ({ children }) => {
    
    const storage = import.meta.env.VITE_APP_BASE_URL;

    const [user, setUser] = useState(null);
    const [remember_me, _set_remember_me] = useState(localStorage.getItem("remember_me") === "true");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, _setToken] = useState(sessionStorage.getItem("token") || null);
    const [userRole, _setRole] = useState(sessionStorage.getItem("user-role") || null);
    const [reload,_setReload] = useState(false);

    const setLoad = () => {
        _setReload(prev=> !prev);
    };
    useEffect(() => {
        const storedToken = remember_me ? localStorage.getItem("token") : sessionStorage.getItem("token");
        const storedRole = remember_me ? localStorage.getItem("user-role") : sessionStorage.getItem("user-role");
        
        if (storedToken) {
            _setToken(storedToken);
            setIsAuthenticated(true);
        }
        
        if (storedRole) {
            _setRole(storedRole);
        }
    }, [remember_me]);

    const set_remember_me = (remember) => {
        _set_remember_me(remember);
        if (remember) {
            localStorage.setItem("remember_me", true);
        } else {
            localStorage.removeItem("remember_me");
            localStorage.removeItem("token"); 
        }
    };

    const setToken = (newToken) => {
        _setToken(newToken);
        if (newToken) {
            // if (remember_me) {
            //     localStorage.setItem("token", newToken);
            // } else {
                sessionStorage.setItem("token", newToken);
            // }
            // setIsAuthenticated(true);
        } else {
            sessionStorage.removeItem("token");
            // localStorage.removeItem("token");
            // setIsAuthenticated(false);
        }
    };

    const setRole = (role) => {
        _setRole(role);
        if (role) {
            sessionStorage.setItem("user-role", role);
            // if (remember_me) {
            //     localStorage.setItem("user-role", role);
            // }
        } else {
            sessionStorage.removeItem("user-role");
            localStorage.removeItem("user-role");
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user-role");
        localStorage.removeItem("token");
        localStorage.removeItem("user-role");
        
        setIsAuthenticated(false);
        return <Navigate to={"/login"}/>;
    };

    const load_user = () => {
        apiService
            .get("/user")
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => console.log(error));
    };

    return (
        <stateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                setRole,
                load_user,
                storage,
                logout,
                remember_me,
                reload,
                setLoad,
                set_remember_me,
            }}
        >
            {children}
        </stateContext.Provider>
    );
};

export const useStateContext = () => useContext(stateContext);
