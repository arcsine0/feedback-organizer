import { Disclosure } from '@headlessui/react'

import { FaChevronDown } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";

export default function LessonCard({ count, title }) {
    return (
        // <div className="flex flex-col">
        //     <div className="flex flex-row w-full h-20 justify-start items-center content-center shadow-md rounded-md">
        //         <h1 className="order-first text-lg text-gray font-semibold ml-10 mr-5">{count}</h1>
        //         <h1 className="text-lg font-semibold mx-5">{title}</h1>
        //         <h1 className="grow text-center"></h1>
        //         <FaChevronDown className="order-last mx-10" />
        //     </div>
        // </div>
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex flex-row justify-start p-5 content-center shadow-md rounded-md">
                        <h1 className="order-first text-lg text-gray font-semibold ml-5 mr-5">{count}</h1>
                        <h1 className="text-lg font-semibold mx-5">{title}</h1>
                        <h1 className="grow text-center"></h1>
                        <div className="order-last mx-10 rotate-90 transorm">
                            <FaChevronDown className={open ? '-rotate-90 transform' : ''} />
                        </div>  
                    </Disclosure.Button>
                    <Disclosure.Panel className="flex flex-col space-y-2 justify-start p-5 shadow-md rounded-md">
                        <h1 className="text-lg font-semibold">Submit Lesson File</h1>
                        <div className='flex flex-row space-x-5'>
                            <button className='flex h-10 w-60 justify-center items-center shadow-md rounded-md'>
                                <IoAddOutline className="m-2" />
                            </button>
                            <button className='flex h-5 w-60 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500'>Upload</button>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}