import { useState, useEffect } from "react";

export default function TagGroup({ mainTag, subTag, addToList }) {
    const [weightList, setWeightList] = useState({});

    useEffect(() => {
        let wL = subTag.reduce((acc, sT) => {
            acc[sT] = 0;
            return acc;
        }, {});
        setWeightList(wL);
    }, []);

    const handleSliderChange = (e) => {
        const tagName = e.target.name;
        const tagWeight = e.target.value;

        setWeightList(prev => ({
            ...prev,
            [tagName]: tagWeight
        }));
    }

    return (
        <div className="flex flex-col p-2 gap-2 justify-center rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">{mainTag}</h1>
            <div className="flex flex-col p-2 gap-2">
                {subTag.map((sT) => (
                    <div className="flex flex-row gap-2 items-center">
                        <div className="flex p-2 w-1/3 justify-center items-center bg-slate-200 rounded-lg shadow-md">
                            <h1 className="text-sm text-black font-bold select-none truncate">{sT}</h1>
                        </div>
                        <input
                            type="range"
                            name={sT}
                            min="0"
                            max="5"
                            onChange={handleSliderChange}
                            step="0.5"
                            className="w-2/3 h-full bg-slate-600 rounded-lg cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}