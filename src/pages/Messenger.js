import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { flatten } from 'lodash';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import { useGetAllUsersQuery } from '../services/users';
import {
    useAddConversationMutation,
    useGetConversationsQuery,
} from '../services/conversation';
import {
    useAddMessageMutation,
    useGetMessagesQuery,
} from '../services/message';

const Messenger = () => {
    const [addConversation] = useAddConversationMutation();
    const [addMessage] = useAddMessageMutation();

    const [conversations, setConversations] = useState([]);
    const [newConversations, setNewConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [user, setUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const currentUser = JSON.parse(user);
        setUser(currentUser);
    }, []);

    const { data, isLoading, error } = useGetAllUsersQuery({
        skip: !user,
    });
    const { data: conversationsData, isLoading: isConversationsLoading } =
        useGetConversationsQuery(user._id, {
            skip: !user?._id || !allUsers,
        });
    const { data: messagesData, isLoading: isMessagesLoading } =
        useGetMessagesQuery(currentChat?._id, {
            skip: !currentChat,
        });

    useEffect(() => {
        const users = user
            ? data?.data?.filter((u) => u._id !== user._id)
            : data?.data;
        setAllUsers(users);
    }, [data]);

    useEffect(() => {
        if (conversationsData) {
            setConversations(conversationsData);
            const cUsers = conversationsData.map((c) => c.members);
            const newConversation = allUsers?.filter(
                (user) => !flatten(cUsers).includes(user._id)
            );
            setNewConversations(newConversation);
        }
    }, [conversationsData]);

    useEffect(() => {
        setMessages(messagesData);
    }, [messagesData]);

    useEffect(() => {
        socket.current = io('http://localhost:5000');
        socket.current.on('getMessage', (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members?.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit('addUser', user?._id);
        socket.current.on('getUsers', (users) => {
            // console.log('users', users);
        });
    }, [user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const setNewConversation = async (receiverId) => {
        const conversation = {
            senderId: user._id,
            receiverId,
        };
        try {
            const response = await addConversation(conversation);
            if (response?.data) {
                setCurrentChat(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );

        const messageBody = {
            senderId: user._id,
            receiverId,
            text: newMessage,
        };
        socket.current.emit('sendMessage', messageBody);
        try {
            const response = await addMessage(message);
            if (response?.data) {
                setMessages([...messages, response.data]);
            }
            setNewMessage('');
        } catch (err) {
            console.log(err);
        }
    };

    if (isLoading || isConversationsLoading || isMessagesLoading) {
        return (
            <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">
                Loading...
            </div>
        );
    }

    if (error) return <h4 className="text-center">Something went wrong!</h4>;

    return (
        <>
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        {conversations?.length ? (
                            <div>
                                <h3 className="chats-title m-0">Chats</h3>
                                {conversations?.map((c, index) => (
                                    <div
                                        onClick={() => setCurrentChat(c)}
                                        key={index}
                                    >
                                        <Conversation
                                            conversation={c}
                                            currentUser={user}
                                            key={index}
                                            isNewUsers={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            ''
                        )}
                        <hr />
                        {newConversations?.length ? (
                            <div>
                                <h3 className="chats-title m-0">New Chats</h3>
                                {newConversations?.map((c, index) => (
                                    <div
                                        onClick={() =>
                                            setNewConversation(c._id)
                                        }
                                        key={index}
                                    >
                                        <Conversation
                                            conversation={c}
                                            currentUser={user}
                                            key={index}
                                            isNewUsers={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className="chatBox">
                    {currentChat && (
                        <div className="current-conversation">
                            <Conversation
                                conversation={currentChat}
                                currentUser={user}
                                conversations={conversations}
                            />
                        </div>
                    )}
                    <hr className="m-0" />
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages?.map((m, index) => (
                                        <div ref={scrollRef} key={index}>
                                            <Message
                                                message={m}
                                                own={m.sender === user._id}
                                                key={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="Type a message..."
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        value={newMessage}
                                    />
                                    <button
                                        className="chatSubmitButton"
                                        onClick={handleSubmit}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noConversationText">
                                Open a conversation to start a chat.
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Messenger;
