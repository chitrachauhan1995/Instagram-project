import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import useToken from '../hooks/useToken';
import Navbar from './navbar';
import { SearchProvider } from '../context/searchContext';

const PrivateRoutes = () => {
    const { token } = useToken();
    return token ? (
        <>
            <SearchProvider>
                <Navbar />
                <div className="main-container">
                    <Outlet />
                </div>
            </SearchProvider>
        </>
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoutes;
