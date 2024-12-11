'use client';
import React from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import {useApi} from "@/providers/ApiProvider";
import {useContextProvider} from '@/providers/ContextProvider';

const Home = () => {
    const {
        clusters,
    } = useApi();

    const {
        currentSavedStudyYear,
        selectedGraduateProfile,
        transformClustersToStudyYears,
    } = useContextProvider();

    const handleShowClusters = (clusters) => {
        if (clusters && clusters.length > 0) {
            // Check if selectedGraduateProfile and StartingYear are set
            if (selectedGraduateProfile && startingYear) {
                // Filter the clusters based on graduateProfileTags
                return clusters.filter(cluster =>
                    cluster.graduateProfileTags.some(([profileName, year]) =>
                        profileName === selectedGraduateProfile.name && year === startingYear.toString()
                    )
                );
            } else {
                return clusters;
            }
        }
        return [];
    };

    // Convert currentSavedStudyYear to a number for arithmetic
    const startingYear = parseInt(currentSavedStudyYear, 10);
    const studyYears = clusters

    return (
        <div className={"w-screen flex flex-row pt-[50px] md:pt-[0px] gap-0"}>
            {/* Sidebar */}
            <Navigation/>

            {/* Main Content */}
            <div
                className={`${selectedGraduateProfile ? "flex" : "hidden"} max-w-[1366px] relative w-full xl:p-[50px] p-[20px] pt-[50px] pb-[50px] gap-0 box-border h-auto flex-col lg:flex-row lg:flex-wrap justify-center align-middle items-center content-center`}>
                {/* Scrollable content for StudyYears */}
                {selectedGraduateProfile && studyYears && studyYears.length > 0 && studyYears.map((_, index) => {
                    const fromYear = (startingYear + index).toString(); // Convert result back to string if needed
                    const toYear = (startingYear + index + 1).toString();


                    return (
                        <React.Fragment key={"study-year-" + index}>
                            <StudyYear
                                fromYear={fromYear}
                                toYear={toYear}
                                firstClusters={handleShowClusters(studyYears[index]?.firstCluster)}
                                secondClusters={handleShowClusters(studyYears[index]?.lastCluster)}
                                selectedGraduateProfile={selectedGraduateProfile}
                                studyYears={studyYears}
                                isLastStudyYear={index === studyYears.length - 1}
                                isEndOfRow={index % 2 === 1 && index !== studyYears.length - 1}
                            >
                                {/* Line from right side to bottom */}
                                {index % 2 === 1 && index !== studyYears.length - 1 && (
                                    <div
                                        style={{backgroundColor: selectedGraduateProfile?.color}}
                                        className={`ease-in-out duration-200 hidden lg:flex absolute top-[calc(50%-5px)] right-0 w-[10px] h-[calc(50%+5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                                    </div>
                                )}

                                {/* Line from left side to bottom */}
                                {index % 2 === 0 && index !== studyYears.length - 1 && index !== 0 && (
                                    <div
                                        style={{backgroundColor: selectedGraduateProfile?.color}}
                                        className={`ease-in-out duration-200 hidden lg:flex absolute bottom-[calc(50%-5px)] left-[32.5px] w-[10px] h-[calc(50%+5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                                    </div>
                                )}
                            </StudyYear>

                            {/* Horizontal line */}
                            {index % 2 === 1 && index !== studyYears.length - 1 && (
                                <div className={"hidden pt-[50px] m-0 pb-[50px] lg:flex w-full justify-center align-middle items-center"}>
                                    <div
                                        style={{backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color"}}
                                        className={`absolute left-[52.5px] xl:left-[82.5px] h-[10px] w-[calc(100%-72.5px)] xl:w-[calc(100%-132.5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                                        <div
                                            style={{backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color"}}
                                            className={"w-[10px] h-[55px] absolute left-0"}/>

                                        <div
                                            style={{backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color"}}
                                            className={"w-[10px] h-[55px] absolute right-[0px] bottom-1/2"}/>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
