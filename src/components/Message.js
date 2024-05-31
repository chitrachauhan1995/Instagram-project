import React from "react";
import moment from 'moment';

export default function Message({ message, own }) {
    const createdAt = moment(message.createdAt).format('MMMM DD YYYY, h:mm A');
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="d-flex">
                <img
                    className="message-img"
                    src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    alt=""
                />
                <p className="message-text">{message.text}</p>
            </div>
            <div className="message-bottom">{createdAt}</div>
        </div>
    );
}
