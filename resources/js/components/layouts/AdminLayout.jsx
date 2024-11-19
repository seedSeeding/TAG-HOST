import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import apiService from "../services/apiService";
import { useStateContext } from "../Providers/ContextProvider";
import LogoutModal from "../Notifications/LogoutModal";

export default function AdminLayout() {
    const [logout,setLogout] = useState(false); 
    const {setUser} = useStateContext();
    useEffect(() => {
        apiService.get("/user")
        .then((response) => setUser(response.data))
        .catch(error => console.log(error));
    },[]);
    return(
        <>
            <section className="admin-section section">   
                <div className="admin-left">
                        <div className="admin-title">
                            <img src="/Images/admin-logo.png" alt="admin_logo" /> 
                            Admin


                        </div>
                        <nav className="admin-nav-con">
                            <Link className="admin-nav" to='/admin/create'>Create An Account</Link>
                            <Link  className="admin-nav" to='/admin/accounts'>View Account List</Link>
                            <Link className="admin-nav"  onClick={() => setLogout(true)}>Log Out</Link>  
                            {logout && (<LogoutModal setLogout={setLogout}/>)}            
                        </nav>
                        <div className="admin-tag-logo">
                            <img src="/Images/tag-logo1.png" alt="" />
                        </div>
                </div>
                <main className="admin-page">
                    <Outlet/>     
                </main>
            </section>
        </>
    );
}