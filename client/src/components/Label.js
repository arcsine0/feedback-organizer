export default function Label({ name, remove }) {
    return (
        <div onClick={() => remove(name)} className="flex p-2 justify-center items-center bg-slate-200 rounded-lg shadow-md cursor-pointer">
            <h1 className="text-sm font-bold text-black select-none">{name}</h1>
        </div>
    )
}