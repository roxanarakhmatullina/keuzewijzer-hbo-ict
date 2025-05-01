'use client';
import React, { useEffect } from 'react';
import { useGraduateProfile } from "@/hooks";

const GraduateProfile = ({ id, name, color }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const { selectedGraduateProfile, setSelectedGraduateProfile } = useGraduateProfile();

    const handleHover = () => setIsHovered(!isHovered);

    const handleShadeColor = () => {
        const newColor = color.replace("#", "");
        const r = parseInt(newColor.substring(0, 2), 16);
        const g = parseInt(newColor.substring(2, 4), 16);
        const b = parseInt(newColor.substring(4, 6), 16);
        return `${r},${g},${b},0.3`;
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            setSelectedGraduateProfile({ id, name, color });
        }
    };

    return (
        <div
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
            onTouchStart={handleHover}
            onTouchEnd={handleHover}
            onClick={() => setSelectedGraduateProfile({ id, name, color })}
            onKeyDown={handleEnterKey}
            tabIndex={0}
            role="button"
            aria-pressed={selectedGraduateProfile?.name === name}
            style={{
                backgroundColor:
                    selectedGraduateProfile?.name === name || isHovered
                        ? `rgba(${handleShadeColor()})`
                        : "#EFEFEFFF",
            }}
            className="w-full cursor-pointer ease-in-out h-[50px] flex justify-start items-center gap-[10px] p-[10px] rounded-lg box-border"
        >
            <div
                style={{ borderColor: color }}
                className="min-w-[25px] min-h-[25px] border-[3px] rounded-full flex items-center justify-center"
            >
                <div
                    style={{ backgroundColor: color }}
                    className={`${
                        selectedGraduateProfile?.name === name
                            ? "w-[15px] h-[15px]"
                            : "w-[0px] h-[0px]"
                    } duration-300 ease-in-out rounded-full`}
                />
            </div>
            <p className="text-left text-[13px] font-bold flex-auto">{name}</p>
        </div>
    );
};

export default GraduateProfile;
