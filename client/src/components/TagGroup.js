import Label from "./Label";

export default function TagGroup({ mainTag, subTag }) {
    const addToList = (name) => {

    }

    return (
        <div className="flex flex-col p-2 gap-2 items-center rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">{mainTag}</h1>
            <div className="flex flex-col p-2 gap-2">
                {subTag.map((sT) => (
                    <Label name={sT} remove={addToList} isBold={true} />
                ))}
            </div>
        </div>
    )
}