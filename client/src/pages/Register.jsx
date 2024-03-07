import { useState } from "react";
import { useNavigate } from "react-router-dom";

import isEmail from "validator/lib/isEmail";

import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase/config";

import { Tab } from "@headlessui/react";
import { MdNavigateNext } from "react-icons/md";

export default function Register() {
    const [accountDetails, setAccountDetails] = useState({
        email: "",
        pass: "",
        uname: "",
        firstName: "",
        lastName: ""
    });

    const [pass, setPass] = useState("");

    const [selectedTab, setSelectedTab] = useState(0);

    const [profileDisabled, setProfileDisabled] = useState(true);
    const [passwordDisabled, setPasswordDisabled] = useState(true);

    const navigate = useNavigate();

    const handleFormChange = (e) => {
        const name = e.target.name;
        const val = e.target.value;

        setAccountDetails(prev => ({
            ...prev,
            [name]: val
        }));
    }

    const nextStep = (index) => {
        console.log(accountDetails);
        switch (index) {
            case 1:
                if (accountDetails.email.trim !== "") {
                    if (isEmail(accountDetails.email)) {
                        setProfileDisabled(false);
                        setSelectedTab(index);
                    }
                }
                break;
            case 2:
                if (accountDetails.firstName.trim !== "" && accountDetails.lastName.trim !== "" && accountDetails.uname.trim !== "") {
                    setPasswordDisabled(false);
                    setSelectedTab(index);
                }
                break;
            default: break;
        }
    }

    const submitCredentials = async () => {
        const regex = /^(?=.*[a-zA-Z0-9])(?=.*[_\-#])[a-zA-Z0-9_\-#]+$/;

        if (accountDetails.pass.length >= 6) {
            if (regex.test(accountDetails.pass)) {
                if (accountDetails.pass === pass) {
                    try {
                        createUserWithEmailAndPassword(auth, accountDetails.email, accountDetails.pass)
                            .then(async (cred) => {
                                const user = cred.user;
                                await setDoc(doc(db, "ClientAccounts", user.uid), {
                                    firstName: accountDetails.firstName,
                                    lastName: accountDetails.lastName,
                                    uname: accountDetails.uname
                                });

                                navigate("/");
                            })
                    } catch (error) {
                        console.error(error);
                    }

                } else { console.log("Confirm Password should match Password"); }
            } else { console.log("Password should contain symbols [_, -, #]"); }
        } else { console.log("Password should be at least 6 characters long"); }

    }

    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-1/3 h-auto p-20 space-y-4 justify-center items-start shadow-lg rounded-lg">
                <h1 className="font-bold text-4xl">Create Account</h1>
                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex w-full gap-10 p-2 justify-start items-center">
                        <Tab>Email</Tab>
                        <MdNavigateNext />
                        <Tab className={profileDisabled ? "opacity-50" : "opacity-100"} disabled={profileDisabled}>Profile</Tab>
                        <MdNavigateNext />
                        <Tab className={passwordDisabled ? "opacity-50" : "opacity-100"} disabled={passwordDisabled}>Password</Tab>
                    </Tab.List>
                    <Tab.Panels className="w-full">
                        <Tab.Panel className="flex flex-col w-full gap-4">
                            <div className="w-full">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={accountDetails.email}
                                    id="email"
                                    className="w-full p-2 border-2 rounded-lg"
                                    onChange={handleFormChange}
                                />
                            </div>
                            <button onClick={() => nextStep(1)} className="flex h-5 w-1/3 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Next</button>
                        </Tab.Panel>
                        <Tab.Panel className="flex flex-col w-full gap-4">
                            <div className="w-full">
                                <label htmlFor="uname" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                                <input
                                    type="text"
                                    name="uname"
                                    value={accountDetails.uname}
                                    id="uname"
                                    className="w-full p-2 border-2 rounded-lg"
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={accountDetails.firstName}
                                    id="firstName"
                                    className="w-full p-2 border-2 rounded-lg"
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={accountDetails.lastName}
                                    id="lastName"
                                    className="w-full p-2 border-2 rounded-lg"
                                    onChange={handleFormChange}
                                />
                            </div>
                            <button onClick={() => nextStep(2)} className="flex h-5 w-1/3 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Next</button>
                        </Tab.Panel>
                        <Tab.Panel className="flex flex-col w-full gap-4">
                            <div className="w-full">
                                <label htmlFor="pass" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <input
                                    type="text"
                                    name="pass"
                                    value={pass}
                                    id="pass"
                                    className="w-full p-2 border-2 rounded-lg"
                                    onChange={(e) => setPass(e.target.value)}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                                <input
                                    type="text"
                                    name="pass"
                                    value={accountDetails.pass}
                                    id="pass"
                                    className="w-full p-2 border-2 rounded-lg"
                                    onChange={handleFormChange}
                                />
                            </div>
                            <button onClick={submitCredentials} className="flex h-5 w-1/3 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Register</button>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}