import React, { useEffect, useMemo, useState } from 'react';
import { useGetUserQuery } from '../services/users';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Conversation({
    conversation,
    currentUser,
    isNewUsers,
}) {
    const [user, setUser] = useState(null);
    const queryParams = useMemo(() => {
        if (!isNewUsers) {
            return {
                user_id: conversation?.members?.find(
                    (m) => m !== currentUser?._id
                ),
            };
        }
        return '';
    }, [conversation?.members]);

    const { data, isLoading, error } = useGetUserQuery(queryParams);
    useEffect(() => {
        setUser(data?.data);
    }, [data]);

    return (
        <div className="conversation mt-0 p-1">
            <>
                {user?.profilePhoto || conversation?.profilePhoto ? (
                    <img
                        src={user?.profilePhoto || conversation?.profilePhoto}
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
                {isNewUsers ? (
                    <span className="p-1">
                        {conversation?.firstname + ' ' + conversation?.lastname}
                    </span>
                ) : (
                    <span className="p-1">
                        {user?.firstname + ' ' + user?.lastname}
                    </span>
                )}
            </>
        </div>
    );
}
