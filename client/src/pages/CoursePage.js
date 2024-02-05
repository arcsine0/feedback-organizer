
import LessonCard from "../components/LessonCard"

export default function CoursePage({title}) {
    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sem arcu, pellentesque id sapien id, ullamcorper sollicitudin mi. Maecenas in elit iaculis, placerat ex id, molestie neque. Praesent lobortis nunc at rhoncus lacinia. Nam maximus tincidunt nibh, quis commodo libero sagittis in.</p>
            </div>
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">Lessons</h1>
                <div className="flex flex-col space-y-2">
                    <LessonCard count={1} title={'Lesson 1'} />
                </div>
            </div>
        </div>
    )
}