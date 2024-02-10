import { Disclosure } from "@headlessui/react"

import { FaChevronDown } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";

export default function FeedbackCard({ count, title, content }) {
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
                        <div className="w-2/3 p-2 rounded-lg border-2">
                            <p>{content}</p>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}