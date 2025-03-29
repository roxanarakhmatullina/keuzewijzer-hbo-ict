'use client';
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import { useError, useGraduateProfile, useStudyYear } from "@/hooks";
import { api } from "@/hooks/api";
import StudyRouteLoader from "@/components/loaders/studyRouteLoader";

const Home = () => {
    const { studyYears, startedStudyYear, setStudyYears } = useStudyYear();
    const { selectedGraduateProfile } = useGraduateProfile();
    const { setErrors, errors } = useError()

    // study years displayed
    const [displayedStudyYears, setDisplayedStudyYears] = useState([]);

    // list of clusters
    const [clusterslist, setClusterslist] = useState([]);

    useEffect(() => {
        if (selectedGraduateProfile && selectedGraduateProfile?.id) {
            // fetch study years
            api.get(`/StudyRoute/cohort/${startedStudyYear?.id}/graduateProfile/${selectedGraduateProfile?.id}/`).then(res => {
                setStudyYears(res.data);
            }).catch(error => {
                setErrors([...errors, {
                    id: new Date().getTime(),
                    type: "clusters",
                    message: 'Er is iets misgegaan bij het ophalen van de clusters. Probeer het later opnieuw.',
                    error: error,
                }]);
            });
        }
    }, [selectedGraduateProfile]);


    // Update displayedStudyYears whenever studyYears changes
    useEffect(() => {
        if (studyYears && studyYears.length > 0) {
            const updatedDisplayedStudyYears = studyYears.map(studyYear => studyYear);
            setDisplayedStudyYears(updatedDisplayedStudyYears);
        }
    }, [studyYears]);

    // Update clusterslist whenever studyYears changes
    useEffect(() => {
        if (studyYears && studyYears.length > 0) {
            const updatedClustersList = [];
            studyYears.forEach(studyYear => {
                if (studyYear.firstSemester) {
                    updatedClustersList.push(...studyYear.firstSemester);
                }
                if (studyYear.lastSemester) {
                    updatedClustersList.push(...studyYear.lastSemester);
                }
            });
            setClusterslist(updatedClustersList);
        }
    }, [studyYears]);


    return (
        <div className={"w-screen flex flex-row gap-0"}>
            {/* Sidebar */}
            <Navigation />

            {/* Main Content */}
            <div
                className={`${selectedGraduateProfile ? "flex" : "hidden"} pt-[100px] max-w-[1366px] relative w-full xl:p-[50px] p-[20px] md:pt-[75px] pb-[75px] gap-0 box-border h-auto flex-col lg:flex-row lg:flex-wrap justify-center align-middle items-center content-center`}>

                {/* Scrollable content for StudyYears */}
                {selectedGraduateProfile && studyYears && studyYears.length > 0 ? displayedStudyYears.map((studyYear, index) => {
                    return (
                        <React.Fragment key={"study-year-" + index}>
                            <StudyYear
                                year={studyYear?.year}
                                firstClusters={studyYear?.firstSemester}
                                secondClusters={studyYear?.lastSemester}
                                selectedGraduateProfile={selectedGraduateProfile}
                                studyYears={studyYears}
                                isLastStudyYear={index === studyYears.length - 1}
                                isEndOfRow={index % 2 === 1 && index !== studyYears.length - 1}
                            >
                                {/* Line from right side to bottom */}
                                {index % 2 === 1 && index !== studyYears.length - 1 && (
                                    <div
                                        style={{ backgroundColor: selectedGraduateProfile?.color }}
                                        className={`ease-in-out duration-200 hidden lg:flex absolute top-[calc(50%-5px)] right-0 w-[10px] h-[calc(50%+5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                                    </div>
                                )}

                                {/* Line from left side to bottom */}
                                {index % 2 === 0 && index !== studyYears.length - 1 && index !== 0 && (
                                    <div
                                        style={{ backgroundColor: selectedGraduateProfile?.color }}
                                        className={`ease-in-out duration-200 hidden lg:flex absolute bottom-[calc(50%-5px)] left-[32.5px] w-[10px] h-[calc(50%+5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                                    </div>
                                )}
                            </StudyYear>

                            {/* Horizontal line */}
                            {index % 2 === 1 && index !== studyYears.length - 1 && (
                                <div className={"hidden pt-[50px] m-0 pb-[50px] lg:flex w-full justify-center align-middle items-center z-[1]"}>
                                    <div
                                        style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                                        className={`absolute left-[52.5px] xl:left-[82.5px] h-[10px] w-[calc(100%-72.5px)] xl:w-[calc(100%-132.5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                                        <div
                                            style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                                            className={"w-[10px] h-[55px] absolute left-0"} />

                                        <div
                                            style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                                            className={"w-[10px] h-[55px] absolute right-[0px] bottom-1/2"} />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                }) : (
                    <StudyRouteLoader />
                )}
            </div>
        </div>
    );
};

export default Home;
