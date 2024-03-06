import { useEffect, useState } from "react";

import { Disclosure, Listbox } from "@headlessui/react";

import { FaChevronDown } from "react-icons/fa";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const statusOptions = [
    { id: 1, name: "Open" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "On Hold" },
    { id: 4, name: "Closed" }
]

const timeDiff = (date) => {
    const receivedDate = new Date(date);
    const now = new Date();
    const timeDifference = now - receivedDate;
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    const minsAgo = Math.floor(timeDifference / (1000 * 60));

    if (hoursAgo >= 1) {
        return `Received ${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else {
        return `Received ${minsAgo} ${minsAgo === 1 ? 'minute' : 'minutes'} ago`;
    }
}

export default function FeedbackCard({ title, data }) {
    const [selectedStatus, setSelectedStatus] = useState(statusOptions.find(st => st.name === data.status));
    const [note, setNote] = useState(data.note);

    const [btnLabel, setBtnLabel] = useState("Save");
    const [btnDisable, setBtnDisable] = useState(false);

    const handleStatusChange = (status) => {
        setSelectedStatus(statusOptions.find(st => st.name === status));
    };

    const saveStatus = async () => {
        setBtnLabel("Saving...");
        setBtnDisable(true);

        await updateDoc(doc(db, "ClientInstances", data.instanceID, "Feedbacks", data.feedbackID), {
            status: selectedStatus.name,
            note: note
        }).then(() => {
            setBtnLabel("Save");
            setBtnDisable(false);
        });
    }

    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex flex-row justify-start p-5 content-center shadow-md rounded-md">
                        <h1 className="order-first text-lg text-gray font-semibold ml-5 mr-5">{data.score}</h1>
                        <div className={data.sentiment === "POSITIVE" ? "bg-green-400 py-1 px-3 text-sm font-bold text-white rounded-lg" : "bg-red-400 py-1 px-3 text-sm font-bold text-white rounded-lg"}>{data.sentiment}</div>
                        <h1 className="text-lg font-semibold mx-5">{title}</h1>
                        <h1 className="grow text-center"></h1>
                        <h1 className="text-lg mx-5 text-slate-400">{timeDiff(data.date)}</h1>
                        <div className="order-last mx-10 rotate-90 transform">
                            <FaChevronDown className={open ? "-rotate-90 transform" : ""} />
                        </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="flex flex-row p-5 gap-5 shadow-md rounded-md">
                        <div className="flex flex-col w-3/4 gap-2 justify-start">
                            <h1 className="text-lg font-semibold">Content</h1>
                            <div className="w-full p-2 rounded-lg border-2 border-dashed">
                                <p>{data.content}</p>
                            </div>
                            <div className="flex flex-row space-x-2 items-center">
                                <h1 className="text-lg font-semibold">Date:</h1>
                                <p>{data.date}</p>
                            </div>
                            <div className="flex flex-row space-x-2 items-center">
                                <h1 className="text-lg font-semibold">Sentiment:</h1>
                                <div className={data.sentiment === "POSITIVE" ? "bg-green-400 py-1 px-3 text-sm font-bold text-white rounded-lg" : "bg-red-400 py-1 px-3 text-sm font-bold text-white rounded-lg"}>{data.sentiment}</div>
                            </div>
                            <div className="flex flex-row space-x-2 items-center">
                                <h1 className="text-lg font-semibold">Tag:</h1>
                                <div className="py-1 px-3 text-sm font-bold text-black bg-slate-200 rounded-lg">{data.mainTag}</div>
                            </div>
                            <div className="flex flex-row space-x-2 items-center">
                                <h1 className="text-lg font-semibold">Sub-Tag:</h1>
                                <div className="py-1 px-3 text-sm font-bold text-black bg-slate-200 rounded-lg">{data.subTag}</div>
                            </div>
                            <div className="flex flex-row space-x-2 items-center">
                                <h1 className="text-lg font-semibold">Score:</h1>
                                <p className="font-semibold">{data.score}</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-1/4 p-5 gap-2 bg-slate-100 rounded-md">
                            <h1 className="text-lg font-semibold">Status:</h1>
                            <Listbox as="div" className="px-2 py-1 bg-slate-200 rounded-lg"
                                value={selectedStatus}
                                onChange={(status) => handleStatusChange(status)}
                            >
                                <Listbox.Button className="flex flex-row w-full items-center">
                                    <span className="font-semibold order-first">{selectedStatus.name}</span>
                                    <span className="grow"></span>
                                    <span className="order-last"><FaChevronDown /></span>
                                </Listbox.Button>
                                <Listbox.Options className="space-y-1">
                                    {statusOptions.map((status) => (
                                        <Listbox.Option
                                            key={status.id}
                                            value={status.name}
                                            className="p-2 font-semibold hover:bg-slate-300 rounded-lg select-none cursor-pointer"
                                        >
                                            {status.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                            <h1 className="text-lg font-semibold">Note:</h1>
                            <textarea
                                className="p-2 w-full h-full border-2 border-dashed rounded-lg align-text-top text-wrap"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Write your thoughts here..."
                            />
                            <div className="flex justify-end">
                                <button onClick={saveStatus} disabled={btnDisable} className="flex w-1/5 h-5 shrink p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{btnLabel}</button>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}