'use client';
import React, { use, useEffect, useState } from 'react';
import Cluster from "@/components/studyYear/clusters/cluster";
import { useGraduateProfile } from "@/hooks";

const Clusters = ({ cohort, clusters, currentCluster, setCurrentCluster, handleColor, updateClusterStatus, resetClustersMenu, clustersList, displayedClustersList, displayedStudyYears, semester, setRefresh, multipleChoiceClustersOpen, setMultipleChoiceClustersOpen, setMultipleChoicePopUp, handleClusterInvalid, invalidRoute, setInvalidRoutePopUp }) => {
  const [handleMultipleClusters, setHandleMultipleClusters] = useState(multipleChoiceClustersOpen);
  const [isAnimating, setIsAnimating] = useState(true);
  const { selectedGraduateProfile } = useGraduateProfile();
  const [handleMultipleClustersDelayed, setHandleMultipleClustersDelayed] = useState(true);
  const [shutDown, setShutDown] = useState(false);

  useEffect(() => {
    if (
      !shutDown &&
      clusters.some(c => typeof c.id === "string" && c.id.startsWith("b-"))
    ) {
      clusters.find((cluster) => {
        if (!cluster.id.startsWith("b-")) {
          setCurrentCluster(cluster);
        }
      });
    }
  },[clusters]);

  useEffect(() => {
    if (resetClustersMenu) {
      setHandleMultipleClusters(true);
      setHandleMultipleClustersDelayed(true);
      setShutDown(false);
    }
  }, [resetClustersMenu]);

  useEffect(() => {
    if (multipleChoiceClustersOpen === true || multipleChoiceClustersOpen === false) {
      setTimeout(() => {
        setMultipleChoiceClustersOpen(handleMultipleClusters);
      }, 300);
    }
    if (!handleMultipleClusters) {
      const timeout = setTimeout(() => {
        setHandleMultipleClustersDelayed(false);
      }, 350);
      return () => clearTimeout(timeout);
    } else {
      setHandleMultipleClustersDelayed(true);
    }
  }, [handleMultipleClusters]);

  const handleMenuClick = () => {
    if (!handleMultipleClusters) {
      setHandleMultipleClusters(true);
      // REMOVE handlePutBack() from here!
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleMenuClick(e);
    }
  };

  useEffect(() => {
    if (handleMultipleClusters) {
      setIsAnimating(true);
      // Delay putting back clusters until the next tick so animation can start
      const putBackTimeout = setTimeout(() => {
        handlePutBack();
      }, 275); // 10ms is enough to let React paint the animation state

      const animTimeout = setTimeout(() => setIsAnimating(false), 285);

      return () => {
        clearTimeout(putBackTimeout);
        clearTimeout(animTimeout);
      };
    }
  }, [handleMultipleClusters]);

  useEffect(() => {
    if (!multipleChoiceClustersOpen) {
      setHandleMultipleClustersDelayed(false);
    }
  }, [multipleChoiceClustersOpen]);

  const handleClusterClick = (cluster) => {
    setIsAnimating(true);
    setHandleMultipleClusters(false);

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentCluster(cluster);
      clusters.forEach((c) => {
        if (c.id !== cluster.id) {
          setTimeout(() => {
            handleTakeOut(c);
          }, 25);
        }
      });
    }, 275);

    setTimeout(() => {
      setIsAnimating(true);
    }, 300);
  };

  // useEffect(() => {
  //   setCurrentCluster(null);
  //   setHandleMultipleClusters(true);
  // }, [selectedGraduateProfile, setCurrentCluster]);

  useEffect(() => {
    if (shutDown) {
      setHandleMultipleClusters(false);
    }
  }, [shutDown]);

  // Handle taking out a cluster when the other is selected
  const handleTakeOut = (cluster) => {
    let stop = false;
    clustersList.forEach((c) => {
      if (c.id === cluster.id && !stop) {
        c.id = "b-" + cluster.id;
        stop = true;
      }
    });

    displayedStudyYears.forEach((studyYear) => {
      if (studyYear.firstSemester) {
        studyYear.firstSemester.forEach((c) => {
          if (c.id === cluster.id) {
            c.id = "b-" + cluster.id;
          }
        });
      }
      if (studyYear.lastSemester) {
        studyYear.lastSemester.forEach((c) => {
          if (c.id === cluster.id) {
            c.id = "b-" + cluster.id;
          }
        });
      }
    });
  }

  // Puts back the cluster when the menu is opened
  const handlePutBack = () => {
    clustersList?.forEach((c) => {
      if (c.id.startsWith("b-")) {
        c.id = c.id.substring(2);
      }
    });

    displayedStudyYears.forEach((studyYear) => {
      if (studyYear.firstSemester) {
        studyYear.firstSemester.forEach((c) => {
          if (c.id.startsWith("b-")) {
            c.id = c.id.substring(2);
          }
        });
      }
      if (studyYear.lastSemester) {
        studyYear.lastSemester.forEach((c) => {
          if (c.id.startsWith("b-")) {
            c.id = c.id.substring(2);
          }
        });
      }
    });
  }

  return (
    <div className="w-full lg:w-auto flex flex-row gap-[25px] justify-center items-center">
      {clusters && clusters.length > 0 && (
        clusters.length > 1 ? (
          <div
            key={"clusters-menu"}
            onClick={(e) => {
              if (shutDown) return null;
              if (e.target.closest('.cluster-info')) return null;
              handleMenuClick();
            }}
            onKeyDown={(e) => {
              if (shutDown) return null;
              if (e.target.closest('.cluster-info')) return null;
              handleKeyDown(e);
            }}
            tabIndex={0} // make the div focusable
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
                  display: "block", // Ensure the spans stack on top of each other
                  position: "absolute", // Position the span absolutely
                  top: "50%", // Center vertically
                  left: "50%", // Center horizontally
                  transform: "translate(-50%, -50%)", // Adjust for the element's size
                  whiteSpace: "nowrap", // Prevent text wrapping
                }}
              >
                <p
                  style={{ color: handleColor() }}
                  className="w-full text-center font-bold text-[14px] box-border"
                >Kies een van de clusters:</p>
              </span>
              <span
                style={{
                  opacity: handleMultipleClusters ? 0 : 1,
                  transition: "opacity 300ms ease-in-out",
                  display: "block", // Ensure the spans stack on top of each other
                  position: "absolute", // Position the span absolutely
                  top: "50%", // Center vertically
                  left: "50%", // Center horizontally
                  transform: "translate(-50%, -50%)", // Adjust for the element's size
                  whiteSpace: "nowrap", // Prevent text wrapping
                }}
              >
                <p
                  style={{ color: handleColor() }}
                  className="w-full text-center font-bold text-[14px] box-border"
                >Kies een cluster:</p>
              </span>
            </div>
            <div className={`relative h-full cursor-pointer w-full flex flex-col gap-[25px] justify-evenly items-center px-6 box-border ease-in-out duration-300`}>
              {clusters.sort((a, b) => (a.name === currentCluster?.name ? -1 : b.name === currentCluster?.name ? 1 : 0))
                .map((cluster, index) => {
                  if (handleMultipleClusters && index > 2) return null;

                  let topPosition = 0;
                  if (currentCluster) topPosition = currentCluster.name === cluster.name ? 0 : -90;
                  else topPosition = index === 0 ? 0 : -90;

                  return (
                    <div
                      key={"cluster-" + cluster?.id}
                      className={`w-full lg:w-auto cluster relative cursor-pointer rounded-[12px] ${!handleMultipleClusters && "shadow-lg"}`}
                      onClick={(e) => {
                        if (handleMultipleClusters && !shutDown) {
                          if (e.target.closest('.cluster-info')) return null;
                          handleClusterClick(cluster);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (handleMultipleClusters && !shutDown) {
                            if (e.target.closest('.cluster-info')) return null;
                            handleClusterClick(cluster);
                          }
                        }
                      }}
                      style={{
                        marginTop: (!handleMultipleClusters ? topPosition : "0") + "px",
                        zIndex: !handleMultipleClusters ? 3 - index : currentCluster?.name === cluster.name ? 3 : 1,
                        transform: "scale(" + (!handleMultipleClusters ? (index === 0 ? "1" : index === 1 ? "0.95" : "0.90") : "1") + ")",
                        position: 'relative',
                        transition: isAnimating ? "all 0.3s ease-in-out" : "none",
                      }}
                    >
                      <Cluster
                        cluster={clusters[index]}
                        clustersSize={clusters.length}
                        clusterSelected={currentCluster}
                        {...cluster}
                        initialStatus={cluster.status}
                        updateClusterStatus={newStatus => updateClusterStatus(cluster.id, newStatus)}
                        handleMultipleClustersDelayed={handleMultipleClustersDelayed}
                        menuDisabled={cluster.menuDisabled} // transmiting the prop menuDisabled
                        setShutDown={setShutDown}
                        handleClusterInvalid={handleClusterInvalid} // Pass down
                        invalidRoute={invalidRoute}
                        setInvalidRoutePopUp={setInvalidRoutePopUp} // Pass down
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <Cluster
            cohort={cohort}
            cluster={clusters[0]}
            clustersSize={clusters.length}
            clusterSelected={clusters[0]} // first cluster selected by default
            key={0}
            {...clusters[0]}
            initialStatus={clusters[0].status}
            updateClusterStatus={newStatus => updateClusterStatus(clusters[0].id, newStatus)}
            handleMultipleClustersDelayed={false}
            multipleChoiceClustersOpen={multipleChoiceClustersOpen}
            setMultipleChoicePopUp={setMultipleChoicePopUp}
            menuDisabled={clusters[0].menuDisabled} // transmiting the prop menuDisabled
            setShutDown={setShutDown}
            clustersList={clustersList} // transmiting the prop clustersList
            displayedClustersList={displayedClustersList} // transmiting the prop displayedClustersList
            displayedStudyYears={displayedStudyYears} // transmiting the prop displayedStudyYears
            semester={semester} // transmiting the prop semester
            setRefresh={setRefresh}
            handleClusterInvalid={handleClusterInvalid} // Pass down
            invalidRoute={invalidRoute}
            setInvalidRoutePopUp={setInvalidRoutePopUp} // Pass down
          />
        )
      )}
    </div>
  );
}

export default Clusters;
