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
import { useAuth } from '../contexts/AuthContext';

const Messenger = () => {
    const { currentUser } = useAuth();
    const [addConversation] = useAddConversationMutation();
    const [addMessage] = useAddMessageMutation();

    const [conversations, setConversations] = useState([]);
    const [newConversations, setNewConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

    const { data, isLoading, error } = useGetAllUsersQuery({
        skip: !currentUser,
    });
    const { data: conversationsData, isLoading: isConversationsLoading } =
        useGetConversationsQuery(currentUser._id, {
            skip: !currentUser?._id || !allUsers,
        });
    const { data: messagesData, isLoading: isMessagesLoading } =
        useGetMessagesQuery(currentChat?._id, {
            skip: !currentChat,
        });

    useEffect(() => {
        const users = currentUser
            ? data?.data?.filter((u) => u._id !== currentUser._id)
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
        socket.current.emit('addUser', currentUser?._id);
        socket.current.on('getUsers', (users) => {
            // console.log('users', users);
        });
    }, [currentUser]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const setNewConversation = async (receiverId) => {
        const conversation = {
            senderId: currentUser._id,
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
            sender: currentUser._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== currentUser._id
        );

        const messageBody = {
            senderId: currentUser._id,
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
                <div className="chat-menu">
                    <div className="chat-menu-wrapper">
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
                                            currentUser={currentUser}
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
                                            currentUser={currentUser}
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
                <div className="chat-box">
                    {currentChat && (
                        <div className="current-conversation">
                            <Conversation
                                conversation={currentChat}
                                currentUser={currentUser}
                                conversations={conversations}
                            />
                        </div>
                    )}
                    <hr className="m-0" />
                    <div className="chat-box-wrapper">
                        {currentChat ? (
                            <>
                                <div className="chat-box-top">
                                    {messages?.map((m, index) => (
                                        <div ref={scrollRef} key={index}>
                                            <Message
                                                message={m}
                                                own={
                                                    m.sender === currentUser._id
                                                }
                                                key={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-box-bottom">
                                    <textarea
                                        className="chat-message-input"
                                        placeholder="Type a message..."
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        value={newMessage}
                                    />
                                    <button
                                        className="btn action-button"
                                        onClick={handleSubmit}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="no-conversation-text">
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
