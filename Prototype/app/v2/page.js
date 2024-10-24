'use client';
import React, { useEffect, useState } from 'react';
import Navigation from "@/components/v2/navigation";
import StudyYear from "@/components/v2/studyYear";

const PrototypeV2Page = () => {
    const [selectedGraduateProfile, setSelectedGraduateProfile] = useState(null);
    const [studyYears, setStudyYears] = useState([]);

    // Fetch the JSON data
    useEffect(() => {
        const fetchGraduatePaths = async () => {
            try {
                // Fetch with base URL included
                const response = await fetch(`https://keuzewijzerhboict.nl/nieuw/prototype/v2/graduate-paths.json`);
                const data = await response.json();
                setStudyYears(data);
            } catch (error) {
                console.error('Error fetching the graduate paths:', error);
            }
        };

        fetchGraduatePaths();
    }, []);


    const handleShowClusters = (clusters) => {
        if(clusters && clusters.length > 0) {
            // check if selectedGraduateProfile is set
            if(selectedGraduateProfile) {
                // filter the cluster.gradduateProfileTags
                return clusters.filter(cluster => cluster.graduateProfileTags.includes(selectedGraduateProfile.name));
            } else {
                return clusters;
            }
        }

        return [];
    }

    return (
        <div className={"w-full overflow-x-hidden overflow-y-scroll bg-[#f3f3f3] min-h-screen flex justify-center items-start"}>
            {/*  Sidebar   */}
            <div className={"md:flex hidden w-1/5 md:min-w-[312px] h-screen p-[20px] box-border justify-start items-center flex-col gap-[25px]"} />
            <Navigation
                setSelectedGraduateProfile={setSelectedGraduateProfile}
                selectedGraduateProfile={selectedGraduateProfile}
            />

            {/*  Main Content   */}
            <div className={`${selectedGraduateProfile ? "flex" : "hidden"} w-full p-[20px] pt-[50px] pb-[50px] overflow-x-scroll box-border h-auto justify-center items-center flex-col`}>
                {/* Scrollable content for StudyYears */}
                {selectedGraduateProfile && studyYears.map((studyYear) => (
                    <StudyYear
                        key={studyYear.id}
                        fromYear={studyYear.fromYear}
                        toYear={studyYear.toYear} // Assuming you need the next academic year
                        firstClusters={handleShowClusters(studyYear.firstCluster)}
                        secondClusters={handleShowClusters(studyYear.lastCluster)}
                        selectedGraduateProfile={selectedGraduateProfile}
                        studyYears={studyYears}
                    />
                ))}
            </div>
        </div>
    );
}
export default PrototypeV2Page;
