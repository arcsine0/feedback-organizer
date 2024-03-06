import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Sources from "./pages/Sources";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Instances from "./pages/Instances";
import InstancePage from "./pages/InstancePage";
import InstanceAdd from "./pages/InstanceAdd";
import InstanceConfig from "./pages/InstanceConfig";

import GlobalContext from "./globals/GlobalContext";

export default function Landing() {
    const [globalState, setGlobalState] = useState({
        isLoggedIn: false,
        id: "",
        uname: ""
    });
    
    useEffect(() => {
        if (localStorage.getItem("isLoggedIn")) {
            setGlobalState({
                ...globalState,
                isLoggedIn: localStorage.getItem("isLoggedIn"),
                id: localStorage.getItem("id"),
                uname: localStorage.getItem("uname")
            })
        }
    }, []);

    return (
        <GlobalContext.Provider value={{ globalState, setGlobalState }}>
            <BrowserRouter>
                <div className="flex w-screen h-screen z-0">
                    {globalState.isLoggedIn ? <Sidebar className="flex-none" uname={globalState.uname} /> : ""}
                    <Routes>
                        <Route path="/" index element={globalState.isLoggedIn ? <Dashboard /> : <Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/sources" element={<Sources />} />

                        <Route path="/instances" element={<Instances />} />
                        <Route path="/instance/add" element={<InstanceAdd />} />
                        <Route path="/instance/:instanceID" element={<InstancePage />} />
                        <Route path="/instance/config/:instanceID" element={<InstanceConfig />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </GlobalContext.Provider>

    )
}