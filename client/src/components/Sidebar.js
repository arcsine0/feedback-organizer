import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu } from '@headlessui/react';

import { FaChevronDown, FaThLarge, FaChartPie, FaSignInAlt } from 'react-icons/fa';
import { BsMailbox2Flag } from 'react-icons/bs';
import { MdInput } from "react-icons/md";
import { GrTest } from "react-icons/gr";

export default function Sidebar({uname}) {
    const navigate = useNavigate();

    const SignOut = () => {
        localStorage.setItem("uname", undefined);
        navigate("/");
    }

    return (
        <aside id='default-sidebar' className='w-64 min-wid-full h-screen transition-transform -translate-x-full sm:translate-x-0' aria-label='Sidebar'>
            <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
                <ul className='space-y-2 font-medium'>
                    <li>
                        <h1>Welcome, {uname}!</h1>
                    </li>
                    <li>
                        <a className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <FaChartPie className='order-first' />
                                <Link to={'/'}><span className='ms-3'>Dashboard</span></Link>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <GrTest className='order-first' />
                                <Link to={'/playground'}><span className='ms-3'>Playground</span></Link>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <MdInput className='order-first' />
                                <Link to={'/sources'}><span className='ms-3'>Sources</span></Link>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className='flex'>
                            <Menu as="div" className="flex flex-col space-y-2 w-full h-full">
                                <Menu.Button className='flex p-2 items-center dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                    <FaThLarge className='order-first' />
                                    <span className='ms-3'>Instances</span>
                                    <div className='grow'></div>
                                    <FaChevronDown className='order-last' />
                                </Menu.Button>
                                <Menu.Items className="flex flex-col">
                                    <Menu.Item>
                                        <a className='p-1 dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                            <Link to={'/instances'}><span className='ms-3'>All Instances</span></Link>
                                        </a>
                                    </Menu.Item>
                                    {/* <Menu.Item>
                                        <a className='p-1 dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                            <Link to={'/source'}><span className='ms-3'>Temp Source Page</span></Link>
                                        </a>
                                    </Menu.Item> */}
                                </Menu.Items>
                            </Menu>

                        </a>
                    </li>
                    <li>
                        <a className='flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <FaSignInAlt />
                                <span onClick={SignOut} className='flex-1 ms-3 whitespace-nowrap select-none'>Logout</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div id='courses_dropdown' className='hidden'>
                <ul>
                    <li>All Courses</li>
                </ul>
            </div>
            <Outlet />
        </aside>
    )
}