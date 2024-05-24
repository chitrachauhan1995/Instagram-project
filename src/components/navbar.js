import React, {useContext, useEffect, useMemo, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSignOut, faHome, faPeopleGroup, faUser, faSquarePlus, faSearch} from '@fortawesome/free-solid-svg-icons'
import Cookies from "js-cookie";
import {useNavigate} from "react-router";
import AddNewPost from "./addNewPost";
import {debounce} from "lodash";
import {SearchContext} from "./searchContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [modal, setModal] = useState(false);
    const {searchValue, setSearchValue} = useContext(SearchContext);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setUser(JSON.parse(user));
        }
        return () => {
            searchFeed.cancel();
        };
    }, [])

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem('currentUser')
        navigate("/");
    }

    const messenger = () => {
        navigate("/chat-list");
    }

    const profile = () => {
        navigate("/profile");
    }

    const home = () => {
        navigate("/home");
    }

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleSearch = (e) => {
        setSearchValue(e);
    };

    const searchFeed = useMemo(() => {
        return debounce(handleSearch, 500);
    }, [searchValue]);

    return (
        <header className="header mid d-flex justify-content-between align-items-center navbar">
            <h4 className="postgram">Postgram</h4>
            <div className="d-flex align-items-center justify-content-center">
                <div className="input-group m-1">
                    <div className="input-group-text"><FontAwesomeIcon icon={faSearch}/></div>
                    <input type="text" className="form-control" placeholder="Search Feed"
                           onChange={(e) => searchFeed(e.target.value)}/>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon onClick={home} icon={faHome} size="xl"/>
                </div>
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon onClick={toggleModal} icon={faSquarePlus} size="xl"/>
                </div>
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon onClick={messenger} icon={faPeopleGroup} size="xl"/>
                </div>
                <div className="m-3 cursor-pointer">
                    <FontAwesomeIcon onClick={profile} icon={faUser} size="xl"/>
                </div>
                <div className="my-3 mx-4 cursor-pointer">
                    {user && <span className="p-2">{user?.firstname + ' ' + user?.lastname}</span>}
                    <FontAwesomeIcon onClick={logout} icon={faSignOut} size="xl"/>
                </div>
            </div>
            {modal && (
                <AddNewPost toggleModal={toggleModal}/>
            )}
        </header>
    );
}
export default Navbar;
