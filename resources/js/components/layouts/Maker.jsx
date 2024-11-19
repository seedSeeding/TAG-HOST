import { Outlet } from "react-router-dom";
import { useStateContext } from "../Providers/ContextProvider";
import apiService from "../services/apiService";
import { useEffect } from "react";
export default function Maker(){

    const {setUser} = useStateContext();
    useEffect(() => {
        apiService.get("/user")
        .then((response) => setUser(response.data))
        .catch(error => console.log(error));
    }),[];
    return (
        <>
            <Outlet/>
        </>
    );
}