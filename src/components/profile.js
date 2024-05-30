import React, { useContext, useEffect, useMemo, useState } from 'react';
import {useGetUserQuery} from '../services/users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleUser,
    faEdit,
    faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useGetUserFeedPostQuery } from '../services/posts';
import ReactPaginate from 'react-paginate';
import { SearchContext } from '../context/searchContext';
import EditProfile from './editProfile';

export default function Profile() {
    const { searchValue } = useContext(SearchContext);
    const [page, setPage] = useState(1);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [isShowFullDescription, setIsShowFullDescription] = useState(false);

    const { data } = useGetUserQuery({user_id: currentUser._id});
    const queryParams = useMemo(() => {
        return {
            page,
            perPage: 6,
            search: searchValue ?? '',
        };
    }, [page, searchValue]);
    const {
        data: postData,
    } = useGetUserFeedPostQuery(queryParams);
    const [user, setUser] = useState();
    const [posts, setPosts] = useState({ data: [], total: 0 });
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (data) {
            setUser(data?.data);
        }
        if (postData) {
            setPosts(postData?.data);
        }
    }, [data, postData]);

    const handlePageChange = (event) => {
        setPage(event.selected + 1);
    };

    const editProfileModal = () => {
        setModal(!modal);
    };

    return (
        <div className="d-flex flex-column justify-content-center profile-section">
            <div className="d-flex flex-column">
                <div className="d-flex flex-column justify-content-center my-2">
                    {user?.profilePhoto ? (
                        <div className="w-100 text-center p-2">
                            <img
                                src={user.profilePhoto}
                                alt="avatar"
                                className="profile-photo"
                            />
                        </div>
                    ) : (
                        <FontAwesomeIcon
                            icon={faUserAlt}
                            size="9x"
                            color="#C13584"
                        />
                    )}
                    <div className="fw-bold text-center">
                        <span className="p-1">
                            {user?.firstname + ' ' + user?.lastname}
                        </span>
                        <FontAwesomeIcon
                            icon={faEdit}
                            size="lg"
                            className="cursor-pointer"
                            onClick={editProfileModal}
                        />
                    </div>
                </div>
                {modal && (
                    <EditProfile toggleModal={editProfileModal} user={user} />
                )}
            </div>
            <div className="feed-main-container h-100">
                <div className="d-flex flex-column">
                    <h4 className="text-center">POSTS</h4>
                    <div className="feed-container">
                        {posts?.data?.map((post, index) => (
                            <form className="post-card p-4" key={index} style={{'maxHeight': isShowFullDescription ? 'max-content' : ''}}>
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-start">
                                        {user?.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto}
                                                alt="avatar"
                                                className="profile-photo"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faCircleUser}
                                                size="4x"
                                                color="#dee2e6"
                                            />
                                        )}
                                        <div className="d-flex flex-column p-2">
                                            <div className="fw-bold">
                                                {user?.firstname +
                                                    ' ' +
                                                    user?.lastname}
                                            </div>
                                            <p className="text-muted">
                                                {post.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column">
                                        {post.description && (
                                            <p className={isShowFullDescription ? 'mt-2 cursor-pointer' : 'mt-2 cursor-pointer post-description'} onClick={() => setIsShowFullDescription(true)}>
                                                {post.description}
                                            </p>
                                        )}
                                        <img
                                            src={post.filePath}
                                            alt="avatar"
                                            className="img-fluid post-photo mt-2"
                                        />
                                    </div>
                                </div>
                            </form>
                        ))}
                    </div>
                    {posts?.data?.length ? (
                        <ReactPaginate
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
                        />
                    ) : (
                        <div>No posts found!</div>
                    )}
                </div>
            </div>
        </div>
    );
}
