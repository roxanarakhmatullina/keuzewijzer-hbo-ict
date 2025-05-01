'use client';
import React, { useEffect, useState } from 'react';
import Cluster from "@/components/studyYear/clusters/cluster";
import { useGraduateProfile } from "@/hooks";

const Clusters = ({ cohort, clusters, currentCluster, setCurrentCluster, handleColor, updateClusters, location, shutDown }) => {
    const [handleMultipleClusters, setHandleMultipleClusters] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const { selectedGraduateProfile } = useGraduateProfile();

    const handleMenuClick = (e) => {
        if (!e.target.closest('.cluster')) {
            setHandleMultipleClusters(prev => !prev);
        } else if (!handleMultipleClusters) {
            setHandleMultipleClusters(true);
        }
    };

    const loc = location?.name?.toLowerCase();
    const isAvailable = (cluster) => (loc === "almere" && cluster.almere) || (loc === "zwolle" && cluster.zwolle);

    const availableClusters = clusters.filter(isAvailable);
    const otherClusters = clusters.filter(cluster => !isAvailable(cluster));

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleMenuClick(e);
        }
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

    useEffect(() => {
        if (shutDown) {
            setHandleMultipleClusters(false);
        }
    }, [shutDown]);

    return (
        <div className="w-full lg:w-auto flex flex-row gap-[25px] justify-center items-center">
            {clusters && clusters.length > 0 && (
                clusters.length > 1 ? (
                    <div
                        key={"clusters-menu"}
                        onClick={(e) => {
                            if (shutDown) return;
                            if (e.target.closest('.cluster-info')) return;
                            handleMenuClick(e);
                        }}
                        onKeyDown={(e) => {
                            if (shutDown) return;
                            if (e.target.closest('.cluster-info')) return;
                            handleKeyDown(e);
                        }}
                        tabIndex={0}
                        style={{
                            background: selectedGraduateProfile ? selectedGraduateProfile.color : "#d9d9d9",
                        }}
                        className={`w-full lg:max-w-[calc(100%-20px)] lg:w-auto rounded-[12px] flex flex-col justify-between items-center gap-[10px]
                            p-[0px] pt-[20px] pb-[20px] box-border transition-transform duration-500`}
                    >
                        <div className="relative w-full mt-[10px] mb-[15px]">
                            <span
                                style={{
                                    opacity: handleMultipleClusters ? 1 : 0,
                                    transition: "opacity 300ms ease-in-out",
                                    display: "block",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <p
                                    style={{ color: handleColor() }}
                                    className="w-full transition duration-300 text-center font-bold text-[14px] pt-0 pb-[5px] p-[5px] box-border"
                                >
                                    Kies een van de clusters:
                                </p>
                            </span>
                        </div>

                        <div className="relative h-full cursor-pointer w-full flex flex-col gap-[25px] justify-evenly items-center px-6 box-border ease-in-out duration-300">
                            {clusters.sort((a, b) => (a.id === currentCluster?.id ? -1 : b.id === currentCluster?.id ? 1 : 0))
                                .map((cluster, index) => {
                                    if (handleMultipleClusters && index > 2) return null;

                                    let topPosition = 0;
                                    if (currentCluster) {
                                        topPosition = currentCluster.id === cluster.id ? 0 : -90;
                                    } else {
                                        topPosition = index === 0 ? 0 : -90;
                                    }

                                    return (
                                        <div
                                            key={"cluster-" + cluster?.id}
                                            className={`w-full lg:w-auto cluster relative cursor-pointer rounded-[12px] ${!handleMultipleClusters ? "shadow-lg" : ""}`}
                                            
                                            onClick={(e) => {
                                                if (handleMultipleClusters) {
                                                    if (e.target.closest('.cluster-info')) return;
                                                    handleClusterClick(cluster);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && handleMultipleClusters) {
                                                    if (e.target.closest('.cluster-info')) return;
                                                    handleClusterClick(cluster);
                                                }
                                            }}
                                            style={{
                                                marginTop: !handleMultipleClusters ? `${topPosition}px` : "0",
                                                zIndex: !handleMultipleClusters ? 3 - index : currentCluster?.id === cluster.id ? 3 : 1,
                                                transform: `scale(${!handleMultipleClusters ? (index === 0 ? "1" : index === 1 ? "0.95" : "0.90") : "1"})`,
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
                        clusterSelected={clusters[0]}
                        key={0}
                        {...clusters[0]}
                    />
                )
            )}
        </div>
    );
};

export default Clusters;
