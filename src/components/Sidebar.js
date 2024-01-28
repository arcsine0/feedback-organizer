import { Outlet, Link } from 'react-router-dom'
import { FaChevronDown, FaThLarge, FaChartPie, FaSignInAlt } from "react-icons/fa";
import { BsMailbox2Flag } from "react-icons/bs";

export default function Sidebar() {
    return (
        <aside id="default-sidebar" class="w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul class="space-y-2 font-medium">
                    <li>
                        <a class="flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <div className='flex order-first items-center'>
                                <FaChartPie className='order-first' />
                                <Link to={'/'}><span class="ms-3">Dashboard</span></Link>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a class="flex justify-between items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <div className='flex order-first items-center'>
                                <FaThLarge />
                                <Link to={'/courses'}><span className="ms-3 shrink whitespace-nowrap">Courses</span></Link>
                            </div>
                            <FaChevronDown className='order-last' />
                        </a>
                    </li>
                    <li>
                        <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <div className='flex order-first items-center'>
                                <BsMailbox2Flag />
                                <Link to={'/inbox'}>
                                    <span class="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                                </Link>
                            </div>
                            <span class="order-last inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">0</span>
                        </a>
                    </li>
                    <li>
                        <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <div className='flex order-first items-center'>
                                <FaSignInAlt />
                                <Link to={'/signin'}>
                                    <span class="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                                </Link>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <Outlet />
        </aside>
    )
}