import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";

import { FaChevronDown } from 'react-icons/fa';

import Label from "../components/Label";

import useCases from '../defaults/UseCases.json';

export default function Playground() {
    const [feedback, setFeedback] = useState("");

    const [reference, setReference] = useState(useCases);
    const [selectedSource, setSelectedSource] = useState(reference.use_cases[0].use_case);

    const [label, setLabel] = useState("");
    const [labels, setLabels] = useState([]);

    const [selectedLabel, setSelectedLabel] = useState(labels[0]);
    const [subLabel, setSubLabel] = useState("")
    const [subLabels, setSubLabels] = useState([]);

    const [emotion, setEmotion] = useState("");
    const [tag, setTag] = useState("");
    const [subTag, setSubTag] = useState("");

    const [btnLabel, setBtnLabel] = useState("Process");
    const [btnDisable, setBtnDisable] = useState(false);

    const [labelError, setLabelError] = useState("");
    const [subLabelError, setSubLabelError] = useState("");

    useEffect(() => {
        const mainTags = reference.use_cases[0]
            .tags.map(mT => mT.mainTag);

        const subTags = reference.use_cases[0]
            .tags.find(ta => ta.mainTag === "Bug Report")
            .subTag;

        setSelectedSource(reference.use_cases[0].use_case);
        setLabels(mainTags);
        setSelectedLabel(reference.use_cases[0].tags[0].mainTag);
        setSubLabels(subTags);
    }, []);

    const updateReference = (action, data) => {
        const updatedReference = { ...reference };

        const selectedUseCaseIndex = updatedReference.use_cases.findIndex(uc => uc.use_case === selectedSource);

        if (selectedUseCaseIndex !== -1) {
            let currentUseCase = updatedReference.use_cases[selectedUseCaseIndex];
            if (action === "main") {
                currentUseCase.tags = data.map((mT, i) => ({
                    mainTag: mT,
                    subTag: selectedLabel === mT 
                    ? subLabels
                    : currentUseCase.tags[i]?.subTag || []
                }));
            } else {
                updatedReference.use_cases[selectedUseCaseIndex]
                    .tags.find(ta => ta.mainTag === selectedLabel)
                    .subTag = data;
            }
        }

        console.log(updatedReference)

        setReference(updatedReference);
    };

    const handleSourceChange = (source) => {
        setSelectedSource(source);
        const mainTags = reference.use_cases
            .find(uc => uc.use_case === source)
            .tags.map(mT => mT.mainTag);

        setLabels(mainTags);
        
        let selectedSourceIndex = reference.use_cases.findIndex(uc => uc.use_case === source);
        setSelectedLabel(reference.use_cases[selectedSourceIndex].tags[0].mainTag);
        setSubLabels(reference.use_cases[selectedSourceIndex].tags[0].subTag);
    }

    const handleLabelChange = (lab) => {
        setSelectedLabel(lab);
        const subTags = reference.use_cases
            .find(uc => uc.use_case === selectedSource)
            .tags.find(ta => ta.mainTag === lab)
            .subTag;

        setSubLabels(subTags);
    }

    const addLabel = () => {
        if (!labels.includes(label) && label !== "") {
            let newLabels = [...labels, label]
            setLabels(newLabels);
            setLabelError("");
            updateReference("main", newLabels);
        }
    }

    const removeLabel = (name) => {
        if (labels.length > 1) {
            let newLabels = labels.filter(la => la !== name)
            setLabels(newLabels);
            updateReference("main", newLabels);

            setLabelError("");
        } else {
            setLabelError("There should at least be 1 tag");
        }
    }

    const addSubLabel = () => {
        if (!subLabels.includes(subLabel) && subLabel !== "") {
            let newSubLabels = [...subLabels, subLabel]
            setSubLabels(newSubLabels);
            setSubLabelError("");
            updateReference("sub", newSubLabels);
        }
    }

    const removeSubLabel = (name) => {
        if (subLabels.length > 1) {
            let newSubLabels = subLabels.filter(la => la !== name)
            setSubLabels(newSubLabels);
            updateReference("sub", newSubLabels);

            setSubLabelError("");
        } else {
            setSubLabelError("There should at least be 1 tag");
        }
    }

    const processFeedback = () => {
        setBtnDisable(true);
        setBtnLabel("Processing...");

        let selectedSourceIndex = reference.use_cases.findIndex(uc => uc.use_case === selectedSource);
        let finalReference = reference.use_cases[selectedSourceIndex];

        const reqOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: feedback,
                date: toString(Date.now),
                tags: finalReference
            })
        }

        if (feedback !== "") {
            fetch("http://127.0.0.1:8000/process/", reqOptions)
                .then(res => res.json())
                .then(data => {
                    setEmotion(data.response.emotion);
                    setTag(data.response.tag);
                    setSubTag(data.response.subTag);

                    setBtnDisable(false);
                    setBtnLabel("Process");
                })
        } else {
            setBtnDisable(false);
            setBtnLabel("Process");
        }
    }

    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col w-2/3 h-full space-y-10">
                <div className="flex flex-col w-full space-y-4">
                    <h1 className="text-3xl font-bold">Send Feedback</h1>
                    <input
                        type="textarea"
                        className="p-2 w-full h-2/3 border-2 border-black rounded-lg text-pretty"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    <h1 className="text-2xl font-bold">Set Source Type</h1>
                    <Listbox as="div" className="p-2 bg-slate-200 w-1/4 rounded-lg" 
                        value={selectedSource} 
                        onChange={(newSource) => handleSourceChange(newSource)}
                    >
                        <Listbox.Button className="flex flex-row w-full items-center">
                            <span className="font-bold order-first">{selectedSource}</span>
                            <span className="grow"></span>
                            <span className="order-last"><FaChevronDown /></span>
                        </Listbox.Button>
                        <Listbox.Options className="space-y-1">
                            {reference.use_cases.map((ref, ind) => (
                                <Listbox.Option
                                    key={ind}
                                    value={ref.use_case}
                                    className="p-2 font-semibold hover:bg-slate-100 rounded-lg select-none cursor-pointer"
                                >
                                    {ref.use_case}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Listbox>
                    <h1 className="text-2xl font-bold">Set Tags</h1>
                    <div className="flex flex-col space-y-1">
                        <div className="p-2 w-full h-2/3 flex flex-row flex-wrap space-x-2 border-2 border-dashed border-slate-600 rounded-lg">
                            {labels.map((la, ind) => (
                                <Label name={la} remove={removeLabel} />
                            ))}
                        </div>
                        <p className="font-semibold text-red-400">{labelError}</p>
                    </div>
                    <div className="flex flex-row space-x-4 item-center">
                        <input
                            type="text"
                            className="p-2 grow h-2/3 border-2 rounded-lg text-pretty"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                        <button onClick={addLabel} className="flex h-5 shrink p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Set</button>
                    </div>
                    <h1 className="text-2xl font-bold">Set Sub-Tags</h1>
                    <Listbox as="div" className="p-2 bg-slate-200 w-1/4 rounded-lg" 
                        value={selectedLabel} 
                        onChange={(newLabel) => handleLabelChange(newLabel)}
                    >
                        <Listbox.Button className="flex flex-row w-full items-center">
                            <span className="font-bold order-first">{selectedLabel}</span>
                            <span className="grow"></span>
                            <span className="order-last"><FaChevronDown /></span>
                        </Listbox.Button>
                        <Listbox.Options className="space-y-1">
                            {labels.map((la, ind) => (
                                <Listbox.Option
                                    key={ind}
                                    value={la}
                                    className="p-2 font-semibold hover:bg-slate-100 rounded-lg select-none cursor-pointer"
                                >
                                    {la}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Listbox>
                    <div className="flex flex-col space-y-1">
                        <div className="p-2 w-full h-2/3 flex flex-row flex-wrap space-x-2 border-2 border-dashed border-slate-600 rounded-lg">
                            {subLabels.map((la, ind) => (
                                <Label name={la} remove={removeSubLabel} />
                            ))}
                        </div>
                        <p className="font-semibold text-red-400">{subLabelError}</p>
                    </div>
                    <div className="flex flex-row space-x-4 item-center">
                        <input
                            type="text"
                            className="p-2 grow h-2/3 border-2 rounded-lg text-pretty"
                            value={subLabel}
                            onChange={(e) => setSubLabel(e.target.value)}
                        />
                        <button onClick={addSubLabel} className="flex h-5 shrink p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Set</button>
                    </div>
                    <div className={btnDisable ? "opacity-50" : "opacity-100"}>
                        <button onClick={processFeedback} disabled={btnDisable} className="flex h-5 w-48 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{btnLabel}</button>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold">Predicted Results</h1>
                    <div className="flex flex-row space-x-2 items-center">
                        <h1 className="text-lg font-semibold">Emotion:</h1>
                        <div className="py-1 px-3 text-sm font-bold text-white bg-red-400 rounded-lg">{emotion}</div>
                    </div>
                    <div className="flex flex-row space-x-2 items-center">
                        <h1 className="text-lg font-semibold">Tag:</h1>
                        <div className="py-1 px-3 text-sm font-bold text-black bg-slate-200 rounded-lg">{tag}</div>
                    </div>
                    <div className="flex flex-row space-x-2 items-center">
                        <h1 className="text-lg font-semibold">Sub-Tag:</h1>
                        <div className="py-1 px-3 text-sm font-bold text-black bg-slate-200 rounded-lg">{subTag}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}