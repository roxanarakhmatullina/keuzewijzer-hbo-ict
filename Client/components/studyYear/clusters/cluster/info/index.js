'use client'
import React, {useRef} from 'react';

const ClusterInfo = ({hoverLink, link}) => {
    const pos = useRef(null);

    return (
        hoverLink && (
            <div
                ref={pos}
                className={"cluster-info hidden md:flex w-auto text-[12px] shadow-lg font-bold text-center min-w-[200px] h-auto bg-[#222] rounded-[8px] p-[10px] box-border absolute bottom-[calc(100%+10px)] z-[100] text-white justify-center align-middle items-center"}>
                {link ? "Klik voor meer informatie" : "Op dit moment is er geen informatie beschikbaar"}
                <div className={"w-[20px] h-[20px] bg-[#222] rounded-[2px] absolute bottom-[-5px] z-[-1] left-[50%] shadow-lg translate-x-[-50%] rotate-45"}/>
            </div>
        )
    )
}

export default ClusterInfo;
