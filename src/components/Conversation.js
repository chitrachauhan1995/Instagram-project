import React, { useEffect, useMemo, useState } from 'react';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetUserQuery } from '../services/users';

export default function Conversation({
    conversation,
    currentUser,
    isNewUsers,
}) {
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
    const { data } = useGetUserQuery(queryParams);

    const [user, setUser] = useState(null);

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
