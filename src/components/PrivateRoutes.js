import {Outlet, Navigate} from "react-router-dom";
import React from "react";
import useToken from "../useToken";
import Navbar from "./navbar";

const PrivateRoutes = () => {
    const {token} = useToken();
    return token ? <><Navbar/><Outlet/></> : <Navigate to="/"/>;
};

export default PrivateRoutes;
