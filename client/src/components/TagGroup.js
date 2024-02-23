import Label from "./Label";

export default function TagGroup({ mainTag, subTag, addToList }) {
    const add = (name) => {
        addToList(name);
    }

    return (
        <div className="flex flex-col p-2 gap-2 justify-center rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">{mainTag}</h1>
            <div className="flex flex-col p-2 gap-2">
                {subTag.map((sT) => (
                    <Label name={sT} remove={add} isBold={true} />
                ))}
            </div>
        </div>
    )
}