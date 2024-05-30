import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import NavBar from './NavBar';
import { SearchProvider } from '../contexts/SearchContext';

export default function PrivateRoutes() {
    const { token } = useToken();
    return token ? (
        <>
            <SearchProvider>
                <NavBar />
                <div className="main-container">
                    <Outlet />
                </div>
            </SearchProvider>
        </>
    ) : (
        <Navigate to="/" />
    );
};
