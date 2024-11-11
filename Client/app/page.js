'use client';
import React from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import {useApi} from "@/providers/ApiProvider";

const Home = () => {
    const {
        currentSavedStudyYear,
        studyYears,  // Assuming studyYears is an array of objects used for mapping
        startedStudyYear,
        setStartedStudyYear,
        selectedGraduateProfile,
        setSelectedGraduateProfile
    } = useApi();

    const handleShowClusters = (clusters) => {
        if (clusters && clusters.length > 0) {
            // Check if selectedGraduateProfile is set
            if (selectedGraduateProfile) {
                // Filter the cluster graduateProfileTags
                return clusters.filter(cluster =>
                    cluster.graduateProfileTags.includes(selectedGraduateProfile.name)
                );
            } else {
                return clusters;
            }
        }
        return [];
    };

    // Convert currentSavedStudyYear to a number for arithmetic
    const startingYear = parseInt(currentSavedStudyYear, 10);

    return (
        <div className="relative w-full md:overflow-x-auto overflow-x-hidden pt-[75px] md:pt-[0px] box-border bg-[#f3f3f3] min-h-screen h-auto flex justify-center items-start">
            {/* Sidebar */}
            <div className="md:flex hidden w-1/5 md:min-w-[312px] h-full p-[20px] box-border justify-start items-center flex-col gap-[25px]" />
            <Navigation/>

            {/* Main Content */}
            <div className={`${selectedGraduateProfile ? "flex" : "hidden"} snap-y snap-mandatory relative w-full p-[20px] pt-[50px] pb-[50px] md:overflow-x-auto overflow-x-hidden box-border h-auto justify-center items-center flex-col`}>
                {/* Scrollable content for StudyYears */}
                {selectedGraduateProfile && studyYears.map((_, index) => {
                    const fromYear = (startingYear + index).toString(); // Convert result back to string if needed
                    const toYear = (startingYear + index + 1).toString();

                    return (
                        <StudyYear
                            key={index} // Use index as key if studyYears are not unique
                            fromYear={fromYear}
                            toYear={toYear}
                            firstClusters={handleShowClusters(studyYears[index]?.firstCluster)}
                            secondClusters={handleShowClusters(studyYears[index]?.lastCluster)}
                            selectedGraduateProfile={selectedGraduateProfile}
                            studyYears={studyYears}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
