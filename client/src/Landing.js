import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import Sources from "./pages/Sources";

import Login from "./pages/Login";

import Instances from "./pages/Instances";
import InstancePage from "./pages/InstancePage";
import InstanceAdd from "./pages/InstanceAdd";
import InstanceConfig from "./pages/InstanceConfig";

export default function Landing() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [UName, setUName] = useState("");

    useEffect(() => {
        const uname = localStorage.getItem("uname");

        if (!uname && uname === undefined) {
            setIsLoggedIn(false);
        } else {
            setUName(uname);
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="flex w-screen h-screen z-0">
                {isLoggedIn ? <Sidebar className="flex-none" uname={UName} /> : ""}
                <Routes>
                    <Route path="/" index element={isLoggedIn ? <Dashboard /> : <Login />} />
                    <Route path="/playground" element={<Playground />} />
                    <Route path="/sources" element={<Sources />} />

                    <Route path="/instances" element={<Instances />} />
                    <Route path="/instance/add" element={<InstanceAdd />} />
                    <Route path="/instance/:instanceID" element={<InstancePage />} />
                    <Route path="/instance/config/:instanceID" element={<InstanceConfig />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}