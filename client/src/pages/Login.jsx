import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import isEmail from "validator/lib/isEmail";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db, auth } from "../firebase/config";

import GlobalContext from "../globals/GlobalContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const [loginLabel, setLoginLabel] = useState("Log In");
    const [loginDisabled, setLoginDisabled] = useState(false);

    const { globalState, setGlobalState } = useContext(GlobalContext);

    const navigate = useNavigate();

    const submitCredentials = async () => {
        setLoginLabel("Logging In...");
        setLoginDisabled(true);

        if (isEmail(email)) {
            if (pass.length > 0) {
                try {
                    await signInWithEmailAndPassword(auth, email, pass)
                        .then(async (cred) => {
                            const user = cred.user;
                            localStorage.setItem("id", user.uid);

                            await getDoc(doc(db, "ClientAccounts", user.uid))
                                .then((sn) => {
                                    localStorage.setItem("uname", sn.data().uname);

                                    setGlobalState({
                                        ...globalState,
                                        isLoggedIn: true,
                                        id: user.uid,
                                        uname: sn.data().uname
                                    });

                                    localStorage.setItem("isLoggedIn", true);

                                    setLoginLabel("Logged In");
                                    setLoginDisabled(false);

                                    navigate("/");
                                });
                        });
                } catch (error) {
                    if (error === "Firebase: Error (auth/invalid-credential).") {
                        console.log("Invalid Credentials");
                    }
                }
            } else { console.log("Password Empty"); }
        } else { console.log("Email Invalid"); }

        setLoginLabel("Log In");
        setLoginDisabled(false);
    }

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider)
                .then(async (res) => {
                    const user = res.user;

                    localStorage.setItem("id", user.uid);
                    try {
                        await getDoc(doc(db, "ClientAccounts", user.uid))
                            .then(async (sn) => {
                                if (sn.data()) {
                                    localStorage.setItem("uname", sn.data().uname);

                                    setGlobalState({
                                        ...globalState,
                                        isLoggedIn: true,
                                        id: user.uid,
                                        uname: sn.data().uname
                                    });
                                } else {
                                    await setDoc(doc(db, "ClientAccounts", user.uid), {
                                        uname: user.displayName,
                                        firstName: "",
                                        lastName: ""
                                    }).then(() => {
                                        setGlobalState({
                                            ...globalState,
                                            isLoggedIn: true,
                                            id: user.uid,
                                            uname: user.displayName
                                        });
                                    });
                                }

                                localStorage.setItem("isLoggedIn", true);

                                navigate("/");
                            });
                    } catch (error) {
                        console.log(error);
                    }


                });
        } catch (error) {
            console.log(error);
        }
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
                <button onClick={submitCredentials} disabled={loginDisabled} className="flex h-5 w-3/4 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{loginLabel}</button>
                <button onClick={googleLogin} className="flex h-5 w-3/4 p-5 justify-center items-center shadow-md rounded-md text-black font-semibold bg-gradient-to-r from-white to-slate-300">Log In with Google</button>
                <p>No Account Yet?</p>
                <Link to={"/register"}>
                    <p className="text-blue-500 select-none cursor-pointer">Create an Account</p>
                </Link>
            </div>
        </div>
    )
}