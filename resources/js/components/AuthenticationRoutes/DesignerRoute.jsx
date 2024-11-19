import { Navigate } from "react-router-dom";

export default function DesignerRoute(prop){
    const { children, user } = prop;
  //  if(user.role != "designer"){
      //  return <Navigate to="/page not found"/>
  //  }
    return children;
}