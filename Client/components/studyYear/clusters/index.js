'use client';
import React, { useEffect, useState } from 'react';
import Cluster from "@/components/studyYear/clusters/cluster";
import {useApi} from "@/providers/ApiProvider";

const Clusters = ({ clusters, currentCluster, setCurrentCluster, handleColor }) => {
    const [handleMultipleClusters, setHandleMultipleClusters] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const {selectedGraduateProfile} = useApi();

    const handleMenuClick = (e) => {
        if (!e.target.closest('.cluster'))
            setHandleMultipleClusters(prev => !prev);
        else if (!handleMultipleClusters)
            setHandleMultipleClusters(true);
    };

    const handleClusterClick = (cluster) => {
        setHandleMultipleClusters(false);
        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
            setCurrentCluster(cluster);
        }, 275);

        setTimeout(() => {
            setIsAnimating(true);
        }, 300);
    };

    useEffect(() => {
        setCurrentCluster(null);
        setHandleMultipleClusters(true);
    }, [selectedGraduateProfile, setCurrentCluster]);

    return (
        <div className="w-full lg:w-auto flex flex-row gap-[25px] justify-center items-center">
            {clusters && clusters.length > 0 && (
                clusters.length > 1 ? (
                    <div
                        onClick={(e) => handleMenuClick(e)}
                        style={{
                            background: selectedGraduateProfile ? selectedGraduateProfile.color : "#d9d9d9",
                        }}
                        className={`w-full lg:max-w-[calc(100%-20px)] lg:w-auto rounded-[12px] flex flex-col justify-between items-center gap-[10px]
                            p-[0px] pt-[20px] pb-[20px] box-border transition-transform duration-500`}
                    >
                        <p
                            style={{ color: handleColor() }}
                            className="w-full transition duration-300 text-center font-bold text-[14px] pt-0 pb-[5px] p-[5px] box-border"
                        >
                            Kies een van de clusters:
                        </p>
                        <div className={`relative h-full cursor-pointer w-full flex flex-col gap-[25px] justify-evenly items-center px-6 box-border ease-in-out duration-300`}>
                            {clusters.sort((a, b) => (a.id === currentCluster?.id ? -1 : b.id === currentCluster?.id ? 1 : 0))
                                .map((cluster, index) => {
                                    if (handleMultipleClusters && index > 2) return null;

                                    let topPosition = 0;
                                    if(currentCluster) topPosition = currentCluster.id === cluster.id ? 0 : -90;
                                    else topPosition = index === 0 ? 0 : -90;

                                    return (
                                        <div
                                            key={cluster?.id}
                                            className={`w-full lg:w-auto cluster relative cursor-pointer rounded-[12px] 
                                                ${!handleMultipleClusters && "shadow-lg"}`}
                                            onClick={() => handleMultipleClusters && handleClusterClick(cluster)}
                                            style={{
                                                marginTop: (!handleMultipleClusters ? topPosition : "0") + "px",
                                                zIndex: !handleMultipleClusters ? 3 - index : currentCluster?.id === cluster.id ? 3 : 1,
                                                transform: "scale(" + (!handleMultipleClusters ? (index === 0 ? "1" : index === 1 ? "0.95" : "0.90") : "1") + ")",
                                                position: 'relative',
                                                transition: isAnimating ? "all 0.3s ease-in-out" : "none",
                                            }}
                                        >
                                            <Cluster
                                                clustersSize={clusters.length}
                                                clusterSelected={currentCluster}
                                                {...cluster}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ) : (
                    <Cluster
                        clustersSize={clusters.length}
                        setSelectedCluster={setCurrentCluster}
                        clusterSelected={clusters[0]} // Selecteer het eerste cluster
                        key={0}
                        {...clusters[0]}
                    />
                )
            )}
        </div>
    );
}

export default Clusters;
