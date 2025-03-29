'use client'
import React, {useEffect, useState} from 'react'
import Clusters from "@/components/studyYear/clusters";
import {useGraduateProfile} from "@/hooks";
import Lock from "@/icons/lock";
import Graduate from "@/icons/graduate";

const StudyYear = ({year, firstClusters, secondClusters, isLastStudyYear, isEndOfRow, children}) => {
    const [isLocked, setIsLocked] = useState(false);
    const [firstCluster, setFirstCluster] = useState(null);
    const [lastCluster, setLastCluster] = useState(null);
    const {selectedGraduateProfile} = useGraduateProfile();

    useEffect(() => {
        setFirstCluster(null);
        setLastCluster(null);
    }, [selectedGraduateProfile]);

    useEffect(() => {
        if(firstClusters && secondClusters && firstClusters.length > 0 && secondClusters.length > 0) {
            const first = firstClusters.every(cluster => cluster.isLocked);
            const second = secondClusters.every(cluster => cluster.isLocked);
            setIsLocked(first && second);
        }
    }, [firstClusters, secondClusters]);


    const handleColor = () => {
        if(selectedGraduateProfile) {
            // check if color needs to be white or black based on the background color
            const newColor = selectedGraduateProfile.color.replace("#", "");
            const r = parseInt(newColor.substring(0, 2), 16);
            const g = parseInt(newColor.substring(2, 4), 16);
            const b = parseInt(newColor.substring(4, 6), 16);
            const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
            return brightness > 125 ? "#000" : "#fff";
        } else {
            return "#fff";
        }
    }

    return (
        <div className={"relative  last:mb-[50px] lg:m-0 lg:last:mb-0 first:mt-0 mt-[-5px] lg:mt-0 w-full lg:max-w-[calc(50%)] flex justify-between gap-[75px] lg:gap-[0px] h-auto align-middle items-center flex-col lg:flex-row"}>
            {children}

            {/* Horizontal line and the year*/}
            <div
                style={{background: selectedGraduateProfile ? selectedGraduateProfile.color : "#124477"}}
                className={"absolute transition ease-in-out duration-300 lg:w-full lg:h-[10px] w-[10px] h-full"}/>
            <div
                style={{background: selectedGraduateProfile ? selectedGraduateProfile.color : "#124477"}}
                className={"relative transition ease-in-out duration-300 top-0 left-0 min-w-[75px] min-h-[75px] rounded-full flex justify-center align-middle items-center"}>
                <h1
                    style={{color: handleColor()}}
                    className={"text-l transition ease-in-out duration-300 font-bold"}>{year}</h1>
            </div>

            {/* Clusters */}
            <div
                className={"relative w-full lg:w-auto pt-[25px] pb-[25px] p-[10px] box-border h-auto rounded-[12px] bg-[#D9D9D9] flex flex-col justify-center align-middle items-center gap-[25px]"}>
                {isLocked && (
                    <div
                        className={"absolute top-[-25px] p-[12.5px] box-border w-[50px] h-[50px] bg-[#d9d9d9] rounded-full flex justify-center align-middle items-center"}>
                        <Lock/>
                    </div>
                )}

                {/* First Cluster */}
                {firstClusters && firstClusters.length > 0 && (
                    <Clusters clusters={firstClusters} currentCluster={firstCluster} setCurrentCluster={setFirstCluster} handleColor={handleColor} />
                )}

                {/* Last Cluster */}
                {secondClusters && secondClusters.length > 0 && (
                    <Clusters clusters={secondClusters} currentCluster={lastCluster} setCurrentCluster={setLastCluster} handleColor={handleColor} />
                )}

            </div>

            {/* Show graduate icon */}
            {isLastStudyYear ? (
                <div className={"relative w-full lg:w-auto flex flex-col justify-center align-middle items-center gap-[15px]"}>
                    <div
                        style={{background: selectedGraduateProfile ? selectedGraduateProfile.color : "#124477"}}
                        className={"relative max-w-[75px] max-h-[75px] p-[10px] box-border min-w-[75px] min-h-[75px] rounded-full flex justify-center align-middle items-center"}>
                        <Graduate color={handleColor()}/>
                    </div>
                    <p className={"lg:hidden absolute w-full text-center bottom-[-50px]"}>Verwacht af te studeren tot <b>{selectedGraduateProfile?.name}</b></p>
                </div>
            ) : <p className={`${isEndOfRow && "min-w-[75px]"}`}></p>}
        </div>
    )
}

export default StudyYear;