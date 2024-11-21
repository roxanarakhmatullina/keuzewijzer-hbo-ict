'use client'
import React from 'react'

const skeletonLoader = () => {
    return (
        <div className="w-full h-auto flex flex-col gap-[10px] pt-[10px] pb-[10px] box-border">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="w-full h-[50px] rounded-[12px] bg-[#e5e5e5] animate-pulse p-[10px] box-border flex justify-start align-middle items-center flex-row gap-[10px]">
                    <div className={"w-[25px] h-[25px] border-[3px] rounded-full border-[#999] animate-pulse]"}/>
                    <div className={"w-[75px] h-[20px] bg-[#999] animate-pulse rounded-lg"}/>
                </div>
            ))}
        </div>
    )
}

export default skeletonLoader;