'use client'
import React, {useEffect} from 'react'
import {useApi} from "@/providers/ApiProvider";
import {useContextProvider} from '@/providers/ContextProvider';
import SkeletonLoader from "@/components/loaders/skeletonLoader";

const StartStudy = ({navbarOpen}) => {
    const {availableStudyYears, errors} = useApi();
    const {selectedGraduateProfile, startedStudyYear, setStartedStudyYear, currentSavedStudyYear, setCurrentSavedStudyYear} = useContextProvider();
    useEffect(() => {
        if(startedStudyYear !== null && startedStudyYear?.length !== 4) {
            window.location.href = "https://keuzewijzerhboict.nl/v1";
            setStartedStudyYear(null);
        }
    }, [startedStudyYear])

    const handleKeyDown = (event, studyYear) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setCurrentSavedStudyYear(studyYear); // Simulate the onClick action
        }
    };

    return (
        <div
            className={`${navbarOpen ? "flex md:flex" : "hidden md:flex"} w-full md:max-w-[300px] h-auto flex flex-col gap-[15px] justify-center align-middle items-center`}>

            {!startedStudyYear && (
                <>
                    <p className={"w-full text-center font-bold"}>Wanneer ben je gestart met je studie?</p>
                    <div className={"w-full h-auto flex flex-col gap-[10px] justify-center align-middle items-center box-border rounded-[12px]"}>
                        {availableStudyYears && availableStudyYears.length > 0 ? availableStudyYears.map((studyYear, index) => (
                            <div key={index} onClick={() => setCurrentSavedStudyYear(studyYear)} onKeyDown={(event) => handleKeyDown(event, studyYear)} // Handle keyboard events
                            tabIndex={0} // Make div focusable via Tab key
                                 className={"hover:brightness-95 w-full h-[50px] bg-[#f3f3f3] rounded-[12px] p-[10px] box-border cursor-pointer flex justify-start flex-row gap-[10px] align-middle items-center"}>
                                <div
                                    className={"w-[25px] h-[25px] border-[3px] box-border border-[#124477] bg-transparent rounded-full flex justify-center align-middle items-center"}>
                                    <div
                                        className={`${currentSavedStudyYear === studyYear ? "w-[15px] h-[15px]" : "w-[0px] h-[0px]"} ease-in-out duration-300 rounded-full bg-[#124477]`}/>
                                </div>
                                <p className={"text-[#124477] text-[14px] font-bold"}>{studyYear}</p>
                            </div>
                        )) : (
                            <SkeletonLoader/>
                        )}


                        {errors && errors.length > 0 && (
                            errors.filter(error => error.type === "studyyears").map((error) => (
                                <div key={error.id} className={"w-full h-auto p-[20px] border-[1px] border-[#c00c00] bg-[rgba(255,0,0,0.1)] rounded-[12px] box-border"}>
                                    {error.message}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {(!startedStudyYear && !selectedGraduateProfile) && (
                <button
                onClick={() => currentSavedStudyYear && !selectedGraduateProfile && setStartedStudyYear(currentSavedStudyYear)}
                className={`hover:brightness-95 w-full h-[50px] font-bold ${currentSavedStudyYear && !selectedGraduateProfile 
                    ? "bg-[#124477] text-white" 
                    : "bg-[#e5e5e5] pointer-events-none text-[#888888]"} rounded-[12px] p-[10px] box-border`}
                aria-disabled={!currentSavedStudyYear || selectedGraduateProfile}
                aria-label={currentSavedStudyYear && !selectedGraduateProfile 
                    ? "Proceed to the next step" 
                    : "You must select a study year and graduate profile to proceed"}
            >
                Volgende
            </button>
            )}
        </div>
    )
}

export default StartStudy;