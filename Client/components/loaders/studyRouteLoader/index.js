'use client'
import React from 'react';
import StudyYear from "@/components/studyYear";

const StudyRouteLoader = () => {
    
    const studyYears = [
        {
            year: "",
            firstSemester: [
                {
                    id: 1,
                    name: "",
                },
            ],
            lastSemester: [
                {
                    id: 2,
                    name: "",
                },
           ],
        },

        {
            year: "",
            firstSemester: [
                {
                    id: 1,
                    name: "",
                },
            ],
            lastSemester: [
                {
                    id: 2,
                    name: "",
                },
                {
                    id: 3,
                    name: "",
                },
            ],
        },

        {
            year: "",
            firstSemester: [
                {
                    id: 1,
                    name: "",
                },
            ],
            lastSemester: [
                {
                    id: 2,
                    name: "",
                },
            ],
        },

        {
            year: "",
            firstSemester: [
                {
                    id: 1,
                    name: "",
                },
            ],
            lastSemester: [
                {
                    id: 2,
                    name: "",
                },
            ],
        },
    ]
    const color = "#D1D5DB";
    
    return (
        <>
            {studyYears && studyYears.length > 0 && studyYears.map((studyYear, index) => {
                return (
                    <React.Fragment key={"study-year-" + index}>
                        <StudyYear
                            year={studyYear?.year}
                            firstClusters={studyYear?.firstSemester}
                            secondClusters={studyYear?.lastSemester}
                            studyYears={studyYears}
                            isLastStudyYear={index === studyYears.length - 1}
                            isEndOfRow={index % 2 === 1 && index !== studyYears.length - 1}
                        >
                            {/* Line from right side to bottom */}
                            {index % 2 === 1 && index !== studyYears.length - 1 && (
                                <div
                                    style={{backgroundColor: color}}
                                    className={`ease-in-out duration-200 hidden lg:flex absolute top-[calc(50%-5px)] right-0 w-[10px] h-[calc(50%+5px)] bg-[${color}] box-border`}>
                                </div>
                            )}

                            {/* Line from left side to bottom */}
                            {index % 2 === 0 && index !== studyYears.length - 1 && index !== 0 && (
                                <div
                                    style={{backgroundColor: color}}
                                    className={`ease-in-out duration-200 hidden lg:flex absolute bottom-[calc(50%-5px)] left-[32.5px] w-[10px] h-[calc(50%+5px)] bg-[${color}] box-border`}>
                                </div>
                            )}
                        </StudyYear>

                        {/* Horizontal line */}
                        {index % 2 === 1 && index !== studyYears.length - 1 && (
                            <div className={"hidden pt-[50px] m-0 pb-[50px] lg:flex w-full justify-center align-middle items-center z-[1]"}>
                                <div
                                    style={{backgroundColor: color, transition: "ease-in-out duration-200 background-color"}}
                                    className={`absolute left-[52.5px] xl:left-[82.5px] h-[10px] w-[calc(100%-72.5px)] xl:w-[calc(100%-132.5px)] bg-[${color}] box-border`}>
                                    <div
                                        style={{backgroundColor: color, transition: "ease-in-out duration-200 background-color"}}
                                        className={"w-[10px] h-[55px] absolute left-0"}/>

                                    <div
                                        style={{backgroundColor: color, transition: "ease-in-out duration-200 background-color"}}
                                        className={"w-[10px] h-[55px] absolute right-[0px] bottom-1/2"}/>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                )
            })}
        </>
    )
}

export default StudyRouteLoader;