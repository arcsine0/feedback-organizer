import { useState, useEffect } from "react";

import { Tab, Listbox } from "@headlessui/react";

import { collection, updateDoc, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import { FaPencilAlt, FaChevronDown } from "react-icons/fa";

export default function Sources() {
    const [instances, setInstances] = useState([]);
    const [selectedInstance, setSelectedInstance] = useState("Select instance");
    const [selectedInstanceName, setSelectedInstanceName] = useState("None");

    useEffect(() => {
        getDocs(collection(db, "ClientInstances"))
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    let result = {
                        id: doc.id,
                        title: doc.data().title
                    }
                    
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

    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col space-y-5">
                <h1 className="text-3xl font-bold">Feedback Inputs</h1>
                <div className="p-5 w-1/3 flex flex-col space-y-2 justify-center border-2 border-dashed border-black">
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
                            {instances.map((ins, ind) => (
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
            </div>
        </div>
    )
}