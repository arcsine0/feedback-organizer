import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'

import { Tab, Listbox } from "@headlessui/react";
import { FaPencilAlt, FaChevronDown } from "react-icons/fa";

import { collection, doc, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

import Label from "../components/Label";
import TagGroup from "../components/TagGroup";

import useCases from '../defaults/UseCases.json';

import GlobalContext from "../globals/GlobalContext";

export default function InstanceAdd() {
    const [instanceName, setInstanceName] = useState("");

    const [reference, setReference] = useState(useCases);
    const [currentReference, setCurrentReference] = useState({ tags: [] });

    const [selectedInstance, setSelectedInstance] = useState(reference.use_cases[0].use_case);

    const [label, setLabel] = useState("");
    const [labels, setLabels] = useState([]);

    const [selectedLabel, setSelectedLabel] = useState(labels[0]);
    const [subLabel, setSubLabel] = useState("")
    const [subLabels, setSubLabels] = useState([]);

    const [btnLabel, setBtnLabel] = useState("Save");
    const [btnDisable, setBtnDisable] = useState(false);

    const [labelError, setLabelError] = useState("");
    const [subLabelError, setSubLabelError] = useState("");

    const [labelOrder, setLabelOrder] = useState([]);

    const { globalState, setGlobalState } = useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn")) {
            setGlobalState({
                ...globalState,
                isLoggedIn: localStorage.getItem("isLoggedIn"),
                id: localStorage.getItem("id"),
                uname: localStorage.getItem("uname")
            })
        }

        const mainTags = reference.use_cases[0]
            .tags.map(mT => mT.mainTag);

        const subTags = reference.use_cases[0]
            .tags.find(ta => ta.mainTag === "Functionality")
            .subTag.map(sT => ({
                name: sT.name,
                weight: sT.weight
            }));

        let selectedInstanceIndex = reference.use_cases.findIndex(uc => uc.use_case === selectedInstance);
        let currentRef = reference.use_cases[selectedInstanceIndex];

        setSelectedInstance(reference.use_cases[0].use_case);
        setLabels(mainTags);
        setLabelOrder(mainTags);

        setSelectedLabel(reference.use_cases[0].tags[0].mainTag);
        setSubLabels(subTags);

        setCurrentReference(currentRef);
    }, []);

    useEffect(() => {
        let selectedInstanceIndex = reference.use_cases.findIndex(uc => uc.use_case === selectedInstance);
        let currentRef = reference.use_cases[selectedInstanceIndex];

        setCurrentReference(currentRef);
    }, [selectedInstance, reference])

    const updateReference = (action, data) => {
        const updatedReference = { ...reference };

        const selectedUseCaseIndex = updatedReference.use_cases.findIndex(uc => uc.use_case === selectedInstance);

        if (selectedUseCaseIndex !== -1) {
            let currentUseCase = updatedReference.use_cases[selectedUseCaseIndex];
            if (action === "main") {
                currentUseCase.tags = data.map((mT, i) => ({
                    mainTag: mT,
                    subTag: selectedLabel === mT
                        ? subLabels
                        : currentUseCase.tags[i]?.subTag || []
                }));

                setLabelOrder(labels);
            } else {
                updatedReference.use_cases[selectedUseCaseIndex]
                    .tags.find(ta => ta.mainTag === selectedLabel)
                    .subTag = data;
            }
        }
        setReference(updatedReference);
    };

    const handleSourceChange = (source) => {
        setSelectedInstance(source);
        const mainTags = reference.use_cases
            .find(uc => uc.use_case === source)
            .tags.map(mT => mT.mainTag);

        setLabels(mainTags);

        let selectedUseCaseIndex = reference.use_cases.findIndex(uc => uc.use_case === source);
        setSelectedLabel(reference.use_cases[selectedUseCaseIndex].tags[0].mainTag);
        setSubLabels(reference.use_cases[selectedUseCaseIndex].tags[0].subTag);

        let currentRef = reference.use_cases[selectedUseCaseIndex];
        setCurrentReference(currentRef);
    }

    const handleLabelChange = (lab) => {
        setSelectedLabel(lab);
        const subTags = reference.use_cases
            .find(uc => uc.use_case === selectedInstance)
            .tags.find(ta => ta.mainTag === lab)
            .subTag.map;

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
        if (!subLabels.map(sL => sL.name).includes(subLabel) && subLabel !== "") {
            let newSubLabels = [...subLabels, { name: subLabel, weight: 0 }]
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

    const getTagGroupWeights = (weights) => {
        const addedWeights = { ...currentReference }
        const modifiedTagGroupIndex = addedWeights.tags.findIndex(tag => tag.mainTag === weights.mainTag);
        addedWeights.tags[modifiedTagGroupIndex] = weights

        console.log(addedWeights)

        setCurrentReference(addedWeights);

    }

    const addSource = async () => {
        setBtnDisable(true);
        setBtnLabel("Saving...");

        const instanceRef = await addDoc(collection(db, "ClientInstances"), {
            title: instanceName,
            useCase: currentReference.use_case
        });

        if (instanceRef.id) {
            getDocs(collection(db, "ClientAccounts", globalState.id, "Instances"))
                .then((snapshots) => {
                    snapshots.docs.forEach((dc) => {
                        if (dc.data().instanceID === "") {
                            updateDoc(doc(db, "ClientAccounts", globalState.id, "Instances", dc.id), {
                                instanceID: instanceRef.id
                            });
                        } else {
                            addDoc(collection(db, "ClientAccounts", globalState.id, "Instances"), {
                                instanceID: instanceRef.id
                            })
                        }
                    });
                });

            currentReference.tags.forEach(async (t) => {
                await addDoc(collection(db, `ClientInstances/${instanceRef.id}/Tags`), {
                    mainTag: t.mainTag,
                    subTag: t.subTag
                });
            });


            if (instanceRef.id) {
                setBtnDisable(false);
                setBtnLabel("Save");

                navigate(`/instance/${instanceRef.id}`)
            }
        }
    }

    return (
        <div className="flex flex-col w-full h-screen p-10 space-y-10 overflow-y-auto">
            <div className="flex flex-col space-y-5">
                <h1 className="text-3xl font-bold">Name your Instance</h1>
                <div className="flex flex-row w-full h-full space-x-2 items-center">
                    <h1 className="text-2xl font-semibold py-2 px-4 bg-slate-200 rounded-lg">Guest</h1>
                    <h1 className="text-3xl">/</h1>
                    <input
                        type="text"
                        className="border-b-2 border-t-0 border-r-0 border-l-0 border-black text-2xl"
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                    />
                    <FaPencilAlt />
                </div>
            </div>
            <div className="flex flex-col w-2/3 h-full space-y-2">
                <h1 className="text-3xl font-bold">Instance Config</h1>
                <Tab.Group as={"div"} className="h-full">
                    <Tab.List className="flex w-1/3 space-x-10 p-2 items-center">
                        <Tab className="flex justify-center items-center px-5 py-2 hover:border-b-2 border-black">
                            <h1 className="font-semibold">Tags</h1>
                        </Tab>
                        <h1>|</h1>
                        <Tab className="flex justify-center items-center px-5 py-2 hover:border-b-2 border-black">
                            <h1 className="font-semibold">Weights</h1>
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-6">
                        <Tab.Panel as={"div"} className="flex flex-col w-full space-y-4">
                            <h1 className="text-2xl font-bold">Set Instance Type</h1>
                            <Listbox as="div" className="p-2 bg-slate-200 w-1/4 rounded-lg"
                                value={selectedInstance}
                                onChange={(newSource) => handleSourceChange(newSource)}
                            >
                                <Listbox.Button className="flex flex-row w-full items-center">
                                    <span className="font-bold order-first">{selectedInstance}</span>
                                    <span className="grow"></span>
                                    <span className="order-last"><FaChevronDown /></span>
                                </Listbox.Button>
                                <Listbox.Options className="space-y-1">
                                    {reference.use_cases.map((ref, i) => (
                                        <Listbox.Option
                                            key={i}
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
                                <div className="p-2 w-full h-full flex flex-row flex-wrap gap-2 border-2 border-dashed border-slate-600 rounded-lg">
                                    {labels.map((la, i) => (
                                        <Label key={i} name={la} remove={removeLabel} isBold={true} />
                                    ))}
                                </div>
                                <p className="font-semibold text-red-400">{labelError}</p>
                            </div>
                            <div className="flex flex-row space-x-4 item-center">
                                <input
                                    type="text"
                                    className="p-2 grow h-full border-2 rounded-lg text-pretty"
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
                                    {labels.map((la, i) => (
                                        <Listbox.Option
                                            key={i}
                                            value={la}
                                            className="p-2 font-semibold hover:bg-slate-100 rounded-lg select-none cursor-pointer"
                                        >
                                            {la}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Listbox>
                            <div className="flex flex-col space-y-1">
                                <div className="p-2 w-full h-full flex flex-row flex-wrap gap-2 border-2 border-dashed border-slate-600 rounded-lg">
                                    {subLabels.map((sL, i) => (
                                        <Label key={i} name={sL.name} remove={removeSubLabel} isBold={true} />
                                    ))}
                                </div>
                                <p className="font-semibold text-red-400">{subLabelError}</p>
                            </div>
                            <div className="flex flex-row space-x-4 item-center">
                                <input
                                    type="text"
                                    className="p-2 grow h-full border-2 rounded-lg text-pretty"
                                    value={subLabel}
                                    onChange={(e) => setSubLabel(e.target.value)}
                                />
                                <button onClick={addSubLabel} className="flex h-5 shrink p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Set</button>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel as={"div"} className="flex flex-col w-2/3 space-y-4">
                            <h1 className="text-2xl font-bold">Set Instance Weights</h1>
                            <div className="flex flex-row gap-3">
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex flex-col gap-2 p-2 overflow-y-scroll border-2 border-dashed border-black">
                                        {currentReference.tags.map((tag, i) => (
                                            <TagGroup key={i} order={labelOrder.findIndex(la => la === tag.mainTag) + 1} mainTag={tag.mainTag} subTag={tag.subTag} addToList={getTagGroupWeights} isNew={true} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
                <div className={btnDisable ? "opacity-50" : "opacity-100"}>
                    <button onClick={addSource} disabled={btnDisable} className="flex h-5 w-48 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{btnLabel}</button>
                </div>
            </div>
        </div>
    )
}