'use client'
import React from 'react';

const GraduateProfile = ({id, label, color, onClick, selected}) => {
    const handleClick = (e) => {
        if(!e.target.closest(".context")) {
            onClick();
        }
    }

    const fadingColor = (color) => {
        // if color is not a hex value make it one and put + 50 on the value
        if(color[0] !== "#") {
            color = "#" + color;
        }
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        let a = 0.25;

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return (
        <button
            id={"graduate-pf-" + id}
            style={{backgroundColor: selected ? fadingColor(color) : "#f3f3f3"}}
            onClick={(e) => handleClick(e)}
            className={`hover:brightness-95 w-full rounded-[12px] p-[10px] box-border h-[50px] flex justify-start align-middle items-center flex-row gap-[10px]`}>
            <div
                className={`w-[25px] h-[25px] rounded-full flex justify-center align-middle items-center border-[3px] ${selected && `bg-[${color}]`}`}
                style={{borderColor: color}}>
                <div
                    className={"w-[15px] h-[15px] rounded-full"}
                    style={{backgroundColor: selected ? color : "transparent"}}>
                </div>
            </div>
            <p
                className={"text-[12px] font-bold text-left"}>{label}</p>

        </button>
    )
}

export default GraduateProfile;