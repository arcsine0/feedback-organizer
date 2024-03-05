import { Disclosure } from "@headlessui/react"

import { FaChevronDown } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";

export default function FeedbackCard({ count, title, content, sentiment, date, tag, subTag, score }) {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex flex-row justify-start p-5 content-center shadow-md rounded-md">
                        <h1 className="order-first text-lg text-gray font-semibold ml-5 mr-5">{count}</h1>
                        <h1 className="text-lg font-semibold mx-5">{title}</h1>
                        <h1 className="grow text-center"></h1>
                        <div className="order-last mx-10 rotate-90 transform">
                            <FaChevronDown className={open ? "-rotate-90 transform" : ""} />
                        </div>  
                    </Disclosure.Button>
                    <Disclosure.Panel className="flex flex-col space-y-2 justify-start p-5 shadow-md rounded-md">
                        <h1 className="text-lg font-semibold">Content</h1>
                        <div className="w-2/3 p-2 rounded-lg border-2 border-dashed">
                            <p>{content}</p>
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                            <h1 className="text-lg font-semibold">Date:</h1>
                            <p>{date}</p>
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                            <h1 className="text-lg font-semibold">Sentiment:</h1>
                            <div className="py-1 px-3 text-sm font-bold text-white bg-red-400 rounded-lg">{sentiment}</div>
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                            <h1 className="text-lg font-semibold">Tag:</h1>
                            <div className="py-1 px-3 text-sm font-bold text-black bg-slate-200 rounded-lg">{tag}</div>
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                            <h1 className="text-lg font-semibold">Sub-Tag:</h1>
                            <div className="py-1 px-3 text-sm font-bold text-black bg-slate-200 rounded-lg">{subTag}</div>
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                            <h1 className="text-lg font-semibold">Score:</h1>
                            <p className="font-semibold">{score}</p>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}