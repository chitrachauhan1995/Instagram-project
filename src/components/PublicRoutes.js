import useToken from '../hooks/useToken';
import React from 'react';
import { Navigate } from 'react-router';

const PublicRoutes = ({ children }) => {
    const { token } = useToken();
    return token ? <Navigate to="/home" /> : children;
};
export default PublicRoutes;
