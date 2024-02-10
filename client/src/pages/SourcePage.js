
import FeedbackCard from "../components/FeedbackCard"

export default function SourcePage({title}) {
    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sem arcu, pellentesque id sapien id, ullamcorper sollicitudin mi. Maecenas in elit iaculis, placerat ex id, molestie neque. Praesent lobortis nunc at rhoncus lacinia. Nam maximus tincidunt nibh, quis commodo libero sagittis in.</p>
            </div>
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">Recent Feedbacks</h1>
                <div className="flex flex-col space-y-2">
                    <FeedbackCard count={1} title={"Feedback 1"} content={"I am absolutely furious about the persistent bug in your app! It's disrupting my workflow, and attempts to get this resolved have been painfully slow. This is unacceptable, and I demand immediate action to fix this issue and prevent further inconvenience."} />
                </div>
            </div>
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">All Feedbacks</h1>
                <div className="flex flex-col space-y-2">
                    <FeedbackCard count={1} title={"Feedback 1"} content={"I am absolutely furious about the persistent bug in your app! It's disrupting my workflow, and attempts to get this resolved have been painfully slow. This is unacceptable, and I demand immediate action to fix this issue and prevent further inconvenience."} />
                </div>
            </div>
        </div>
    )
}