'use client'
import React, { useState } from 'react'
import { useGraduateProfile, useStudyYear, useLocation } from "@/hooks";
import Logo from "@/icons/logo";
import StartStudy from "@/components/navigation/startStudy";
import Locations from "@/components/navigation/locations";
import Retry from "@/icons/retry";
import MenuIcon from "@/icons/menu";
import GraduateProfiles from "@/components/navigation/graduateProfiles";
import NavigationFooter from "@/components/navigation/footer";

const Navigation = () => {
    const [navbarOpen, setNavbarOpen] = useState(true);
    const { graduateProfiles, selectedGraduateProfile, setSelectedGraduateProfile } = useGraduateProfile();
    const { startedStudyYear, setStartedStudyYear } = useStudyYear();
    const { location, setLocation, availableLocations, setAvailableLocations } = useLocation();

    console.log("navbar", navbarOpen);

    return (
        <div
            className={`top-0 overflow-y-auto overflow-x-hidden max-w-[100vw] left-0 fixed md:sticky-position md:sticky flex ${!selectedGraduateProfile ? "md:w-screen" : "md:w-1/5 md:min-w-[250px] md:max-h-screen"} z-[100] ${navbarOpen ? "min-h-full h-full" : "h-[75px]"} w-screen md:min-h-dvh h-auto bg-white shadow-lg ${navbarOpen ? "p-[20px] flex-col overflow-y-auto" : "p-[10px] pl-[20px] pr-[20px] md:p-[20px] flex-col"} box-border justify-between gap-[25px] align-middle items-center`}>
            <div
                className={`w-full h-auto flex gap-[50px] justify-start align-middle items-center md:flex-col ${selectedGraduateProfile ? "md:mt-0" : "mt-[50px]"} ${navbarOpen ? "mt-[50px] flex-col" : "mt-0 justify-between flex-row"}`}>
                <div
                    className={`md:w-full w-full flex flex-row ${!selectedGraduateProfile ? "md:justify-center scale-[1.5]" : "scale-[1.5] md:scale-[1] md:justify-start"} ${navbarOpen ? "scale-[1.5] justify-center" : "justify-start scale-[1]"} align-middle items-center gap-[10px] box-border`}>
                    <Logo />
                    <div className="flex flex-col">
                        <h1 className={"text-xl font-bold"}>Keuzewijzer</h1>
                        {location && location.name && (
                            <button className="flex flex-row" onClick={() => {
                                setLocation(null); // Reset location to go back to location selection
                                if (setSelectedGraduateProfile) {
                                    setSelectedGraduateProfile(null); // Reset graduate profile if the function exists
                                }
                                setNavbarOpen(true); // Open the location menu
                            }}>  {/* Updated onClick to reset location and graduate profile */}
                                <div className="flex flex-row items-center gap-[5px]">  {/* Added items-center for alignment and reduced gap */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#D9D9D9"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        className=""
                                    >
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                    </svg>
                                    <p className={"text-[16px] text-[#D9D9D9]"}>{location.name}</p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className={`relative ${navbarOpen ? "hidden" : "flex"} md:hidden w-auto p-[10px] box-border hover:bg-[#f3f3f3] rounded-[12px] justify-center align-middle items-center gap-[10px]`}>
                    <MenuIcon color={"#424242"} />
                </div>

                <div className={`${navbarOpen ? "flex md:flex" : "hidden md:flex"} w-full justify-center align-middle items-center flex-col gap-[15px]`}>
                    {startedStudyYear && (
                        <button
                            onClick={() => {
                                setSelectedGraduateProfile(null);
                                setStartedStudyYear(null);
                                setLocation(null);
                            }}
                            className={`w-full md:max-w-[300px] hover:brightness-95 cursor-pointer flex flex-row gap-[10px] justify-between bg-[#EFEFEFFF] p-[10px] box-border rounded-[8px] align-middle items-center border-0`}>
                            <p
                                className={"w-full text-[13px] text-left md:text-center font-bold box-border flex justify-between items-center align-middle"}>
                                Gestart in {startedStudyYear?.name}
                            </p>
                            <div
                                className={"w-[30px] h-[30px] flex justify-center align-middle items-center p-[7px] bg-transparent rounded-full"}>
                                <Retry />
                            </div>
                        </button>
                    )}
                    {/* Location */}
                    {startedStudyYear && (
                        <Locations navabrOpen={navbarOpen} />
                    )}
                    {/* Graduate profiles */}
                    {startedStudyYear && location && graduateProfiles && (
                        <GraduateProfiles setNavbarOpen={setNavbarOpen} />
                    )}
                </div>

                <StartStudy navbarOpen={navbarOpen} />
            </div>
            <NavigationFooter />
        </div>
    )
}

export default Navigation;