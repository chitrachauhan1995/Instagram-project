import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="d-flex flex-column justify-content-center page-not-found">
            <h4>404 - Page Not Found!</h4>
            <Link to="/home">Go Home</Link>
        </div>
    );
};
export default PageNotFound;
