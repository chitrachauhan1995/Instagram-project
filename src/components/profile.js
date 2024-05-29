import React, {useContext, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {useGetAllUsersQuery, useUpdateUserProfileMutation} from "../services/users";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser, faEdit, faTimesCircle, faUserAlt} from "@fortawesome/free-solid-svg-icons";
import {useGetUserFeedPostQuery} from "../services/posts";
import ReactPaginate from "react-paginate";
import {SearchContext} from "../context/searchContext";
import {userValidation} from '../utils/validation'

export default function Profile() {
    const {searchValue} = useContext(SearchContext);
    const [page, setPage] = useState(1);
    const {data, error, isLoading} = useGetAllUsersQuery();
    const queryParams = useMemo(() => {
        return {
            page,
            perPage: 6,
            search: searchValue ?? '',
        };
    }, [page, searchValue]);
    const {data: postData, isLoading: isPostLoading, error: isPostError} = useGetUserFeedPostQuery(queryParams);
    const [updateUserProfile] = useUpdateUserProfileMutation();
    const [user, setUser] = useState();
    const [formErrors, setFormErrors] = useState({});
    const [posts, setPosts] = useState({data: [], total: 0});
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (data) {
            const user = localStorage.getItem('currentUser');
            if (user) {
                const currentUser = JSON.parse(user);
                setUser(data?.data?.find((user) => user.email === currentUser.email));
            }
        }
        if (postData) {
            setPosts(postData?.data);
        }
    }, [data, postData])

    const handlePageChange = (event) => {
        setPage(event.selected + 1);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const errors = userValidation(user)
        setFormErrors(errors);
        if (!Object.keys(errors)?.length) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            const response = await updateUserProfile(user);
            if (response.data.status === 'success') {
                toast.success('Profile updated!')
            }
        }
    }

    const editProfileModal = () => {
        setModal(!modal);
    };

    return (
        <div className="d-flex flex-column justify-content-center profile-section">
            <div className="d-flex flex-column">
                <div className="d-flex flex-column justify-content-center my-2">
                    <FontAwesomeIcon icon={faUserAlt} size="9x" color="#C13584"/>
                    <div className="fw-bold text-center">
                        <span className="p-1">{user?.firstname + ' ' + user?.lastname}</span>
                        <FontAwesomeIcon icon={faEdit} size="lg" className="cursor-pointer" onClick={editProfileModal}/>
                    </div>
                </div>
                {modal && <div className="feed-container">
                    <div className="modal" role="dialog" aria-labelledby="exampleModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header  d-flex align-items-center justify-content-between">
                                    <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                                    <FontAwesomeIcon icon={faTimesCircle} onClick={() => editProfileModal()} size="2xl"
                                                     color="#dee2e6" className="cursor-pointer"/>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => updateProfile(e)}>
                                        <div>
                                            <div className="form-group mt-3">
                                                <label>First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    className="form-control mt-1"
                                                    placeholder="Enter First Name"
                                                    value={user?.firstname}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                <small className="text-danger">{formErrors?.firstname}</small>
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastname"
                                                    className="form-control mt-1"
                                                    placeholder="Enter Last Name"
                                                    value={user?.lastname}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>User Name</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="form-control mt-1"
                                                    placeholder="Enter Last Name"
                                                    value={user?.username}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>Email address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control mt-1"
                                                    placeholder="Enter email"
                                                    value={user?.email}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                <small className="text-danger">{formErrors?.email}</small>
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>Private</label>
                                                <div className="radio">
                                                    <label>
                                                        <input type="radio"
                                                               name="isPrivate"
                                                               value={true}
                                                               checked={user?.isPrivate === true || user?.isPrivate === "true"}
                                                               onChange={(e) => handleChange(e)}/>
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="radio">
                                                    <label>
                                                        <input type="radio" name="isPrivate" value={false}
                                                               checked={user?.isPrivate === false || user?.isPrivate === "false"}
                                                               onChange={(e) => handleChange(e)}/>
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                                        onClick={() => editProfileModal()}>Close
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Update Profile
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            <div className="feed-main-container h-100">
                <div className="d-flex flex-column">
                    <h4 className="text-center">POSTS</h4>
                    <div className="feed-container">
                        {posts?.data?.map((post, index) => (
                            <form className="post-card p-4" key={index}>
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-start">
                                        <FontAwesomeIcon icon={faCircleUser} size="4x" color="#dee2e6"/>
                                        <div className="d-flex flex-column p-2">
                                            <div className="fw-bold">{user?.firstname + ' ' + user?.lastname}</div>
                                            <p className="text-muted">{post.title}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column">
                                        {post.description &&
                                        <p className="mb-4">{post.description}</p>}
                                        <img src={post.filePath}
                                             alt="avatar"
                                             className="img-fluid img-size"/>
                                    </div>
                                </div>
                            </form>
                        ))}
                    </div>
                    {posts?.data?.length ? <ReactPaginate
                        pageCount={Math.ceil(posts?.total / 6)}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        activeClassName={'active'}
                    /> : <div>No posts found!</div>
                    }
                </div>
            </div>
        </div>
    );
}
