import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Tab, Listbox } from "@headlessui/react";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

import { FaChevronDown } from "react-icons/fa";

import Label from "../components/Label";

import GlobalContext from "../globals/GlobalContext";

export default function Sources() {
    const [instances, setInstances] = useState([]);
    const [selectedInstance, setSelectedInstance] = useState("Select instance");
    const [selectedInstanceName, setSelectedInstanceName] = useState("None");

    const { globalState, setGlobalState } = useContext(GlobalContext);

    const [feedback, setFeedback] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);

    const [feedbackError, setFeedbackError] = useState("");

    const [btnLabel, setBtnLabel] = useState("Send");
    const [btnDisable, setBtnDisable] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const accountID = globalState.id ? globalState.id : (localStorage.getItem("id") ? localStorage.getItem("id") : null);
        if (accountID === null) {
            navigate("/");
        }

        getDocs(collection(db, "ClientAccounts", accountID, "Instances"))
            .then((snps) => {
                let instanceIDs = [];
                snps.docs.forEach((dc) => {
                    instanceIDs.push(dc.id);
                });

                getDocs(collection(db, "ClientInstances"))
                    .then((snp) => {
                        let tempInstances = [];
                        snp.docs.forEach((doc) => {
                            if (instanceIDs.includes(doc.id)) {
                                if (!instances.find(ins => ins.id === doc.id)) {
                                    let result = {
                                        id: doc.id,
                                        title: doc.data().title,
                                        tags: []
                                    }

                                    getDocs(collection(db, "ClientInstances", doc.id, "Tags"))
                                        .then((sn) => {
                                            sn.docs.forEach((tags) => {
                                                const res = {
                                                    mainTag: tags.data().mainTag,
                                                    subTag: tags.data().subTag,
                                                    multiplier: tags.data().multiplier
                                                }

                                                result.tags.push(res);
                                            })
                                        })

                                    tempInstances.push(result)
                                }
                            }
                        });
                        setInstances(tempInstances);

                        if (instances[0]) {
                            setSelectedInstance(instances[0].id);
                        }
                    });

            })

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

    const getSentiment = async (data) => {
        const reqOptions = {
            method: "POST",
            headers: { Authorization: "Bearer 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" },
            body: JSON.stringify(data)
        }

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english", reqOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    const getTag = async (data) => {
        const reqOptions = {
            method: "POST",
            headers: { Authorization: "Bearer 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" },
            body: JSON.stringify(data)
        }

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7", reqOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    const sendFeedback = async () => {
        setBtnDisable(true);
        setBtnLabel("Processing...");

        const tagsList = instances.find(ins => ins.id === selectedInstance).tags;
        const mainTags = tagsList.map(ta => ta.mainTag);

        feedbacks.forEach(async (fd) => {
            let processedFeedback = {
                content: fd.content,
                date: fd.date,
                sentiment: "",
                mainTag: "",
                subTag: "",
                score: 0,
            }

            await getSentiment({ "text": fd.content }).then((res) => {
                processedFeedback.sentiment = res[0].label;
            });

            await getTag({ "inputs": fd.content, "parameters": { "candidate_labels": mainTags, "multi_label": false } }).then((res) => {
                processedFeedback.mainTag = res.labels[0];
            });

            const predictedMainTag = tagsList.find(ta => ta.mainTag === processedFeedback.mainTag);

            const subTags = predictedMainTag.subTag.map(sT => sT.name);
            await getTag({ "inputs": fd.content, "parameters": { "candidate_labels": subTags, "multi_label": false } }).then((res) => {
                processedFeedback.subTag = res.labels[0];
            });

            const multiplier = predictedMainTag.multiplier;
            const score = predictedMainTag.subTag.find(sT => sT.name === processedFeedback.subTag).weight * multiplier;

            processedFeedback.score = parseFloat(score.toFixed(2));

            await addDoc(collection(db, "ClientInstances", selectedInstance, "Feedbacks"), {
                ...processedFeedback,
                status: "Open",
                note: ""
            });

            setBtnDisable(false);
            setBtnLabel("Send");
        })
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
                                    {feedbacks.map((fd, i) => (
                                        <Label key={i} name={fd.content} remove={removeFeedback} isBold={false} />
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