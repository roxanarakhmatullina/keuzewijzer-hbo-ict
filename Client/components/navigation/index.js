'use client'
import React, {useState} from 'react'
import {useApi} from "@/providers/ApiProvider";
import Logo from "@/components/logo";
import StartStudy from "@/components/navigation/startStudy";
import Link from "next/link";
import Retry from "@/icons/retry";
import GraduateProfile from "@/components/navigation/graduateProfile";

const Navigation = () => {
    const [navbarOpen, setNavbarOpen] = useState(true);
    const {graduateProfiles, selectedGraduateProfile, setSelectedGraduateProfile, startedStudyYear, setStartedStudyYear, errors} = useApi();

    return (
        <div
            className={`top-0 overflow-y-auto overflow-x-hidden max-w-[100vw] left-0 fixed md:sticky-position md:sticky flex ${!selectedGraduateProfile ? "w-screen" : "w-screen md:w-1/5 md:min-w-[312px] md:max-h-screen"} z-[100] ${navbarOpen ? "min-h-screen h-full" : "h-[75px]"} md:min-h-screen bg-white shadow-lg ${navbarOpen ? "p-[20px] flex-col overflow-y-auto" : "p-[10px] pl-[20px] pr-[20px] md:p-[20px] flex-col"} box-border justify-between gap-[25px] align-middle items-center`}>
            <div
                className={`w-full h-auto flex gap-[50px] justify-start align-middle items-center md:flex-col ${selectedGraduateProfile ? "md:mt-0" : "mt-[50px]"} ${navbarOpen ? "mt-[50px] flex-col" : "mt-0 justify-between flex-row"}`}>
                <div
                    className={`md:w-full w-full flex flex-row ${!selectedGraduateProfile ? "md:justify-center scale-[1.5]" : "scale-[1.5] md:scale-[1] md:justify-start"} ${navbarOpen ? "scale-[1.5] justify-center" : "justify-start scale-[1]"} align-middle items-center gap-[10px] box-border`}>
                    <Logo/>
                    <h1 className={"text-xl font-bold"}>Keuzewijzer</h1>
                </div>

                <div
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className={`relative ${navbarOpen ? "hidden" : "flex"} md:hidden w-auto p-[10px] box-border hover:bg-[#f3f3f3] rounded-[12px] justify-center align-middle items-center gap-[10px]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-menu">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>

                <div className={`${navbarOpen ? "flex md:flex" : "hidden md:flex"} w-full justify-center align-middle items-center flex-col gap-[15px]`}>
                    {startedStudyYear && (
                        <button
                            onClick={() => {
                                setSelectedGraduateProfile(null);
                                setStartedStudyYear(null);
                            }}
                            className={`w-full md:max-w-[300px] hover:brightness-95 cursor-pointer flex flex-row gap-[10px] justify-between bg-[#EFEFEFFF] p-[10px] box-border rounded-[8px] align-middle items-center border-0`}>
                            <p
                                className={"w-full text-[14px] text-left md:text-center font-bold box-border flex justify-between items-center align-middle"}>
                                Gestart in {startedStudyYear}
                            </p>
                            <div
                                className={"w-[30px] h-[30px] flex justify-center align-middle items-center p-[7px] bg-transparent rounded-full"}>
                                <Retry/>
                            </div>
                        </button>
                    )}

                    {/* Graduate profiles */}
                    {startedStudyYear && graduateProfiles && (
                        <div
                            className={`flex w-full md:max-w-[300px] h-auto flex-col gap-[15px] justify-center align-middle items-center`}>
                            <p className={`w-full text-center ${selectedGraduateProfile && "md:text-left"} font-bold`}>
                                Selecteer een afstudeerprofiel:
                            </p>

                            {/* Profiles */}
                            <div
                                className={"w-full h-auto flex flex-col gap-[10px] box-border justify-center align-middle items-center"}>
                                {graduateProfiles && graduateProfiles.length > 0 && graduateProfiles.map((graduateProfile) => (
                                    <GraduateProfile key={graduateProfile.id} {...graduateProfile} />
                                ))}

                                {errors && errors.length > 0 && (
                                    errors.filter(error => error.type === "profiles").map((error) => (
                                        <div key={error.id}
                                             className={"w-full h-auto p-[20px] border-[1px] border-[#c00c00] bg-[rgba(255,0,0,0.1)] rounded-[12px] box-border"}>
                                            {error.message}
                                        </div>
                                    ))
                                )}
                            </div>

                            <button
                                onClick={() => setNavbarOpen(false)}
                                className={`md:hidden hover:brightness-95 w-full h-[50px] font-bold ${selectedGraduateProfile ? "bg-[#124477] text-white" : "bg-[#e5e5e5] pointer-events-none text-[#c5c5c5]"} rounded-[12px] p-[10px] box-border`}>Volgende</button>
                        </div>
                    )}
                </div>

                <StartStudy navbarOpen={navbarOpen}/>
            </div>
            <p className={`${navbarOpen ? "block" : "hidden md:block"} flex-row text-[14px] text-[#424242] text-center`}>
                Aan deze website kunnen geen rechten worden
                ontleend. <Link className={"text-black"}
                                href={"https://www.windesheim.nl/over-windesheim/disclaimer"}>Disclaimer</Link>
            </p>
        </div>
    )
}

export default Navigation;