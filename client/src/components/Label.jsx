export default function Label({ name, remove, isBold }) {
    return (
        <div onClick={() => remove(name)} className="flex p-2 justify-center items-center bg-slate-200 rounded-lg shadow-md cursor-pointer">
            <span className={isBold ? "font-bold" : ""}>
                <h1 className="text-sm text-black select-none line-clamp-3">{name}</h1>
            </span>
        </div>
    )
}