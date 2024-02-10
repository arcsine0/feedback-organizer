import { useState } from "react"
import AuthModal from "../components/AuthModal";

export default function SignIn() {
    const [uname, setUname] = useState("");
    const [pass, setPass] = useState("");

    const [showAuth, setShowAuth] = useState(false);

    const creds = {
        "accounts": [
            {
                "uname": "john",
                "pass": "123456"
            },
            {
                "uname": "mary",
                "pass": "456"
            }
        ]
    }

    const tryLogin = () => {
        creds.accounts.forEach(cred => {
            if (cred.uname === uname) {
                if (cred.pass === pass) {
                   setShowAuth(true);
                } else {
                    setShowAuth(false);
                }
            }
        });
    }

    const isShowing = (modalState) => {
        setShowAuth(modalState);
    }

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex flex-col w-1/3 h-auto p-20 space-y-4 justify-center items-center shadow-lg rounded-lg">
                <h1 className="font-bold text-4xl">Log In</h1>
                <div className="w-3/4">
                    <label htmlFor="uname" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                    <input
                        type="text"
                        value={uname}
                        name="uname"
                        id="uname"
                        className="w-full p-2 border-2 rounded-lg"
                        onChange={e => setUname(e.target.value)}
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
                <button onClick={tryLogin} className="flex h-5 w-3/4 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Log In</button>
            </div>
            {showAuth && <AuthModal isShown={(isShowing)} />}
        </div>
    )
}