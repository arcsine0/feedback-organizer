import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { getDocs, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

import FeedbackCard from "../components/FeedbackCard";

export default function SourcePage() {
    const [sourceName, setSourceName] = useState("");

    const [feedbackID, setFeedbackID] = useState("")
    const [feedbacks, setFeedbacks] = useState([]);

    const { sourceID } = useParams();

    useEffect(() => {
        let fdID = "";
        const feedbackRef = getDocs(collection(db, "ClientFeedbacks"))
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.data().sourceID === sourceID) {
                        setFeedbackID(doc.id);
                        fdID = doc.id;

                        const feedbacksRef = getDocs(collection(db, "ClientFeedbacks", doc.id, "Feedbacks"))
                            .then((ss) => {
                                let result = [];
                                ss.docs.forEach((d) => {
                                    let fd = {
                                        content: d.data().content,
                                        date: d.data().date,
                                        emotion: d.data().emotion,
                                        mainTag: d.data().mainTag,
                                        subTag: d.data().subTag
                                    }

                                    result.push(fd);
                                })

                                setFeedbacks(result);
                            });
                    }
                })
            });

        const sourceRef = getDocs(collection(db, "ClientSources"))
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.id === sourceID) {
                        setSourceName(doc.data().title);
                    }
                })
            });

    }, []);

    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="shrink flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">{sourceName}</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sem arcu, pellentesque id sapien id, ullamcorper sollicitudin mi. Maecenas in elit iaculis, placerat ex id, molestie neque. Praesent lobortis nunc at rhoncus lacinia. Nam maximus tincidunt nibh, quis commodo libero sagittis in.</p>
            </div>
            {/* <div className="grow flex flex-col space-y-1">
                <h1 className="shrink text-3xl font-bold">Recent Feedbacks</h1>
                <div className="grow flex flex-col space-y-2">
                    <FeedbackCard count={1} title={"Feedback 1"} content={"I am absolutely furious about the persistent bug in your app! It's disrupting my workflow, and attempts to get this resolved have been painfully slow. This is unacceptable, and I demand immediate action to fix this issue and prevent further inconvenience."} emotion={"Angry"} tag={"Bug Report"} />
                </div>
            </div> */}
            <div className="grow flex flex-col space-y-1">
                <h1 className="shrink text-3xl font-bold">All Feedbacks</h1>
                <div className="grow flex flex-col space-y-2 overflow-y-auto">
                    {feedbacks.map((fd, i) => (
                        <FeedbackCard count={i + 1} title={`Feedback ${i + 1}`} content={fd.content} date={fd.date} emotion={fd.emotion} tag={fd.tag} subTag={fd.subTag} />
                    ))}
                </div>
            </div>
        </div>
    )
}