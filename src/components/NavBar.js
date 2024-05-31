import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSignOut,
    faHome,
    faPeopleGroup,
    faUser,
    faSquarePlus,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router';
import { debounce } from 'lodash';
import AddPost from './AddPost';
import { SearchContext } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
    const { currentUser, removeLoggedInUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [modal, setModal] = useState(false);
    const { searchValue, setSearchValue } = useContext(SearchContext);

    const handleSearch = (e) => {
        setSearchValue(e);
    };

    const searchFeed = useMemo(() => {
        return debounce(handleSearch, 1000);
    }, [searchValue]);

    useEffect(() => {
        return () => {
            searchFeed.cancel();
        };
    }, [searchFeed]);

    const logout = () => {
        Cookies.remove('token');
        removeLoggedInUser();
        navigate('/');
    };

    const messenger = () => {
        navigate('/chats');
    };

    const profile = () => {
        navigate('/profile');
    };

    const home = () => {
        navigate('/home');
    };

    const toggleModal = () => {
        setModal(!modal);
    };

    return (
        <header className="header d-flex justify-content-between align-items-center navbar">
            <h4 className="postgram-title">Postgram</h4>
            {(location.pathname === '/home' ||
                location.pathname === '/profile') && (
                <div className="d-flex align-items-center justify-content-center search-feed">
                    <div className="input-group m-1">
                        <div className="input-group-text">
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Feed"
                            onChange={(e) => searchFeed(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center">
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon
                        onClick={home}
                        icon={faHome}
                        size="xl"
                        className="cursor-pointer"
                        color={location.pathname === '/home' ? '#C13584' : ''}
                    />
                </div>
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon
                        onClick={toggleModal}
                        icon={faSquarePlus}
                        size="xl"
                        className="cursor-pointer"
                    />
                </div>
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon
                        onClick={messenger}
                        icon={faPeopleGroup}
                        size="xl"
                        className="cursor-pointer"
                        color={location.pathname === '/chats' ? '#C13584' : ''}
                    />
                </div>
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon
                        onClick={profile}
                        icon={faUser}
                        size="xl"
                        className="cursor-pointer"
                        color={
                            location.pathname === '/profile' ? '#C13584' : ''
                        }
                    />
                </div>
                <div className="my-3 mx-4 cursor-pointer">
                    {currentUser && (
                        <span className="p-1">
                            {currentUser.firstname + ' ' + currentUser.lastname}
                        </span>
                    )}
                    <FontAwesomeIcon
                        onClick={logout}
                        icon={faSignOut}
                        size="xl"
                        className="cursor-pointer"
                    />
                </div>
            </div>
            {modal && <AddPost toggleModal={toggleModal} />}
        </header>
    );
};
