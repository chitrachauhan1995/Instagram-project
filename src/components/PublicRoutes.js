import React from 'react';
import { Navigate } from 'react-router';
import useToken from '../hooks/useToken';

export default function PublicRoutes({ children }) {
    const { token } = useToken();
    return token ? <Navigate to="/home" /> : children;
};
