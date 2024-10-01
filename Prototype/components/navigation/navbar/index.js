'use client'
import React, { useState, useEffect } from 'react';
import GraduateProfile from "@/components/graduateProfile";
import {useSemester} from "@/providers/SemesterProvider";

const Navbar = () => {
    const {handleAddNode, graduateProfiles, handleHighlightPathConnections, setSelectedGraduateProfile, selectedGraduateProfile, superEditing} = useSemester();
    const [navbarOpen, setNavbarOpen] = useState(false);

    const handleClickGraduateProfile = (graduateProfile) => {
        setSelectedGraduateProfile(null);
        if(selectedGraduateProfile && selectedGraduateProfile.id === graduateProfile.id) {
            setSelectedGraduateProfile(null);
            handleHighlightPathConnections(null);
        }
        else setSelectedGraduateProfile(graduateProfile);
        handleHighlightPathConnections(graduateProfile);
    }

    return (
        <div
            className={`min-w-[312px] fixed top-0 left-0 p-[20px] z-[100] md:border-r-[1px] border-[#e5e5e5] shadow-md md:w-1/5 w-full ${navbarOpen ? "h-[100vh]" : "h-[75px]"} md:h-[100vh] bg-[#fff] box-border flex flex-col gap-[50px] justify-start align-middle items-center`}>
            <div
                className={"w-full h-[75px] md:h-auto justify-between md:justify-center align-middle items-center flex flex-row flex-wrap gap-[25px] md:gap-[10px]"}>
                <div className={"relative md:w-full w-auto flex flex-row md:gap-[25px] gap-[15px] justify-start align-middle items-center"}>
                    <img src={"./hbo-ict-logo.jpg"} className={"md:w-[50px] md:h-[50px] w-[40px] h-[40px]"}
                         alt={"logo"}/>
                    <h1 className={"text-lg md:text-2xl font-normal flex md:flex-row md:gap-[10px] justify-center align-middle items-center"}>
                        Keuzewijzer
                        <span
                            className={"absolute font-black left-[25px] top-[30px] w-auto h-[20px] md:h-[25px] text-[8px] md:text-[12px] flex justify-center align-middle items-center text-white bg-blue-500 p-[5px] box-border rounded-[8px]"}>BETA</span>
                    </h1>
                </div>
                <div
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className={"flex md:hidden flex-col justify-evenly items-center gap-[4px] cursor-pointer"}
                >
                    <div
                        className={`w-[25px] h-[3px] bg-[#666] rounded-[4px] transition-transform duration-300 ${navbarOpen ? "rotate-45 translate-y-[7.10px]" : ""}`}
                    ></div>
                    <div
                        className={`w-[25px] h-[3px] bg-[#666] rounded-[4px] transition-opacity duration-300 ${navbarOpen ? "opacity-0" : "opacity-100"}`}
                    ></div>
                    <div
                        className={`w-[25px] h-[3px] bg-[#666] rounded-[4px] transition-transform duration-300 ${navbarOpen ? "-rotate-45 -translate-y-[7.10px]" : ""}`}
                    ></div>
                </div>

            </div>
            <div
                className={`w-full h-full md:flex ${navbarOpen ? "flex" : "hidden"} flex-col justify-start align-middle items-center gap-[25px]`}>
                <div className={"w-full h-auto flex-col gap-[10px] flex justify-center align-middle items-center"}>
                    <p className={"text-[14px] font-bold w-full"}>Selecteer een afstudeerprofiel</p>
                    {graduateProfiles ? Object.values(graduateProfiles).map((graduateProfile, index) => {
                        return (
                            <GraduateProfile
                                key={"graduate-pf-" + index}
                                id={"graduate-pf-" + graduateProfile.id}
                                label={graduateProfile.label}
                                color={graduateProfile.color}
                                onClick={() => handleClickGraduateProfile(graduateProfile)}
                                selected={!!(selectedGraduateProfile && selectedGraduateProfile.id === graduateProfile.id)}
                            />
                        )
                    }) : (
                        <div className={"w-full h-auto gap-[10px] flex justify-center align-middle items-center flex-col"}>
                            <div className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"}></div>
                            <div className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"}></div>
                            <div className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"}></div>
                            <div className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"}></div>
                            <div className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"}></div>
                            <div className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"}></div>
                        </div>
                    )}
                </div>

                {superEditing && (
                    <button
                        className="hover:brightness-95 w-full mt-auto bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-[50px] text-black flex justify-center align-middle items-center flex-row gap-[10px]"
                        onClick={() => handleAddNode()}
                    >
                        <div className={"w-[25px] h-[20px] border-[3px] border-[#666] rounded-[4px]"}></div>
                        <p className={"text-[14px] text-[#666] font-bold"}>Nieuw semester</p>
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar;