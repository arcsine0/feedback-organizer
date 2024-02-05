export default function AuthModal({ isShown }) {
    return (
        <div className="flex fixed h-full w-full z-10 justify-center items-center bg-black bg-opacity-50" onClick={() => isShown(false)}>
            <div className="flex w-1/3 h-1/5 justify-center items-center bg-white rounded-lg shadow-md">
                <h1 className="font-bold text-4xl">Login Success</h1>
            </div>
        </div>
    )
}