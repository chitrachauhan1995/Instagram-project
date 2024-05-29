import './App.css';
import SignIn from './components/sign-in';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Profile from './components/profile';
import PrivateRoutes from './components/PrivateRoutes';
import socketClient from 'socket.io-client';
import Messenger from './components/messenger';

const SERVER = 'http://localhost:5000/';

function App() {
    const socket = socketClient(SERVER);
    socket.on('connection', () => {
        console.log(`I'm connected with the back-end`);
    });
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat-list" element={<Messenger />} />
                </Route>
                <Route path="/" element={<SignIn />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
