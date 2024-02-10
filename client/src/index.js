import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css";

import Landing from "./pages/Landing"
import Sidebar from "./components/Sidebar";
import Playground from "./pages/Playground";
import Sources from "./pages/Sources";
import Inbox from "./pages/Inbox";
import SignIn from "./pages/SignIn";
import SourcePage from "./pages/SourcePage";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <div className="flex w-full h-full z-0">
          <Sidebar className="flex-none" uname={"Guest"} />
          <Routes>
            <Route path="/" index element={<Landing />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/course" element={<SourcePage title={"Source 1"} />} />
          </Routes>
        </div>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
