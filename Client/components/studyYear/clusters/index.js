'use client';
import React, { useEffect, useState } from 'react';
import Cluster from "@/components/studyYear/clusters/cluster";
import {useApi} from "@/providers/ApiProvider";
import {useContextProvider, addClusterToRoute, removeClusterFromRoute} from '@/providers/ContextProvider';

const Clusters = ({ clusters, currentCluster, setCurrentCluster, handleColor }) => {
    const [handleMultipleClusters, setHandleMultipleClusters] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const {selectedGraduateProfile} = useContextProvider();

    const handleMenuClick = (e) => {

        const clusterElement = e.target.closest('.cluster');

        if (!clusterElement) {
            setHandleMultipleClusters(prev => !prev);
            console.log("click outside cluster");
        } else {
            const clickedClusterId = clusterElement.getAttribute('id'); // 
            if (!handleMultipleClusters) {

                setHandleMultipleClusters(true);

            } else {
            // Find the clicked cluster object based on the ID
                const clickedCluster = clusters.find(cluster => cluster.id.toString() === clickedClusterId);

                if (clickedCluster) {
                    setCurrentCluster(clickedCluster);
                    console.log("adding clutser ", clickedClusterId, " to route")
                }
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleMenuClick(e);
        }
    };

    const handleClusterClick = (cluster) => {
        setHandleMultipleClusters(false);
        setIsAnimating(true);
        console.log("test 3");
        addClusterToRoute(cluster.id)


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
                        key={"clusters-menu"}
                        onClick={(e) => handleMenuClick(e)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        tabIndex={0} // Makes the div focusable
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
                          .<div className={`relative h-full cursor-pointer w-full flex flex-col gap-[25px] justify-evenly items-center px-6 box-border ease-in-out duration-300`}>
                            {clusters.sort((a, b) => (a.id === currentCluster?.id ? -1 : b.id === currentCluster?.id ? 1 : 0))
                                .map((cluster, index) => {
                                    if (handleMultipleClusters && index > 2) return null;

                                    let topPosition = 0;
                                    if(currentCluster) topPosition = currentCluster.id === cluster.id ? 0 : -90;
                                    else topPosition = index === 0 ? 0 : -90;

                                    return (
                                        <div
                                            key={"cluster-"+ cluster?.id}
                                            className={`w-full lg:w-auto cluster relative cursor-pointer rounded-[12px] 
                                                ${!handleMultipleClusters && "shadow-lg"}`}
                                            onClick={() => handleMultipleClusters && handleClusterClick(cluster)}
                                            onKeyDown={(e) => {if (e.key === 'Enter') {
                                                if (handleMultipleClusters) {
                                                    handleClusterClick(cluster);
                                                }
                                            }}}
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
