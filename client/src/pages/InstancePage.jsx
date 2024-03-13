import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'

import { compareDesc } from "date-fns";

import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";

import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

import FeedbackCard from "../components/FeedbackCard";

const sortByOptions = [
    { id: 1, name: "Importance" },
    { id: 2, name: "Date" }
];

const sentimentOptions = [
    { id: 1, name: "Any" },
    { id: 2, name: "Positive" },
    { id: 3, name: "Negative" }
];

export default function InstancePage() {
    const [instanceName, setInstanceName] = useState("Title");
    const [instanceDesc, setInstanceDesc] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sem arcu, pellentesque id sapien id, ullamcorper sollicitudin mi. Maecenas in elit iaculis, placerat ex id, molestie neque. Praesent lobortis nunc at rhoncus lacinia. Nam maximus tincidunt nibh, quis commodo libero sagittis in.");

    const [selectedSort, setSelectedSort] = useState(sortByOptions[0]);
    const [selectedSentiment, setSelectedSentiment] = useState(sentimentOptions[0]);

    const [feedbacks, setFeedbacks] = useState([]);
    const [sortedFeedbacks, setSortedFeedbacks] = useState([]);

    const { instanceID } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getDocs(collection(db, "ClientInstances", instanceID, "Feedbacks"))
            .then((snapshot) => {
                let result = [];
                snapshot.docs.forEach((doc) => {
                    const fd = {
                        instanceID: instanceID,
                        feedbackID: doc.id,
                        ...doc.data()
                    }

                    result.push(fd);
                })

                setFeedbacks(result);
                setSortedFeedbacks(result);
            });

        getDocs(collection(db, "ClientInstances"))
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.id === instanceID) {
                        setInstanceName(doc.data().title);
                        setInstanceDesc(doc.data().desc);
                    }
                })
            });
    }, []);

    useEffect(() => {
        let temp = [...feedbacks];

        switch (selectedSentiment.name) {
            case "Any": break;
            case "Positive":
                temp = temp.filter(fd => fd.sentiment === "POSITIVE");
                break;
            case "Negative":
                temp = temp.filter(fd => fd.sentiment === "NEGATIVE");
                break;
            default: break;
        }

        switch (selectedSort.name) {
            case "Importance":
                temp.forEach((fd) => {console.log(typeof(fd.score))})
                temp = temp.sort((a, b) => {
                    if (parseFloat(a.score) < parseFloat(b.score)) {
                        return 1;
                    }
                    if (parseFloat(a.score) > parseFloat(b.score)) {
                        return -1;
                    }
                    return 0;
                })
                break;
            case "Date":
                temp = temp.sort((a, b) => {
                    return compareDesc(a.date, b.date)
                })
                break;
            default: break;
        }

        setSortedFeedbacks(temp);
    }, [selectedSort, selectedSentiment])

    const handleSortChange = (val) => {
        if (sortByOptions.map(s => s.name).includes(val)) {
            setSelectedSort(sortByOptions.find(s => s.name === val));
        } else {
            setSelectedSentiment(sentimentOptions.find(s => s.name === val))
        }
    }

    const goToConfig = () => {
        navigate(`/instance/config/${instanceID}`);
    }

    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="shrink flex flex-col space-y-2">
                <h1 className="text-3xl font-bold">{instanceName}</h1>
                <p>{instanceDesc}</p>
            </div>
            <button onClick={goToConfig} className="flex w-1/6 h-5 shrink p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Edit Config</button>
            <div className="grow flex flex-col space-y-2">
                <h1 className="shrink text-3xl font-bold">All Feedbacks</h1>
                <div className="flex gap-10 items-center">
                    <div className="flex gap-2 w-1/6 items-center">
                        <h1 className="w-1/4 text-lg font-semibold">Sort by: </h1>
                        <div className="z-20 relative px-2 py-1 bg-slate-200 w-3/4 rounded-lg">
                            <Listbox as="div" className=""
                                value={selectedSort}
                                onChange={(newSort) => handleSortChange(newSort)}
                            >
                                <Listbox.Button className="flex flex-row w-full items-center">
                                    <span className="font-semibold order-first">{selectedSort.name}</span>
                                    <span className="grow"></span>
                                    <span className="order-last"><FaChevronDown /></span>
                                </Listbox.Button>
                                <Listbox.Options className="space-y-1">
                                    {sortByOptions.map((sort) => (
                                        <Listbox.Option
                                            key={sort.id}
                                            value={sort.name}
                                            className="p-2 font-semibold hover:bg-slate-100 rounded-lg select-none cursor-pointer"
                                        >
                                            {sort.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                        </div>
                    </div>
                    <div className="flex gap-2 w-1/6 items-center">
                        <h1 className="w-1/3 text-lg font-semibold">Sentiment: </h1>
                        <div className="z-20 relative px-2 py-1 bg-slate-200 w-2/3 rounded-lg">
                            <Listbox as="div" className=""
                                value={selectedSentiment}
                                onChange={(newSentiment) => handleSortChange(newSentiment)}
                            >
                                <Listbox.Button className="flex flex-row w-full items-center">
                                    <span className="font-semibold order-first">{selectedSentiment.name}</span>
                                    <span className="grow"></span>
                                    <span className="order-last"><FaChevronDown /></span>
                                </Listbox.Button>
                                <Listbox.Options className="space-y-1">
                                    {sentimentOptions.map((sent) => (
                                        <Listbox.Option
                                            key={sent.id}
                                            value={sent.name}
                                            className="p-2 font-semibold hover:bg-slate-100 rounded-lg select-none cursor-pointer"
                                        >
                                            {sent.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                        </div>
                    </div>
                </div>
                <div className="grow flex flex-col space-y-2 overflow-y-auto">
                    {sortedFeedbacks.map((fd, i) => (
                        <FeedbackCard key={i} title={`Feedback ${i + 1}`} data={fd} />
                    ))}
                </div>
            </div>
        </div>
    )
}