import { useState } from "react";

import Label from "../components/Label";

export default function Playground() {
    const [feedback, setFeedback] = useState("");
    const [label, setLabel] = useState("");
    const [labels, setLabels] = useState(["Bug Report", "Server Outtage", "Customer Service", "Billing Error", "Suggestion", "Spam", "Other"]);

    const [emotion, setEmotion] = useState("");
    const [tag, setTag] = useState("");
    const [subTags, setSubTags] = useState([]);

    const [btnLabel, setBtnLabel] = useState("Process");
    const [btnDisable, setBtnDisable] = useState(false);

    const [labelError, setLabelError] = useState("");

    const addLabel = () => {
        if (!labels.includes(label) && label !== "") {
            setLabels(labels => [...labels, label]);
            setLabelError("");
        }
    }

    const removeLabel = (name) => {
        if (labels.length > 1) {
            setLabels(labels.filter(la => la !== name));
        } else {
            setLabelError("There should at least be 1 tag");
        }
    }

    const processFeedback = () => {
        setBtnDisable(true);
        setBtnLabel("Processing...");

        const reqOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: feedback,
                date: toString(Date.now),
                tags: labels
            })
        }

        if (feedback !== "") {
            fetch("http://127.0.0.1:8000/process/", reqOptions)
                .then(res => res.json())
                .then(data => {
                    setEmotion(data.response.emotion);
                    setTag(data.response.tag);

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
                </div>
            </div>
        </div>
    )
}