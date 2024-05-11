import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSignOut} from '@fortawesome/free-solid-svg-icons'
import Cookies from "js-cookie";
import {useNavigate} from "react-router";
import Profile from './profile'
import ChatList from "./chatList";
import Home from "./home";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, [])

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem('currentUser')
        navigate("/");
    }

    return (
        <header className="header mid d-flex justify-content-between align-items-center navbar mb-1">
            <h4>Postgram</h4>
            <div className="d-flex justify-content-between align-items-center">
                <ul className="mb-0">
                    <li>
                        <Link to="/chat-list" component={ChatList}>Chat List</Link>
                    </li>
                    <li>
                        <Link to="/profile" component={Profile}>User Profile</Link>
                    </li>
                    <li>
                        <Link to="/home" component={Home}>Home</Link>
                    </li>
                </ul>
                {user && <span>{user?.firstname + ' ' + user?.lastname}</span>}
                <div onClick={logout} className="m-2 cursor-pointer">
                    <FontAwesomeIcon icon={faSignOut}/>
                </div>
            </div>
        </header>
    );
}
export default Navbar;
