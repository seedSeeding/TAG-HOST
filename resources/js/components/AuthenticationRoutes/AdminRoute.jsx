import { Navigate } from "react-router-dom";

export default function AdminRoute(prop){
    const { children, user } = prop;
    //if(user.role != "admin"){
      //  return <Navigate to="/page not found"/>
   // }
    return children;
}