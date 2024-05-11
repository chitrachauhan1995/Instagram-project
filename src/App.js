import "./App.css";
import SignIn from "./components/sign-in";
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/home";
import Profile from "./components/profile";
import ChatList from "./components/chatList";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/chat-list" element={<ChatList/>}/>
                </Route>
                <Route path="/" element={<SignIn/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
