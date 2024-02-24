import { useState, useEffect, useContext } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import GlobalContext from "../globals/GlobalContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const { globalState, setGlobalState } = useContext(GlobalContext);

    const navigate = useNavigate();

    const submitCredentials = () => {
        getDocs(collection(db, "ClientAccounts"))
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.data().email === email) {
                        if (doc.data().pass === pass) {
                            localStorage.setItem("uname", doc.data().uname);
                            localStorage.setItem("id", doc.id);

                            setGlobalState({
                                ...globalState,
                                isLoggedIn: true,
                                id: doc.id,
                                uname: doc.data().uname
                            });

                            navigate("/");
                        }
                    }
                });
            });
    }

    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-1/3 h-auto p-20 space-y-4 justify-center items-center shadow-lg rounded-lg">
                <h1 className="font-bold text-4xl">Log In</h1>
                <div className="w-3/4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <input
                        type="text"
                        value={email}
                        name="email"
                        id="email"
                        className="w-full p-2 border-2 rounded-lg"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="w-3/4">
                    <label htmlFor="pass" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <input
                        type="text"
                        value={pass}
                        name="pass"
                        id="pass"
                        className="w-full p-2 border-2 rounded-lg"
                        onChange={e => setPass(e.target.value)}
                    />
                </div>
                <button onClick={submitCredentials} className="flex h-5 w-3/4 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Log In</button>
                <p>No Account Yet?</p>
                <Link to={"/register"}>
                    <a className="text-blue-500 select-none cursor-pointer">Create an Account</a>
                </Link>
            </div>
        </div>
    )
}