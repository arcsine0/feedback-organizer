import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css";

import Landing from "./pages/Landing"
import Sidebar from "./components/Sidebar";
import Playground from "./pages/Playground";
import Instances from "./pages/Instances";
import Inbox from "./pages/Inbox";
import SignIn from "./pages/SignIn";

import InstancePage from "./pages/InstancePage";
import InstanceAdd from "./pages/InstanceAdd";
import InstanceConfig from "./pages/InstanceConfig";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <div className="flex w-screen h-screen z-0">
          <Sidebar className="flex-none" uname={"Guest"} />
          <Routes>
            <Route path="/" index element={<Landing />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/instances" element={<Instances />} />
            <Route path="/instance/add" element={<InstanceAdd />} />
            <Route path="/instance/:instanceID" element={<InstancePage />} />
            <Route path="/instance/config/:instanceID" element={<InstanceConfig />} />
          </Routes>
        </div>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
