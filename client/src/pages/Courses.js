import CourseCard from "../components/CourseCard";

import { IoIosAddCircleOutline } from "react-icons/io";

export default function Courses() {
    return (
        <div className="flex flex-col p-10 space-y-10">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">Recent Courses</h1>
                <p>et, consectetur adipiscing elit. Maecenas tortor odio, varius ac velit ac, consequat pharetra felis. Vestibulum varius ante orci, sed accumsan nunc vestibulum sed. Quisque vitae odio vitae lorem ultrices blandit sit amet in odio. Quisque tincidunt lacinia lacus vel iaculis. Duis gravida quis est et egestas. Curabitur sollicitudin, massa vitae sodales tincidunt, diam erat fringilla diam, nec euismod velit ligula sit amet metus. Maecenas felis neque, sodales nec nisi in, pharetra consequat eros. Proin semper tortor eget imperdiet pellentesque. Nulla eu tempor elit. Nunc gravida mi ac tortor luctus rhoncus. Aenean ut sem a mi ultrices sagittis. Vestibulum at cursus mi. Duis nec ex a arcu vehicula semper. Nullam ultricies eros at tristique euismod. Morbi rhoncus lobortis ipsum.</p>
            </div>
            <div className="flex flex-col space-y-1">
                <div className="flex flex-row space-x-3 items-center">
                    <h1 className="text-3xl font-bold">All Courses</h1>
                    <IoIosAddCircleOutline size={25} />
                </div>
                <p></p>
                <div className="flex flex-row flex-wrap space-x-4">
                    <CourseCard title={'Course 1'} />
                    <CourseCard title={'Course 2'} />
                </div>
            </div> 
        </div>
    )
}