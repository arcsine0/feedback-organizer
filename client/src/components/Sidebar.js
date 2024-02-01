import { Outlet, Link } from 'react-router-dom'
import { Menu } from '@headlessui/react';

import { FaChevronDown, FaThLarge, FaChartPie, FaSignInAlt } from 'react-icons/fa';
import { BsMailbox2Flag } from 'react-icons/bs';

export default function Sidebar() {
    return (
        <aside id='default-sidebar' className='w-64 min-wid-full h-screen transition-transform -translate-x-full sm:translate-x-0' aria-label='Sidebar'>
            <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
                <ul className='space-y-2 font-medium'>
                    <li>
                        <a className='flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <FaChartPie className='order-first' />
                                <Link to={'/'}><span className='ms-3'>Dashboard</span></Link>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className='flex'>
                            <Menu as="div" className="flex flex-col space-y-2 w-full h-full">
                                <Menu.Button className='flex p-2 items-center dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                    <FaThLarge className='order-first' />
                                    <span className='ms-3'>Courses</span>
                                    <div className='grow'></div>
                                    <FaChevronDown className='order-last' />
                                </Menu.Button>
                                <Menu.Items className="flex flex-col">
                                    <Menu.Item>
                                        <a className='p-1 dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                            <Link to={'/courses'}><span className='ms-3'>Course</span></Link>
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <a className='p-1 dark:text-white text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                                            <Link to={'/course'}><span className='ms-3'>Lessons</span></Link>
                                        </a>
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>

                        </a>
                    </li>
                    <li>
                        <a className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <BsMailbox2Flag />
                                <Link to={'/inbox'}>
                                    <span className='flex-1 ms-3 whitespace-nowrap'>Inbox</span>
                                </Link>
                            </div>
                            <span className='order-last inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300'>0</span>
                        </a>
                    </li>
                    <li>
                        <a className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                            <div className='flex order-first items-center'>
                                <FaSignInAlt />
                                <Link to={'/signin'}>
                                    <span className='flex-1 ms-3 whitespace-nowrap'>Sign In</span>
                                </Link>
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