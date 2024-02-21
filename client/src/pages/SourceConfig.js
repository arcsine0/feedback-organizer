import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'

import { Tab, Listbox } from "@headlessui/react";
import { FaPencilAlt, FaChevronDown } from "react-icons/fa";

import { collection, updateDoc, getDocs, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import Label from "../components/Label";

export default function SourceConfig() {
    const [sourceName, setSourceName] = useState("");

    const [originalReference, setOriginalReference] = useState({});
    const [reference, setReference] = useState({});
    const [selectedSource, setSelectedSource] = useState("");

    const [label, setLabel] = useState("");
    const [labels, setLabels] = useState([]);

    const [selectedLabel, setSelectedLabel] = useState(labels[0]);
    const [subLabel, setSubLabel] = useState("")
    const [subLabels, setSubLabels] = useState([]);

    const [btnLabel, setBtnLabel] = useState("Save");
    const [btnDisable, setBtnDisable] = useState(false);

    const [labelError, setLabelError] = useState("");
    const [subLabelError, setSubLabelError] = useState("");

    const navigate = useNavigate();
    const { sourceID } = useParams();

    useEffect(() => {
        const sourceRef = getDocs(collection(db, "ClientSources", sourceID, "Tags"))
            .then((snapshot) => {
                let ref = [];
                snapshot.docs.forEach((doc) => {
                    let tags = {
                        id: doc.id,
                        mainTag: doc.data().mainTag,
                        subTag: [...doc.data().subTag]
                    }

                    ref.push(tags);
                });

                setOriginalReference(JSON.parse(JSON.stringify(ref)));
                setReference(ref);

                console.log(ref);

                const mainTags = ref.map(r => r.mainTag);

                const subTags = ref.find(r => r.mainTag === mainTags[0])
                    .subTag;

                setSelectedSource(ref[0]);
                setLabels(mainTags);
                setSelectedLabel(ref[0].mainTag);
                setSubLabels(subTags);
            });
    }, []);

    const updateReference = (action, data) => {
        let updatedReference = [...reference];

        if (action === "main") {
            updatedReference = data.map((mT, i) => ({
                id: updatedReference[i]?.id || "",
                mainTag: mT,
                subTag: selectedLabel === mT
                    ? subLabels
                    : updatedReference[i]?.subTag || []
            }));
        } else {
            updatedReference.find(ref => ref.mainTag === selectedLabel)
                .subTag = data;
        }

        setReference(updatedReference);
    };

    const handleLabelChange = (lab) => {
        setSelectedLabel(lab);
        const subTags = reference.find(ref => ref.mainTag === lab)
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

    const compareRef = (og, upd) => {
        let ogStrings = og.map((t) => (
            JSON.stringify(t)
        ));

        let updStrings = upd.map((t) => (
            JSON.stringify(t)
        ));

        let withChanges = [];

        updStrings.forEach((updStr, i) => {
            try {
                // console.log(ogStrings[i]);
                // console.log(updStr);
                if (updStr !== ogStrings[i]) {

                    withChanges.push(i);
                }
            } catch (e) {
                console.log(e);
            }
        });

        return withChanges;
    }

    const saveConfig = async () => {
        // setBtnDisable(true);
        // setBtnLabel("Saving...");

        const withChanges = compareRef(originalReference, reference);

        reference.forEach(async (r, i) => {
            if (withChanges.includes(i)) {
                console.log(r);
                if (r.id !== "") {
                    await updateDoc(doc(db, "ClientSources", sourceID, "Tags", r.id), {
                        subTag: r.subTag
                    });
                } else {
                    await addDoc(collection(db, "ClientSources", sourceID, "Tags"), {
                        mainTag: r.mainTag,
                        subTag: r.subTag
                    });
                }
            }
        })

        // if (sourceRef.id && feedbackRef.id) {
        //     setBtnDisable(false);
        //     setBtnLabel("Save");

        //     navigate(`/source/${sourceRef.id}`)
        // }
    }

    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col space-y-5">
                <h1 className="text-3xl font-bold">Name your Source</h1>
                <div className="flex flex-row w-full h-full space-x-2 items-center">
                    <h1 className="text-2xl font-semibold py-2 px-4 bg-slate-200 rounded-lg">Guest</h1>
                    <h1 className="text-3xl">/</h1>
                    <input
                        type="text"
                        className="border-b-2 border-t-0 border-r-0 border-l-0 border-black text-2xl"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                    />
                    <FaPencilAlt />
                </div>
            </div>
            <div className="flex flex-col w-2/3 h-full space-y-2">
                <h1 className="text-3xl font-bold">Source Config</h1>
                <Tab.Group>
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
                            <h1 className="text-2xl font-bold">Set Tags</h1>
                            <div className="flex flex-col space-y-1">
                                <div className="p-2 w-full h-full flex flex-row flex-wrap space-x-2 border-2 border-dashed border-slate-600 rounded-lg">
                                    {labels.map((la) => (
                                        <Label name={la} remove={removeLabel} />
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
                                <div className="p-2 w-full h-full flex flex-row flex-wrap space-x-2 border-2 border-dashed border-slate-600 rounded-lg">
                                    {subLabels.map((la, ind) => (
                                        <Label name={la} remove={removeSubLabel} />
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
                            <div className={btnDisable ? "opacity-50" : "opacity-100"}>
                                <button onClick={saveConfig} disabled={btnDisable} className="flex h-5 w-48 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{btnLabel}</button>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}