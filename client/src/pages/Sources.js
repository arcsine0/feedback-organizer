import { useState, useEffect } from "react";

import { Tab, Listbox } from "@headlessui/react";

import { collection, updateDoc, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import { FaPencilAlt, FaChevronDown } from "react-icons/fa";

import Label from "../components/Label";

export default function Sources() {
    const [instances, setInstances] = useState([]);
    const [selectedInstance, setSelectedInstance] = useState("Select instance");
    const [selectedInstanceName, setSelectedInstanceName] = useState("None");

    const [instanceTagConfig, setInstanceTagConfig] = useState({});

    const [feedback, setFeedback] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);

    const [feedbackError, setFeedbackError] = useState("");

    const [btnLabel, setBtnLabel] = useState("Send");
    const [btnDisable, setBtnDisable] = useState(false);

    useEffect(() => {
        getDocs(collection(db, "ClientInstances"))
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    let result = {
                        id: doc.id,
                        title: doc.data().title,
                        tags: []
                    }

                    getDocs(collection(db, "ClientInstances", doc.id, "Tags"))
                        .then((sn) => {
                            sn.docs.forEach((tags) => {
                                let res = {
                                    mainTag: tags.data().mainTag,
                                    subTag: tags.data().subTag
                                }

                                result.tags.push(res);
                            })
                        })

                    if (!instances.find(ins => ins.id === result.id)) {
                        let newInstance = [...instances, result];
                        setInstances(newInstance);
                    }
                });

                if (instances[0]) {
                    setSelectedInstance(instances[0].id);
                }
            });
    }, []);

    const handleInstanceChange = (newInstance) => {
        setSelectedInstance(newInstance);

        const instanceName = instances.find(ins => ins.id === newInstance).title;
        setSelectedInstanceName(instanceName);
    }

    const preProcessFeedback = (fd) => {
        if (fd.startsWith('"')) {
            fd = fd.slice(1);
        }

        if (fd.endsWith('"')) {
            fd = fd.slice(0, -1);
        }

        let processedString = fd.replace(/"/g, "'");

        return processedString;
    }

    const chunkArray = (array, chunkSize) => {
        return Array.from(
          { length: Math.ceil(array.length / chunkSize) },
          (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize)   
        );
      }

    const addFeedback = () => {
        let processedFeedback = preProcessFeedback(feedback);

        if (!feedbacks.includes(processedFeedback) && processedFeedback !== "") {
            let newFeedback = {
                content: processedFeedback,
                date: new Date().toJSON()
            }
            let newFeedbacks = [...feedbacks, newFeedback]
            setFeedbacks(newFeedbacks);
            setFeedback("");
        }
    }

    const removeFeedback = (name) => {
        if (feedbacks.length > 1) {
            let newFeedbacks = feedbacks.filter(fd => fd.content !== name)
            setFeedbacks(newFeedbacks);
            setFeedbackError("");
        } else {
            setFeedbackError("There should at least be 1 tag");
        }
    }

    const sendFeedback = () => {
        // setBtnDisable(true);
        // setBtnLabel("Processing...");

        if (feedbacks.length >= 1) {
            const feedbackChunks = chunkArray(feedbacks, 5);

            const tagsList = instances.find(ins => ins.id === selectedInstance).tags

            feedbackChunks.forEach((fd, i) => {
                const reqOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: fd,
                        tags: tagsList
                    })
                }

                if (fd) {
                    try {
                        fetch("http://127.0.0.1:8000/process/batch", reqOptions)
                        .then(res => res.json())
                        .then(d => {
                            // let data = d.response;

                            // let newSet = {
                            //     "content": data.content,
                            //     "date": data.date,
                            //     "emotion": data.emotion,
                            //     "tag": data.tag,
                            //     "subTag": data.subTag
                            // }

                            setBtnDisable(false);
                            setBtnLabel("Send");

                            console.log(`Processing Done for Feedback #${i}`);
                        })
                    } catch(error) {
                        setBtnDisable(false);
                        setBtnLabel("Send");

                        console.log(error);
                    }
                } else {
                    setBtnDisable(false);
                    setBtnLabel("Send");
                }
            })
            // setFeedbacks([]);
        }
    }

    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col space-y-5">
                <h1 className="text-3xl font-bold">Feedback Inputs</h1>
                <div className="p-5 w-1/3 flex flex-col space-y-2 justify-center border-2 border-dashed border-black rounded-md">
                    <p>Selected Instance:</p>
                    <h1 className="text-2xl font-bold">{selectedInstanceName}</h1>
                    <Listbox as="div" className="p-2 bg-slate-200 rounded-lg"
                        value={selectedInstance}
                        onChange={(newInstance) => handleInstanceChange(newInstance)}
                    >
                        <Listbox.Button className="flex flex-row w-full items-center">
                            <span className="font-bold order-first">{selectedInstance}</span>
                            <span className="grow"></span>
                            <span className="order-last"><FaChevronDown /></span>
                        </Listbox.Button>
                        <Listbox.Options className="space-y-1">
                            {instances.map((ins) => (
                                <Listbox.Option
                                    key={ins.id}
                                    value={ins.id}
                                    className="p-2 font-semibold hover:bg-slate-100 rounded-lg select-none cursor-pointer"
                                >
                                    {ins.id}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Listbox>
                </div>
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold">Source Type</h1>
                    <Tab.Group>
                        <Tab.List className="flex w-1/3 space-x-10 p-2 items-center">
                            <Tab className="flex justify-center items-center px-5 py-2 hover:border-b-2 border-black">
                                <h1 className="font-semibold">Simple</h1>
                            </Tab>
                            <h1>|</h1>
                            <Tab className="flex justify-center items-center px-5 py-2 hover:border-b-2 border-black">
                                <h1 className="font-semibold">Google Sheets</h1>
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-6">
                            <Tab.Panel as={"div"} className="flex flex-col w-1/3 space-y-4">
                                <h1 className="text-2xl font-bold">Send Feedbacks</h1>
                                <div className="flex flex-col space-y-1">
                                    <p>Enter or Paste feedbacks below:</p>
                                    <div className="flex flex-row space-x-4 items-center">
                                        <input
                                            type="textarea"
                                            name="feedbacks"
                                            className="p-2 grow h-full border-2 border-black rounded-lg text-pretty"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                        />
                                        <button onClick={addFeedback} className="flex h-5 shrink p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Add</button>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-wrap p-3 overflow-y-scroll space-y-3 border-2 border-dashed border-black rounded-md">
                                    {feedbacks.map((fd) => (
                                        <Label name={fd.content} remove={removeFeedback} isBold={false} />
                                    ))}
                                </div>
                                <div className={btnDisable ? "opacity-50" : "opacity-100"}>
                                    <button onClick={sendFeedback} disabled={btnDisable} className="flex h-5 w-48 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{btnLabel}</button>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    )
}