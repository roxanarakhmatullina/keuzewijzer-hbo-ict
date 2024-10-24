'use client'
import React, {useEffect} from 'react'

const StartStudy = ({startedStudyYear, availableStudyYears, setCurrentSavedStudyYear, currentSavedStudyYear, selectedGraduateProfile, setStartedStudyYear}) => {

    useEffect(() => {
        if(startedStudyYear && startedStudyYear !== "2024") {
            window.location.href = "https://keuzewijzerhboict.nl/";
        }
    }, [startedStudyYear])

    return (
        <div
            className={"w-full md:max-w-[300px] h-auto flex flex-col gap-[25px] justify-center align-middle items-center"}>

            {!startedStudyYear && (
                <>
                    <p className={"w-full text-left md:text-center font-bold"}>Wanneer ben je gestart met je studie?</p>
                    <div className={"w-full h-auto flex flex-col gap-[10px] justify-center align-middle items-center"}>
                        {availableStudyYears && availableStudyYears.map((studyYear, index) => (
                            <div key={index} onClick={() => setCurrentSavedStudyYear(studyYear)}
                                 className={"hover:brightness-95 w-full h-[50px] bg-[#f3f3f3] rounded-[12px] p-[10px] box-border cursor-pointer flex justify-start flex-row gap-[10px] align-middle items-center"}>
                                <div
                                    className={"w-[25px] h-[25px] border-[3px] box-border border-[#124477] bg-transparent rounded-full flex justify-center align-middle items-center"}>
                                    <div
                                        className={`${currentSavedStudyYear === studyYear ? "w-[15px] h-[15px]" : "w-[0px] h-[0px]"} ease-in-out duration-300 rounded-full bg-[#124477]`}/>
                                </div>
                                <p className={"text-[#124477] text-[14px] font-bold"}>{studyYear}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {(!startedStudyYear && !selectedGraduateProfile) && (
                <button
                    onClick={() => currentSavedStudyYear && !selectedGraduateProfile && setStartedStudyYear(currentSavedStudyYear)}
                    className={`hover:brightness-95 w-full h-[50px] font-bold ${currentSavedStudyYear && !selectedGraduateProfile ? "bg-[#124477] text-white" : "bg-[#e5e5e5] pointer-events-none text-[#c5c5c5]"} rounded-[12px] p-[10px] box-border`}>Volgende</button>
            )}
        </div>
    )
}

export default StartStudy;