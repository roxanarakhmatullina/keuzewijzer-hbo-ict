'use client'
import React, {use, useEffect, useState} from 'react'
import {useGoogleAnalytics, useGraduateProfile, useStudyYear} from "@/hooks";
import Logo from "@/icons/logo";
import StartStudy from "@/components/navigation/startStudy";
import Link from "next/link";
import Retry from "@/icons/retry";
import MenuIcon from "@/icons/menu";
import GraduateProfiles from "@/components/navigation/graduateProfiles";

const Navigation = () => {
    const [navbarOpen, setNavbarOpen] = useState(true);
    const {graduateProfiles, selectedGraduateProfile, setSelectedGraduateProfile} = useGraduateProfile();
    const {startedStudyYear, setStartedStudyYear} = useStudyYear();

    return (
        <div
            className={`top-0 overflow-y-auto overflow-x-hidden max-w-[100vw] left-0 fixed md:sticky-position md:sticky flex ${!selectedGraduateProfile ? "md:w-screen" : "md:w-1/5 md:min-w-[250px] md:max-h-screen"} z-[100] ${navbarOpen ? "min-h-full h-full" : "h-[75px]"} w-screen md:min-h-dvh h-auto bg-white shadow-lg ${navbarOpen ? "p-[20px] flex-col overflow-y-auto" : "p-[10px] pl-[20px] pr-[20px] md:p-[20px] flex-col"} box-border justify-between gap-[25px] align-middle items-center`}>
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
                    <MenuIcon color={"#424242"}/>
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
                                className={"w-full text-[13px] text-left md:text-center font-bold box-border flex justify-between items-center align-middle"}>
                                Gestart in {startedStudyYear?.name}
                            </p>
                            <div
                                className={"w-[30px] h-[30px] flex justify-center align-middle items-center p-[7px] bg-transparent rounded-full"}>
                                <Retry/>
                            </div>
                        </button>
                    )}

                    {/* Graduate profiles */}
                    {startedStudyYear && graduateProfiles && (
                        <GraduateProfiles setNavbarOpen={setNavbarOpen}/>
                    )}
                </div>

                <StartStudy navbarOpen={navbarOpen}/>
            </div>
            <div className={`${navbarOpen ? "flex" : "hidden md:flex"} flex-col text-[14px] text-[#424242] text-center gap-[0.5ch] justify-center items-center`}>
                <p>&copy; {new Date().getFullYear()} keuzewijzerhboict.nl. Aan deze website kunnen geen rechten worden ontleend.</p>
                <div className={"flex flex-row gap-[10px] justify-center align-middle items-center"}>
                    <Link className="text-[#124477] underline hover:text-[#092A3B] focus:text-[#092A3B] gap-[0.5ch]"
                          href="https://www.windesheim.nl/over-windesheim/disclaimer">Disclaimer</Link>
                    <div className={"h-[15px] w-[1px] bg-[#424242]"}/>
                    <Link className={"text-[#124477] underline hover:text-[#092A3B] focus:text-[#092A3B] gap-[0.5ch]"}
                          href={"/privacy-policy"}>Privacyverklaring</Link>
                </div>
            </div>
        </div>
    )
}

export default Navigation;