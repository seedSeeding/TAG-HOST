import { Navigate } from "react-router-dom";

export default function MakerRoute(prop){
    const { children, user } = prop;
   // if(user.role != "maker"){
      //  return <Navigate to="/page not found"/>
   // }
    return children;
}