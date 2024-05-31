import React, { useState, createContext, useContext } from 'react';

export const AuthContext = createContext('');

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem('currentUser'))
    );

    const setCurrentLoggedInUser = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    };

    const removeLoggedInUser = () => {
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider
            value={{ currentUser, setCurrentLoggedInUser, removeLoggedInUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
