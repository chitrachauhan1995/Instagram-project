import React, {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import Conversation from "./conversation";
import Message from "./message";
import Cookies from "js-cookie";
import {useGetAllUsersQuery} from "../services/users";

export default function Messenger() {
    const {data, error, isLoading} = useGetAllUsersQuery();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [user, setUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();
    const token = Cookies.get("token");

    useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
        const user = localStorage.getItem('currentUser');
        if (user) {
            const currentUser = JSON.parse(user);
            setUser(currentUser);
        }
    }, []);

    useEffect(() => {
        const users = data?.data?.filter((u) => u._id !== user._id)
        setAllUsers(users);
    }, [data]);

    useEffect(() => {
        arrivalMessage &&
        currentChat?.members?.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user?._id);
        socket.current.on("getUsers", (users) => {
            // console.log('users', users);
        });
    }, [user]);

    const getConversations = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/conversations/" + user._id,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                }
            );
            let data = await response.json();
            if (response.status === 200) {
                setConversations(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getMessages = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/messages/" + currentChat?._id,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                }
            );
            let data = await response.json();
            if (response.status === 200) {
                setMessages(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getConversations();
    }, [user?._id]);

    useEffect(() => {
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        let receiverId = '';
        if (conversations?.length) {
            receiverId = currentChat.members.find(
                (member) => member !== user._id
            );
        } else {
            receiverId = currentChat._id;
            const conversation = {
                senderId: user._id,
                receiverId
            };
            // add new conversation call.
            try {
                const response = await fetch(
                    "http://localhost:5000/conversations",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(conversation)
                    }
                );
                if (response.status === 200) {
                    getConversations();
                }
            } catch (err) {
                console.log(err);
            }
        }

        const messageBody = {
            senderId: user._id,
            receiverId,
            text: newMessage,
        }
        socket.current.emit("sendMessage", messageBody);
        try {
            const response = await fetch(
                "http://localhost:5000/messages",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(message)
                }
            );
            let data = await response.json();
            if (response.status === 200) {
                setMessages([...messages, data]);
            }
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="messenger">
                <div className="chatMenu">
                    {conversations?.length ?
                        <>
                            <div className="chatMenuWrapper">
                                <h4 className="chats-title m-0">Chats</h4>
                                <hr className="m-0"/>
                                {conversations?.map((c, index) => (
                                    <div onClick={() => setCurrentChat(c)} key={index}>
                                        <Conversation conversation={c} currentUser={user} key={index}
                                                      conversations={conversations}/>
                                    </div>
                                ))}
                            </div>
                        </>
                        : <>
                            <div className="chatMenuWrapper">
                                <h4>New Chat</h4>
                                {allUsers?.map((c, index) => (
                                    <div onClick={() => setCurrentChat(c)} key={index}>
                                        <Conversation conversation={c} currentUser={user} key={index}
                                                      conversations={conversations}/>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>
                <div className="chatBox">
                    {currentChat && <div className="current-conversation"><Conversation conversation={currentChat} currentUser={user}
                                                       conversations={conversations}/></div>}
                    <hr className="m-0"/>
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages?.map((m, index) => (
                                        <div ref={scrollRef} key={index}>
                                            <Message message={m} own={m.sender === user._id} key={index}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                      <textarea
                                          className="chatMessageInput"
                                          placeholder="Type a message..."
                                          onChange={(e) => setNewMessage(e.target.value)}
                                          value={newMessage}
                                      />
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
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
}
