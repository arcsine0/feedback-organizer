import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import Sources from "./pages/Sources";

import Inbox from "./pages/Inbox";
import SignIn from "./pages/SignIn";

import Instances from "./pages/Instances";
import InstancePage from "./pages/InstancePage";
import InstanceAdd from "./pages/InstanceAdd";
import InstanceConfig from "./pages/InstanceConfig";

export default function Landing() {
    return (
        <BrowserRouter>
            <div className="flex w-screen h-screen z-0">
                <Sidebar className="flex-none" uname={"Guest"} />
                <Routes>
                    <Route path="/" index element={<Dashboard />} />
                    <Route path="/playground" element={<Playground />} />
                    <Route path="/sources" element={<Sources />} />

                    <Route path="/instances" element={<Instances />} />
                    <Route path="/instance/add" element={<InstanceAdd />} />
                    <Route path="/instance/:instanceID" element={<InstancePage />} />
                    <Route path="/instance/config/:instanceID" element={<InstanceConfig />} />

                    <Route path="/inbox" element={<Inbox />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}