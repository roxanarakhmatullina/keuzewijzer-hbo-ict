'use client';
import React, { useEffect } from 'react';
import Cluster from "@/components/v2/studyYear/clusters/cluster";

const Clusters = ({ clusters, currentCluster, setCurrentCluster, handleColor, selectedGraduateProfile }) => {
    const [handleMultipleClusters, setHandleMultipleClusters] = React.useState(false);

    const handleMenuClick = (e) => {
        if (!e.target.closest('.cluster'))
            setHandleMultipleClusters(prev => !prev);
        else if (!handleMultipleClusters)
            setHandleMultipleClusters(true);
    };

    const handleClusterClick = (cluster) => {
        setCurrentCluster(cluster);
    };

    return (
        <div className="w-full flex flex-row gap-[25px] justify-center items-center">
            {clusters && clusters.length > 0 && (
                clusters.length > 1 ? (
                    <div
                        onClick={handleMenuClick}
                        >
                        <div
                            style={{
                                background: selectedGraduateProfile ? selectedGraduateProfile.color : "#d9d9d9",
                            }}
                            className={`w-full rounded-[12px] flex flex-col justify-between items-center gap-[10px]
                                p-[0px] pt-[20px] pb-[20px] box-border 
                                transition-transform duration-500`}>
                            <p
                                style={{ color: handleColor() }}
                                className="w-full transition duration-300 text-center font-bold text-[14px] pt-0 pb-5 p-5 box-border">
                                Kies een van de onderstaande semesters:
                            </p>
                            <div className={`relative h-full cursor-pointer w-full flex flex-col gap-[25px] justify-evenly items-center px-6 box-border ease-in-out duration-300`}>
                                {clusters
                                    // Reorder clusters: move currentCluster to the top
                                    .map((cluster, index) => ({
                                        ...cluster,
                                        originalIndex: index
                                    }))
                                    .sort((a, b) => (a.id === currentCluster?.id ? -1 : b.id === currentCluster?.id ? 1 : 0)) // Move currentCluster to the top
                                    .map((cluster, index) => {
                                        // Show only the first three clusters
                                        if (!!handleMultipleClusters && index > 2) return null;

                                        // Define top positions for the first three clusters
                                        const topPosition = index === 0 ? '0px' : "-90px";

                                        return (
                                            <div
                                                key={cluster.originalIndex}
                                                className={`relative w-full transition-all duration-300 ease-in-out rounded-[12px] 
                                                ${!handleMultipleClusters && "shadow-lg"}`}
                                                style={{
                                                    marginTop: !handleMultipleClusters ? topPosition : "0",
                                                    zIndex:  3 - index,
                                                    transform: "scale(" + (!handleMultipleClusters ? (index === 0 ? "1" : index === 1 ? "0.95" : "0.90") : "1") + ")",
                                                    position: 'relative',
                                                }}
                                            >
                                                <Cluster
                                                    clustersSize={clusters.length}
                                                    setSelectedCluster={() => handleMultipleClusters && handleClusterClick(cluster)} // Set selected cluster
                                                    clusterSelected={currentCluster} // Pass the selected cluster
                                                    {...cluster}
                                                />
                                            </div>
                                        );
                                    })}

                            </div>
                        </div>
                    </div>
                ) : (
                    <Cluster
                        clustersSize={clusters.length}
                        setSelectedCluster={setCurrentCluster}
                        clusterSelected={clusters[0]} // Pass the first cluster as selected
                        key={0}
                        {...clusters[0]}
                    />
                )
            )}
        </div>
    );
}

export default Clusters;
