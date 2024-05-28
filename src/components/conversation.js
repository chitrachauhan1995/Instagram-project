import React, {useEffect, useState} from "react";
import {useGetUserQuery} from "../services/users";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Conversation({conversation, currentUser, conversations}) {
    const [user, setUser] = useState(null);
    const {data, error, isLoading} = useGetUserQuery({user_id: conversations?.length ? conversation?.members?.find((m) => m !== currentUser?._id) : conversation._id});

    useEffect(() => {
        if (data) {
            setUser(data?.data);
        }
    }, [data]);

    return (
        <div className="conversation mt-0 p-1">
            {user && <>
                <FontAwesomeIcon icon={faCircleUser} size="4x" color="#dee2e6"/>
                <span className="p-1">{user?.firstname + ' ' + user?.lastname}</span>
            </>}
        </div>
    );
}
