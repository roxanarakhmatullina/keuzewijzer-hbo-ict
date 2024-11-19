'use client';
import React from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import {useApi} from "@/providers/ApiProvider";

const Home = () => {
    const {
        currentSavedStudyYear,
        studyYears,  // Assuming studyYears is an array of objects used for mapping
        selectedGraduateProfile,
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
        <div className={"w-screen flex flex-row pt-[50px] md:pt-[0px]"}>
            {/* Sidebar */}
            <Navigation/>

            {/* Main Content */}
            <div
                className={`${selectedGraduateProfile ? "flex" : "hidden"} relative w-full p-[20px] pt-[50px] pb-[50px] box-border h-auto flex-col`}>
                {/* Scrollable content for StudyYears */}
                {selectedGraduateProfile && studyYears && studyYears.length > 0 && studyYears.map((_, index) => {
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
                            isLastStudyYear={index === studyYears.length - 1}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
