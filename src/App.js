import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketClient from 'socket.io-client';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Messenger from './pages/Messenger';
import PageNotFound from './pages/PageNotFound';
import PrivateRoutes from './components/PrivateRoutes';
import PublicRoutes from './components/PublicRoutes';
import './App.css';

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
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/profile" element={<Profile />} />
                    <Route exact path="/chats" element={<Messenger />} />
                </Route>
                <Route
                    exact
                    path="/"
                    element={
                        <PublicRoutes>
                            <SignIn />
                        </PublicRoutes>
                    }
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
