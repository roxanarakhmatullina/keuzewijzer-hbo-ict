'use client'
import React, {useEffect, useState} from 'react'

const Label = ({children, text, info, required}) => {
    const [hoverInfo, setHoverInfo] = useState(false);

    return (
        text && (
            <label className="relative w-full font-bold text-black flex flex-row gap-[5px]">{text} {required && "*"}
                {info && <div
                    onMouseEnter={() => setHoverInfo(true)}
                    onMouseLeave={() => setHoverInfo(false)}
                    className={"relative cursor-pointer w-[15px] h-[15px] top-[-5px] text-[11px] rounded-full border-[1px] border-black flex justify-center align-middle items-center"}>?</div>}
                {hoverInfo && (
                    <div
                        onMouseEnter={() => setHoverInfo(true)}
                        onMouseLeave={() => setHoverInfo(false)}
                        className={"absolute z-[10] w-auto md:max-w-[300px] max-w-[calc(100%-20px)] top-[0px] left-[0px] bg-white border-[1px] border-gray-300 shadow-lg shadow-black/30 p-[10px] rounded-md"}>
                        <div className={"text-black text-sm font-normal"}><b>{text}</b><br/>{info()}</div>
                    </div>
                )}

                {children}
            </label>
        )
    )
}

export default Label;