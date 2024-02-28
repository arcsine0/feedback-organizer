import { useState, useEffect } from "react";

export default function TagGroup({ order, handleOrder, mainTag, subTag, addToList, isNew }) {
    const [weightList, setWeightList] = useState({});

    useEffect(() => {
        let wL;
        if (isNew) {
            wL = subTag.reduce((acc, sT) => {
                acc[sT.name] = (10 / subTag.length).toFixed(2);
                return acc;
            }, {});
        } else {
            wL = subTag.reduce((acc, sT) => {
                acc[sT.name] = sT.weight;
                return acc;
            }, {});
        }
        
        setWeightList(wL);

        const subTags = Object.entries(wL).map(([name, weight]) => ({
            name,
            weight,
          }));
        
        const finalWeightList = {
            mainTag: mainTag,
            subTag: subTags
        };

        addToList(finalWeightList);
    }, []);

    const handleSliderChange = (e) => {
        const tagName = e.target.name;
        const tagWeight = e.target.value;

        const newWeightList = {
            ...weightList,
            [tagName]: parseFloat(tagWeight).toFixed(2)
        };

        setWeightList(newWeightList);

        const subTags = Object.entries(newWeightList).map(([name, weight]) => ({
            name,
            weight,
          }));
        
        const finalWeightList = {
            mainTag: mainTag,
            subTag: subTags
        };

        addToList(finalWeightList);
    }

    return (
        <div className="flex flex-col p-2 gap-2 justify-center rounded-lg shadow-md">
            <div onClick={() => handleOrder(mainTag)} className="flex flex-row px-2 mt-2 items-center cursor-pointer select-none">
                <h1 className="order-first text-2xl font-bold">{mainTag}</h1>
                <span className="grow"></span>
                <div className="order-last flex size-fit py-1 px-2 font-bold bg-slate-200 rounded-md">{order}</div>
            </div>
            <div className="flex flex-col p-2 gap-2">
                {subTag.map((sT, i) => (
                    <div key={i} className="flex flex-row gap-2 items-center">
                        <div className="flex p-2 w-1/3 justify-center items-center bg-slate-200 rounded-lg shadow-md">
                            <h1 className="text-sm text-black font-bold select-none truncate">{sT.name}</h1>
                        </div>
                        <input
                            type="range"
                            name={sT.name}
                            min="0"
                            max="10"
                            step="0.5"
                            value={weightList[sT.name]}
                            onChange={handleSliderChange}
                            className="w-2/3 h-full bg-slate-600 rounded-lg cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}