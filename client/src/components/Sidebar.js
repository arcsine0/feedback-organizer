import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu } from '@headlessui/react';

import { FaChevronDown, FaThLarge, FaChartPie, FaSignInAlt } from 'react-icons/fa';
import { MdInput } from "react-icons/md";
import { GrTest } from "react-icons/gr";

import GlobalContext from "../globals/GlobalContext";

export default function Sidebar({ uname }) {
    const { globalState, setGlobalState } = useContext(GlobalContext);

    const navigate = useNavigate();

    const SignOut = () => {
        setGlobalState({
            ...globalState,
            isLoggedIn: false,
            id: "",
            uname: ""
        });

        try {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("id");
            localStorage.removeItem("uname");
        } catch(error) {
            console.log(error);
        }

        navigate("/");
    }

    return (
        <aside id='default-sidebar' className='w-64 min-wid-full h-screen transition-transform -translate-x-full sm:translate-x-0' aria-label='Sidebar'>
            <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
                <ul className='space-y-2 font-medium'>
                    <li>
                        <h1 className='dark:text-white'>Welcome, {uname}!</h1>
                    </li>
                    <li>
                        <Link to={"/"}>
                            <div className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                <div className='flex order-first items-center'>
                                    <FaChartPie className='order-first' />
                                    <span className='ms-3'>Dashboard</span>
                                </div>
                            </div>
                        </Link>
                    </li>
                    {/* <li>
                        <Link to={"/playground"}>
                            <div className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                <div className='flex order-first items-center'>
                                    <GrTest className='order-first' />
                                    <span className='ms-3'>Playground</span>
                                </div>
                            </div>
                        </Link>
                    </li> */}
                    <li>
                        <Link to={"/sources"}>
                            <div className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                <div className='flex order-first items-center'>
                                    <MdInput className='order-first' />
                                    <span className='ms-3'>Sources</span>
                                </div>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <div className='flex'>
                            <Menu as="div" className="flex flex-col space-y-2 w-full h-full">
                                <Menu.Button className='flex p-2 items-center dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                    <FaThLarge className='order-first' />
                                    <span className='ms-3'>Instances</span>
                                    <div className='grow'></div>
                                    <FaChevronDown className='order-last' />
                                </Menu.Button>
                                <Menu.Items className="flex flex-col">
                                    <Menu.Item>
                                        <div className='p-1 dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                            <Link to={'/instances'}><span className='ms-3'>All Instances</span></Link>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div className='p-1 dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                            <Link to={'/instance/add'}><span className='ms-3'>Create Instance</span></Link>
                                        </div>
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        </div>
                    </li>
                    <li>
                        <div className='flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <FaSignInAlt />
                                <span onClick={SignOut} className='flex-1 ms-3 whitespace-nowrap select-none'>Logout</span>
                            </div>
                        </div>
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