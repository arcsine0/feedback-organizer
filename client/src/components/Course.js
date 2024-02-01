export default function Course({title}) {
    return (
        <div className="flex flex-col w-96 h-40 justify-center content-center shadow-md rounded-md">
            <div className="basis-3/4 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-md"></div>
            <div className="basis-1/4 flex flex-row align-center p-3">
                <h1 className="flex text-lg font-semibold">{title}</h1>
            </div>
        </div>
    )
}