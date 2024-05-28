import {Outlet, Navigate, Routes} from "react-router-dom";
import React from "react";
import useToken from "../useToken";
import Navbar from "./navbar";
import {SearchProvider} from "./searchContext";

const PrivateRoutes = () => {
    const {token} = useToken();
    return token ? <><SearchProvider><Navbar/><div className="main-container"><Outlet/></div></SearchProvider></> : <Navigate to="/"/>;
};

export default PrivateRoutes;
