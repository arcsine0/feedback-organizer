import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom'

import { Tab, Listbox } from "@headlessui/react";
import { FaPencilAlt, FaChevronDown } from "react-icons/fa";

import { collection, updateDoc, getDocs, getDoc, addDoc, setDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import Label from "../components/Label";
import TagGroup from "../components/TagGroup";

import GlobalContext from "../globals/GlobalContext";

export default function InstanceConfig() {
    const [instanceName, setInstanceName] = useState("");
    const [instanceDesc, setInstanceDesc] = useState("");

    const [originalReference, setOriginalReference] = useState({});
    const [reference, setReference] = useState([]);

    const [label, setLabel] = useState("");
    const [labels, setLabels] = useState([]);

    const [selectedLabel, setSelectedLabel] = useState(labels[0]);
    const [subLabel, setSubLabel] = useState("")
    const [subLabels, setSubLabels] = useState([]);

    const [btnLabel, setBtnLabel] = useState("Save");
    const [btnDisable, setBtnDisable] = useState(false);

    const [labelError, setLabelError] = useState("");
    const [subLabelError, setSubLabelError] = useState("");
    const [weightOrderError, setWeightOrderError] = useState("");

    const [labelOrder, setLabelOrder] = useState([]);

    const navigate = useNavigate();
    const { instanceID } = useParams();

    const { globalState, setGlobalState } = useContext(GlobalContext);

    useEffect(() => {
        getDocs(collection(db, "ClientInstances", instanceID, "Tags"))
            .then((snapshot) => {
                let ref = [];
                snapshot.docs.forEach(async (dc) => {
                    let tags = {
                        id: dc.id,
                        mainTag: dc.data().mainTag,
                        subTag: [...dc.data().subTag],
                        multiplier: dc.data().multiplier
                    }

                    ref.push(tags);

                    const instance = await getDoc(doc(db, "ClientInstances", instanceID));
                    setInstanceName(instance.data().title);
                    setInstanceDesc(instance.data().desc);
                });

                setOriginalReference(JSON.parse(JSON.stringify(ref)));
                setReference(ref);

                const mainTags = ref.map(r => r.mainTag);
                const subTags = ref.find(r => r.mainTag === mainTags[0])
                    .subTag;

                setLabels(mainTags);
                setLabelOrder(mainTags);

                setSelectedLabel(ref[0].mainTag);
                setSubLabels(subTags);
            });
    }, []);

    useEffect(() => {
        reference.forEach((tag, i) => {
            reference[i] = {
                ...reference[i],
                multiplier: (labelOrder.length - labelOrder.findIndex(la => la === tag.mainTag)) * 5
            }
        });
    }, [labelOrder])

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

    const handleOrderChange = (tag) => {
        if (labelOrder.length === labels.length) {
            setLabelOrder([]);
        } else {
            if (!labelOrder.includes(tag)) {
                setLabelOrder(prev => [...prev, tag]);
            }
        }
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
            let newSubLabels = subLabels.filter(sL => sL.name !== name)
            setSubLabels(newSubLabels);
            updateReference("sub", newSubLabels);

            setSubLabelError("");
        } else {
            setSubLabelError("There should at least be 1 tag");
        }
    }

    const getTagGroupWeights = (weights) => {
        const addedWeights = [...reference]
        const modifiedTagGroupIndex = addedWeights.findIndex(tag => tag.mainTag === weights.mainTag);
        addedWeights[modifiedTagGroupIndex] = {
            ...addedWeights[modifiedTagGroupIndex],
            subTag: weights.subTag
        }

        console.log(weights);
        setReference(addedWeights);
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
                if (updStr !== ogStrings[i]) {
                    withChanges.push(i);
                }
            } catch (e) {
                console.log(e);
            }
        });

        ogStrings.forEach((ogStr, i) => {
            if (!updStrings[i]) {
                withChanges.push(i);
            }
        });

        return withChanges;
    }

    const saveConfig = async () => {
        setBtnDisable(true);
        setBtnLabel("Saving...");

        const allLabelOrderCheck = reference.find(tag => tag.multiplier === 0);

        const existingTagsID = originalReference.map(ref => ref.id);
        const updatedTagsID = reference.map(ref => ref.id);

        if (!allLabelOrderCheck) {
            reference.forEach(async (r, i) => {
                if (existingTagsID.includes(r.id)) {
                    await setDoc(doc(db, "ClientInstances", instanceID, "Tags", r.id), {
                        mainTag: r.mainTag,
                        subTag: r.subTag,
                        multiplier: r.multiplier
                    })
                } else {
                    if (existingTagsID > updatedTagsID) {
                        await deleteDoc(doc(db, "ClientInstances", instanceID, "Tags", r.id));
                    } else {
                        await addDoc(collection(db, "ClientInstances", instanceID, "Tags"), {
                            mainTag: r.mainTag,
                            subTag: r.subTag,
                            multiplier: r.multiplier
                        });
                    }
                }
            });

            await updateDoc(doc(db, "ClientInstances", instanceID), {
                title: instanceName,
                desc: instanceDesc
            }).then(() => {
                setBtnDisable(false);
                setBtnLabel("Save");

                navigate(`/instance/${instanceID}`)
            });
        }
    }

    const deleteInstance = async () => {
        const deleteRef = await deleteDoc(doc(db, "ClientInstances", instanceID));
        navigate("/instances");
    }

    return (
        <div className="flex flex-col w-full h-screen p-10 space-y-10 overflow-y-auto">
            <div className="flex flex-col space-y-5">
                <h1 className="text-3xl font-bold">Edit Instance Config</h1>
                <div className="flex flex-row w-full h-full space-x-2 items-center">
                    <h1 className="text-2xl font-semibold py-2 px-4 bg-slate-200 rounded-lg">{globalState.uname}</h1>
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
            <div className="flex flex-col space-y-5">
                <h1 className="text-3xl font-bold">Instance Description</h1>
                <div className="flex flex-row w-full h-full space-x-2 items-center">
                    <textarea
                        className="w-1/3 p-2 text-lg border-2 border-dashed rounded-md text-pretty"
                        rows={4}
                        value={instanceDesc}
                        onChange={(e) => setInstanceDesc(e.target.value)}
                        placeholder="Enter the instance description..."
                    />
                </div>
            </div>
            <div className="flex flex-col w-2/3 h-full space-y-2">
                <h1 className="text-3xl font-bold">Instance Config</h1>
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
                                <div className="p-2 w-full h-full flex flex-row flex-wrap gap-2 border-2 border-dashed border-slate-600 rounded-lg">
                                    {subLabels.map((la, i) => (
                                        <Label key={i} name={la.name} remove={removeSubLabel} isBold={true} />
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
                                        {reference.map((tag) => (
                                            <TagGroup key={tag.id} order={labelOrder.findIndex(la => la === tag.mainTag) + 1} handleOrder={handleOrderChange} mainTag={tag.mainTag} subTag={tag.subTag} addToList={getTagGroupWeights} isNew={false} />
                                        ))}
                                    </div>
                                    <p className="font-semibold text-red-400">{weightOrderError}</p>
                                </div>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className={btnDisable ? "opacity-50" : "opacity-100"}>
                <button onClick={saveConfig} disabled={btnDisable} className="flex h-5 w-48 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">{btnLabel}</button>
            </div>
            <div className="flex flex-col w-2/3 p-2 gap-3 justify-center items-start border-4 border-red-600 border-dashed bg-red-100">
                <h1 className="text-3xl font-bold">Danger Zone</h1>
                <button onClick={deleteInstance} disabled={btnDisable} className="flex h-5 w-48 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-red-500 to-red-700">Delete Instance</button>
            </div>
        </div>
    )
}