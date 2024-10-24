'use client'
import React from 'react'

const GraduateProfile = ({name, color, setSelectedGraduateProfile, selectedGraduateProfile}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleHover = () => {
        setIsHovered(!isHovered);
    }

    const handleShadeColor = () => {
        // make it an opacity of 0.1 of the original color
        const newColor = color.replace("#", "");
        const r = parseInt(newColor.substring(0, 2), 16);
        const g = parseInt(newColor.substring(2, 4), 16);
        const b = parseInt(newColor.substring(4, 6), 16);

        return `${r},${g},${b},0.3`;
    }

    return (
        <div
            // on hover
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}

            // also for mobile
            onTouchStart={handleHover}
            onTouchEnd={handleHover}

            onClick={() => setSelectedGraduateProfile({name, color})}
            style={{backgroundColor: (selectedGraduateProfile?.name === name || isHovered) ? `rgba(${handleShadeColor()})` : "#EFEFEFFF"}}
            className={`w-full cursor-pointer ease-in-out  h-[50px] flex justify-start align-middle items-center gap-[10px] p-[10px] rounded-lg box-border`}>
            <div
                style={{borderColor: color}}
                className={`min-w-[25px] min-h-[25px] border-[3px] rounded-full overflow-hidden flex justify-center align-middle items-center`}>
                <div
                    style={{backgroundColor: color}}
                    className={`${selectedGraduateProfile?.name === name ? "w-[15px] h-[15px]" : "w-[0px] h-[0px]"} duration-300 ease-in-out rounded-full`}/>
            </div>
            <p className={"text-left text-[13px] font-bold flex-auto"}>{name}</p>
        </div>
    )
}

export default GraduateProfile;