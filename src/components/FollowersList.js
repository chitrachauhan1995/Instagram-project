import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import {
    useFollowUserMutation,
    useGetAllUsersQuery,
    useGetFriendsQuery,
    useUnfollowUserMutation,
} from '../services/users';

export default function FollowersList() {
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [addFollowUser] = useFollowUserMutation();
    const [removeFollowUser] = useUnfollowUserMutation();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const { data: friendsData, isLoading } = useGetFriendsQuery(
        currentUser?._id,
        {
            skip: !currentUser?._id,
        }
    );

    const { data: allUsersData, isLoading: isAllUsersLoading } =
        useGetAllUsersQuery();

    useEffect(() => {
        if (friendsData && allUsersData && currentUser) {
            const filterUsers = allUsersData?.data
                ?.filter((u) => u._id !== currentUser._id)
                ?.map((user) => {
                    const obj = { ...user };
                    if (friendsData?.find((f) => f._id === user._id)) {
                        obj.followUser = false;
                    } else {
                        obj.followUser = true;
                    }
                    return obj;
                });
            setAllUsers(filterUsers);
        }
    }, [currentUser, allUsersData, friendsData]);

    if (isLoading || isAllUsersLoading || !currentUser) {
        return (
            <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">
                Loading...
            </div>
        );
    }

    const followUser = async (user) => {
        if (!currentUser._id) return;
        const response = await addFollowUser({
            userId: user._id,
            id: currentUser._id,
        });
        if (response?.data?.status === 'success') {
            toast.success(response?.data?.message);
        }
        if (response?.error?.data?.status === 'error') {
            toast.error(response?.error?.data?.message);
        }
    };

    const unFollowUser = async (user) => {
        if (!currentUser._id) return;
        const response = await removeFollowUser({
            userId: user._id,
            id: currentUser._id,
        });
        if (response?.data?.status === 'success') {
            toast.success(response?.data?.message);
        }
        if (response?.error?.data?.status === 'error') {
            toast.error(response?.error?.data?.message);
        }
    };

    return (
        <div className="d-flex flex-column">
            <div className="mb-4">
                <h4>Suggestions For You</h4>
                {allUsers
                    ?.filter((u) => u.followUser)
                    ?.map((user, index) => (
                        <div className="d-flex flex-column mb-1" key={index}>
                            <div className="d-flex align-items-center">
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
                                <span className="p-2">
                                    {user?.firstname + ' ' + user?.lastname}
                                </span>
                                {user.followUser && (
                                    <button
                                        className="btn action-button"
                                        onClick={() => followUser(user)}
                                    >
                                        Follow
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
            <div>
                <h4>Following</h4>
                {allUsers
                    ?.filter((u) => !u.followUser)
                    ?.map((user, index) => (
                        <div className="d-flex flex-column mb-1" key={index}>
                            <div className="d-flex align-items-center">
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
                                <span className="p-2">
                                    {user?.firstname + ' ' + user?.lastname}
                                </span>
                                {!user.followUser && (
                                    <button
                                        className="btn action-button"
                                        onClick={() => unFollowUser(user)}
                                    >
                                        UnFollow
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
