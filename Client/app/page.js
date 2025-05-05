'use client';
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import { useError, useGraduateProfile, useStudyYear } from "@/hooks";
import { api } from "@/hooks/api";
import StudyRouteLoader from "@/components/loaders/studyRouteLoader";

const Home = () => {
  const { studyYears, startedStudyYear, setStudyYears } = useStudyYear();
  const { selectedGraduateProfile } = useGraduateProfile();
  const { setErrors, errors } = useError();

  // Study years displayed
  const [displayedStudyYears, setDisplayedStudyYears] = useState([]);

  // List of clusters
  const [clustersList, setClustersList] = useState([]);

  // Cluster failed
  const [hasFailedCluster, setHasFailedCluster] = useState(false);

  // Add semester
  const [addSemester, setAddSemester] = useState(false);

  // Put back clusters
  const [putBack, setPutBack] = useState(false);

  // Call your coach
  const [callYourCoach, setCallYourCoach] = useState(false);

  // confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // reset clusters menu
  const [resetClustersMenu, setResetClustersMenu] = useState(false);

  useEffect(() => {
    if (selectedGraduateProfile && selectedGraduateProfile?.id) {
      setShowConfirmDialog(false);
      setCallYourCoach(false);
      // Fetch study years
      api.get(`/StudyRoute/cohort/${startedStudyYear?.id}/graduateProfile/${selectedGraduateProfile?.id}/`).then(res => {
        setStudyYears(res.data);
      }).catch(error => {
        setErrors([...errors, {
          id: new Date().getTime(),
          type: "clusters",
          message: 'Er is iets misgegaan bij het ophalen van de clusters. Probeer het later opnieuw.',
          error: error,
        }]);
      });
    }
  }, [selectedGraduateProfile]);

  // Update displayedStudyYears whenever studyYears changes
  useEffect(() => {
    if (studyYears && studyYears.length > 0) {
      const updatedDisplayedStudyYears = studyYears.map(studyYear => {
        const updatedFirstSemester = studyYear.firstSemester?.map(cluster => ({
          ...cluster,
          status: null,
          menuDisabled: false, // Initialize menuDisabled as false
        }));

        const updatedLastSemester = studyYear.lastSemester?.map(cluster => ({
          ...cluster,
          status: null,
          menuDisabled: false, // Initialize menuDisabled as false
        }));

        return {
          ...studyYear,
          firstSemester: updatedFirstSemester,
          lastSemester: updatedLastSemester,
        };
      });
      setDisplayedStudyYears(updatedDisplayedStudyYears);
    }
  }, [studyYears]);

  // Update clustersList whenever studyYears changes
  useEffect(() => {
    if (studyYears && studyYears.length > 0) {
      const updatedClustersList = [];
      studyYears.forEach(studyYear => {
        if (studyYear.firstSemester) {
          updatedClustersList.push(...studyYear.firstSemester);
        }
        if (studyYear.lastSemester) {
          updatedClustersList.push(...studyYear.lastSemester);
        }
      });
      setClustersList(updatedClustersList);
    }
  }, [studyYears]);

  // Create clusterHolder and split into realClusterHolder and otherHolder
  useEffect(() => {
    if (studyYears && studyYears.length > 0) {
      // Make a copy of clustersList
      const clusterHolder = [];
      studyYears.forEach(studyYear => {
        if (studyYear.firstSemester) clusterHolder.push(...studyYear.firstSemester);
        if (studyYear.lastSemester) clusterHolder.push(...studyYear.lastSemester);
      });

      // Split into realClusterHolder and otherHolder
      const realClusterHolder = clusterHolder.filter(c => [1, 2, 3].includes(c.level));
      const otherHolder = clusterHolder.filter(c => c.level === 0 || c.level === 4);

      // Merge arrays
      const newClustersList = [...realClusterHolder, ...otherHolder];

      setClustersList(newClustersList);
    }
  }, [studyYears]);

  // Update displayedClustersList whenever displayedStudyYears changes
  const displayedClustersList = React.useMemo(() => {
    if (displayedStudyYears && displayedStudyYears.length > 0) {
      const updatedClustersList = [];
      displayedStudyYears.forEach(studyYear => {
        if (studyYear.firstSemester) {
          updatedClustersList.push(...studyYear.firstSemester);
        }
        if (studyYear.lastSemester) {
          updatedClustersList.push(...studyYear.lastSemester);
        }
      });
      return updatedClustersList;
    }
    return [];
  }, [displayedStudyYears]);

  // Update cluster status
  const updateClusterStatus = (studyYearIndex, semester, clusterId, newStatus) => {
    setDisplayedStudyYears(prevDisplayedStudyYears => {
      let updatedStudyYears = [...prevDisplayedStudyYears];
      const semesterKey = semester === "firstSemester" ? "firstSemester" : "lastSemester";

      if (newStatus === "failed") {
        // Update all clusters in previous study years
        for (let i = 0; i < studyYearIndex; i++) {
          if (updatedStudyYears[i].firstSemester) {
            updatedStudyYears[i].firstSemester = updatedStudyYears[i].firstSemester.map(cluster => ({
              ...cluster,
              status: cluster.status === null ? "passed" : cluster.status, // Only update white clusters
              menuDisabled: cluster.status === null ? true : cluster.menuDisabled, // Disable menu only for white clusters
            }));
          }
          if (updatedStudyYears[i].lastSemester) {
            updatedStudyYears[i].lastSemester = updatedStudyYears[i].lastSemester.map(cluster => ({
              ...cluster,
              status: cluster.status === null ? "passed" : cluster.status, // Only update white clusters
              menuDisabled: cluster.status === null ? true : cluster.menuDisabled, // Disable menu only for white clusters
            }));
          }
        }

        // If the failed cluster is in lastSemester, update all in firstSemester of the same year
        if (semester === "lastSemester" && updatedStudyYears[studyYearIndex].firstSemester) {
          updatedStudyYears[studyYearIndex].firstSemester = updatedStudyYears[studyYearIndex].firstSemester.map(cluster => ({
            ...cluster,
            status: cluster.status === null ? "passed" : cluster.status, // Only update white clusters
            menuDisabled: cluster.status === null ? true : cluster.menuDisabled, // Disable menu only for white clusters
          }));
        }

        // Update clusters before the failed one in the same semester
        const clusterIndex = updatedStudyYears[studyYearIndex][semesterKey].findIndex(cluster => cluster.id === clusterId);
        if (clusterIndex !== -1) {
          updatedStudyYears[studyYearIndex][semesterKey] = updatedStudyYears[studyYearIndex][semesterKey].map((cluster, idx) => {
            if (idx < clusterIndex && cluster.status === null) {
              return { ...cluster, status: "passed", menuDisabled: true }; // Only update white clusters
            }
            return cluster;
          });
        }

        // Update the specific cluster to "failed"
        updatedStudyYears[studyYearIndex][semesterKey] = updatedStudyYears[studyYearIndex][semesterKey].map(cluster => {
          if (cluster.id === clusterId) {
            return { ...cluster, status: newStatus, menuDisabled: false }; // Keep menu enabled for the failed cluster
          }
          return cluster;
        });

        setHasFailedCluster(true);
      } else {
        // For non-"failed" status updates, just update the specific cluster
        updatedStudyYears[studyYearIndex][semesterKey] = updatedStudyYears[studyYearIndex][semesterKey].map(cluster => {
          if (cluster.id === clusterId) {
            return { ...cluster, status: newStatus };
          }
          return cluster;
        });
      }

      return updatedStudyYears;
    });

    setDisplayedStudyYears(prevDisplayedStudyYears => {
      const updatedStudyYears = [...prevDisplayedStudyYears];
      let foundPassedCluster = false;
      for (let i = updatedStudyYears.length - 1; i >= 0; i--) {
        const studyYear = updatedStudyYears[i];

        // Check lastSemester first
        if (studyYear.lastSemester) {
          studyYear.lastSemester = studyYear.lastSemester.map(cluster => {
            if (foundPassedCluster && cluster.status === null) {
              return { ...cluster, status: "passed" };
            }
            if (cluster.status === "passed") {
              foundPassedCluster = true;
            }
            return cluster;
          });
        }

        // Check firstSemester
        if (studyYear.firstSemester) {
          studyYear.firstSemester = studyYear.firstSemester.map(cluster => {
            if (foundPassedCluster && cluster.status === null) {
              return { ...cluster, status: "passed" };
            }
            if (cluster.status === "passed") {
              foundPassedCluster = true;
            }
            return cluster;
          });
        }
      }
      return updatedStudyYears;
    });
  };

  // Handle the logic when a cluster is failed
  useEffect(() => {
    if (hasFailedCluster) {
      console.log("hasFailedCluster:", hasFailedCluster);
      setDisplayedStudyYears(prevDisplayedStudyYears => {
        let foundFailedCluster = false;

        if (foundFailedCluster) {
          return prevDisplayedStudyYears;
        }

        // Start scanning from the bottom of the array
        for (let i = prevDisplayedStudyYears.length - 1; i >= 0; i--) {
          const studyYear = prevDisplayedStudyYears[i];

          // Check the last semester first
          if (studyYear.lastSemester) {
            if (studyYear.lastSemester.length > 1) {
              for (let j = 0; j < studyYear.lastSemester.length; j++) {
                const cluster = studyYear.lastSemester[j];
                if (cluster.status === "failed") {
                  foundFailedCluster = true;
                } else {
                  cluster.id = `blank${j}`; // Replace the cluster with a blank placeholder
                  //cluster.name = ""; // Replace the cluster with a blank placeholder
                  cluster.status = "failed"; // Set the status to false
                }
              }
              if (foundFailedCluster) {
                break;
              } else {
                studyYear.lastSemester = []; // Remove the cluster from the array
              }
            } else {
              const updatedLastSemester = studyYear.lastSemester?.map(cluster => {
                if (cluster.status === "failed") {
                  foundFailedCluster = true; // Mark that a failed cluster has been found
                }
              });
              if (foundFailedCluster) {
                break;
              } else {
                studyYear.lastSemester = []; // Remove the cluster from the array
              }
            }
          }

          if (foundFailedCluster) {
            break;
          }

          // If not found in the last semester, check the first semester
          if (!foundFailedCluster && studyYear.firstSemester) {
            if (studyYear.firstSemester.length > 1) {
              for (let j = 0; j < studyYear.firstSemester.length; j++) {
                const cluster = studyYear.firstSemester[j];
                if (cluster.status === "failed") {
                  foundFailedCluster = true;
                } else {
                  cluster.id = `blank${j}`; // Replace the cluster with a blank placeholder
                  //cluster.name = ""; // Replace the cluster with a blank placeholder
                  cluster.status = "failed"; // Set the status to false
                }
              }
              if (foundFailedCluster) {
                break;
              } else {
                studyYear.firstSemester = []; // Remove the cluster from the array
              }
            } else {
              const updatedFirstSemester = studyYear.firstSemester?.map(cluster => {
                if (cluster.status === "failed") {
                  foundFailedCluster = true; // Mark that a failed cluster has been found
                }
              });
              if (foundFailedCluster) {
                break;
              } else {
                studyYear.firstSemester = []; // Remove the cluster from the array
              }
            }
          }

          if (foundFailedCluster) {
            break;
          }
        }

        if (foundFailedCluster) {
          setAddSemester(true); // Trigger the effect to add a semester
        };

        return prevDisplayedStudyYears;
      });

      // Reset the state after handling the logic
      setHasFailedCluster(false);
    }
  }, [hasFailedCluster]);

  // Handle the logic to add a semester
  useEffect(() => {
    if (addSemester) {
      // Add an empty semester at the end of the displayedStudyYears array
      setDisplayedStudyYears(prevDisplayedStudyYears => {
        const lastStudyYear = prevDisplayedStudyYears[prevDisplayedStudyYears.length - 1];

        // Check if the last study year already has a last semester
        if (lastStudyYear && !lastStudyYear.lastSemester) {
          // Add an empty last semester to the last study year
          return prevDisplayedStudyYears.map((studyYear, index) =>
            index === prevDisplayedStudyYears.length - 1
              ? { ...studyYear, lastSemester: [] }
              : studyYear
          );
        } else {
          // Calculate the new study year name in the format "25/'26"
          const lastYearName = lastStudyYear?.year || "0/'0";
          const [startYear, endYear] = lastYearName.split("/'").map(Number);
          const newYearName = `'${endYear}/'${endYear + 1}`;

          // Add a new study year with an empty first semester
          return [
            ...prevDisplayedStudyYears,
            {
              year: newYearName, // Use the calculated year name
              firstSemester: [],
            },
          ];
        }
      });
      setAddSemester(false);
      setPutBack(true); // Set putBack to true to trigger the effect
    }
  }, [addSemester]);

  // Put back clusters
  useEffect(() => {
    if (putBack) {
      console.log("putBack:", putBack);

      setDisplayedStudyYears(prevDisplayedStudyYears => {
        let updatedStudyYears = [...prevDisplayedStudyYears];
        let updatedDisplayedClustersList = [...displayedClustersList];
        let movementPossible = true;

        for (let studyYear of updatedStudyYears) {
          const isFirstSemesterEmpty = studyYear.firstSemester?.length === 0;
          if (isFirstSemesterEmpty) {
            let clusterAdded = false;
            for (let j = 0; j < clustersList.length; j++) {
              const cluster = clustersList[j];
              const nextCluster = clustersList[j + 1];
              const nextNextCluster = clustersList[j + 2];
              const isAlreadyDisplayed = updatedDisplayedClustersList.some(
                displayedCluster => displayedCluster.id === cluster.id && displayedCluster.status !== "failed"
              );
              // --- NEW RULE: Level 4 cluster must be last ---
              if (
                !isAlreadyDisplayed &&
                cluster.firstSemester &&
                cluster.level === 4
              ) {
                const hasUnplacedLowerLevel = clustersList.some(
                  c =>
                    c.level < 4 &&
                    !updatedDisplayedClustersList.some(
                      displayedCluster =>
                        displayedCluster.id === c.id && displayedCluster.status !== "failed"
                    )
                );
                if (hasUnplacedLowerLevel) {
                  continue;
                }
              }
              if (!isAlreadyDisplayed && cluster.firstSemester) {
                const prerequisites = cluster.prerequisites;
                const prerequisitesMet = prerequisites.length === 0 || prerequisites.some(prerequisite =>
                  updatedDisplayedClustersList.some(displayedCluster => displayedCluster.id === prerequisite.id && displayedCluster.status !== "failed")
                );
                const isPreviousClusterInStudyRoute = updatedDisplayedClustersList.some(
                  displayedCluster => {
                    if (clustersList[j-1] !== null && clustersList.level > 1) {
                      if(clustersList[j-1]?.isFreeChoice) {
                        return displayedCluster.level === (cluster.level - 1);
                      } else {
                        return displayedCluster.level === (cluster.level - 1) && displayedCluster.lastSemester;
                      }
                    } else {
                      return true;
                    }
                  }
                );
                console.log("displayedClustersList", updatedDisplayedClustersList);
                console.log("cluster first semester", cluster.name, (cluster.level -1), cluster.isFreeChoice);
                console.log("isPreviousClusterInStudyRoute", isPreviousClusterInStudyRoute);

                if (prerequisitesMet && (isPreviousClusterInStudyRoute || cluster.isFreeChoice)) {
                  studyYear.firstSemester = [{ ...cluster, status: null }];
                  updatedDisplayedClustersList.push({ ...cluster, status: null });
                  if (
                    nextCluster &&
                    nextCluster.level === cluster.level &&
                    nextCluster.firstSemester &&
                    !nextCluster.isLocked &&
                    !cluster.isLocked &&
                    !nextCluster.isFreeChoice &&
                    !cluster.isFreeChoice
                  ) {
                    studyYear.firstSemester.push({ ...nextCluster, status: null });
                    updatedDisplayedClustersList.push({ ...nextCluster, status: null });
                    if (
                      nextNextCluster &&
                      nextNextCluster.level === cluster.level &&
                      nextNextCluster.firstSemester &&
                      !nextNextCluster.isLocked &&
                      !cluster.isLocked &&
                      !nextNextCluster.isFreeChoice &&
                      !cluster.isFreeChoice
                    ) {
                      studyYear.firstSemester.push({ ...nextNextCluster, status: null });
                      updatedDisplayedClustersList.push({ ...nextNextCluster, status: null });
                    }
                  }
                  clusterAdded = true;
                  break;
                }
              }
            }
            if (!clusterAdded) {
              movementPossible = false;
              break;
            }
          }

          const isLastSemesterEmpty = studyYear.lastSemester?.length === 0;
          if (isLastSemesterEmpty) {
            let clusterAdded = false;
            for (let j = 0; j < clustersList.length; j++) {
              const cluster = clustersList[j];
              const nextCluster = clustersList[j + 1];
              const nextNextCluster = clustersList[j + 2];
              const isAlreadyDisplayed = updatedDisplayedClustersList.some(
                displayedCluster => displayedCluster.id === cluster.id && displayedCluster.status !== "failed"
              );
              // --- NEW RULE: Level 4 cluster must be last ---
              if (
                !isAlreadyDisplayed &&
                cluster.lastSemester &&
                cluster.level === 4
              ) {
                const hasUnplacedLowerLevel = clustersList.some(
                  c =>
                    c.level < 4 &&
                    !updatedDisplayedClustersList.some(
                      displayedCluster =>
                        displayedCluster.id === c.id && displayedCluster.status !== "failed"
                    )
                );
                if (hasUnplacedLowerLevel) {
                  continue;
                }
              }

              if (!isAlreadyDisplayed && cluster.lastSemester) {
                const prerequisites = cluster.prerequisites;
                const prerequisitesMet = prerequisites.length === 0 || prerequisites.some(prerequisite =>
                  updatedDisplayedClustersList.some(displayedCluster => displayedCluster.id === prerequisite.id && displayedCluster.status !== "failed")
                );
                const isPreviousClusterInStudyRoute = updatedDisplayedClustersList.some(
                  displayedCluster => {
                    if (clustersList[j-1] !== null && clustersList.level > 1) {
                      if(clustersList[j-1]?.isFreeChoice) {
                        return displayedCluster.level === (cluster.level - 1);
                      } else {
                        return displayedCluster.level === (cluster.level - 1) && displayedCluster.firstSemester;
                      }
                    } else {
                      return true;
                    }
                  }
                );
                console.log("displayedClustersList", updatedDisplayedClustersList);
                console.log("cluster last semester", cluster.name, cluster.level, cluster.isFreeChoice);
                console.log("isPreviousClusterInStudyRoute", isPreviousClusterInStudyRoute);
                if (prerequisitesMet && (isPreviousClusterInStudyRoute || cluster.isFreeChoice)) {
                  studyYear.lastSemester = [{ ...cluster, status: null }];
                  updatedDisplayedClustersList.push({ ...cluster, status: null });
                  if (
                    nextCluster &&
                    nextCluster.level === cluster.level &&
                    nextCluster.lastSemester &&
                    !nextCluster.isLocked &&
                    !cluster.isLocked &&
                    !nextCluster.isFreeChoice &&
                    !cluster.isFreeChoice
                  ) {
                    studyYear.lastSemester.push({ ...nextCluster, status: null });
                    updatedDisplayedClustersList.push({ ...nextCluster, status: null });
                    if (
                      nextNextCluster &&
                      nextNextCluster.level === cluster.level &&
                      nextNextCluster.lastSemester &&
                      !nextNextCluster.isLocked &&
                      !cluster.isLocked &&
                      !nextNextCluster.isFreeChoice &&
                      !cluster.isFreeChoice
                    ) {
                      studyYear.lastSemester.push({ ...nextNextCluster, status: null });
                      updatedDisplayedClustersList.push({ ...nextNextCluster, status: null });
                    }
                  }
                  clusterAdded = true;
                  break;
                }
              }
            }
            if (!clusterAdded) {
              movementPossible = false;
              break;
            }
          }
        }

        if (!movementPossible) {
          setCallYourCoach(true);
          handleReset();
          return prevDisplayedStudyYears; // try to remove the visual flash when we move the clusters (not perfect yet)
        }

        return updatedStudyYears;
      });

      setPutBack(false);
    }
  }, [putBack]);
  // ...existing code...

  // Handle the confirmation dialog
  const handleConfirmationDialog = () => {
    setShowConfirmDialog(true);
  };

  // Handle the reset
  const handleReset = () => {
    // Delete everything from studyYears and fetch again
    if (selectedGraduateProfile && selectedGraduateProfile?.id) {
      api.get(`/StudyRoute/cohort/${startedStudyYear?.id}/graduateProfile/${selectedGraduateProfile?.id}/`).then(res => {
        setStudyYears(res.data);
      }).catch(error => {
        setErrors([...errors, {
          id: new Date().getTime(),
          type: "clusters",
          message: 'Er is iets misgegaan bij het ophalen van de clusters. Probeer het later opnieuw.',
          error: error,
        }]);
      });
    }
  };

  // disable scrolling when the confirmation dialog is open
  useEffect(() => {
    if (showConfirmDialog || callYourCoach) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showConfirmDialog, callYourCoach]);

  // reset multiple clusters menu
  useEffect(() => {
    setResetClustersMenu(true); // Set resetClustersMenu to true
    setTimeout(() => setResetClustersMenu(false), 300); // Reset it to false immediately after
  }, [studyYears]);

  return (
    <div className={"w-screen flex flex-row gap-0"}>
      {/* Sidebar */}
      <Navigation />

      {/* Main Content */}
      <div
        className={`${selectedGraduateProfile ? 'flex' : 'hidden'} w-full pt-[100px] relative w-full xl:p-[50px] p-[20px] md:pt-[75px] pb-[75px] gap-0 box-border h-auto flex-col lg:flex-row lg:flex-wrap`}
      >
        {/* Scrollable content for StudyYears */}
        {selectedGraduateProfile && displayedStudyYears && displayedStudyYears.length > 0 ? displayedStudyYears.map((studyYear, index) => {
          const isLastOddStudyYear = displayedStudyYears.length % 2 === 1 && index === displayedStudyYears.length - 1;
          return (
            <React.Fragment key={"study-year-" + index}>
              <StudyYear
                year={studyYear?.year}
                startedStudyYear={startedStudyYear?.id}
                firstClusters={studyYear?.firstSemester}
                secondClusters={studyYear?.lastSemester}
                selectedGraduateProfile={selectedGraduateProfile}
                studyYears={displayedStudyYears}
                isLastStudyYear={index === displayedStudyYears.length - 1}
                isEndOfRow={index % 2 === 1 && index !== studyYears.length - 1}
                updateClusterStatus={(semester, clusterId, newStatus) =>
                  updateClusterStatus(index, semester, clusterId, newStatus)
                }
                isLastOddStudyYear={isLastOddStudyYear}
                resetClustersMenu={resetClustersMenu}
                clustersList={clustersList}
              >
                {/* Line from right side to bottom */}
                {index % 2 === 1 && index !== displayedStudyYears.length - 1 && (
                  <div
                    style={{ backgroundColor: selectedGraduateProfile?.color }}
                    className={`ease-in-out duration-200 hidden lg:flex absolute top-[calc(50%-5px)] right-0 w-[10px] h-[calc(50%+50px)] bg-${selectedGraduateProfile?.color} box-border`}
                  >
                  </div>
                )}

                {/* Line from left side to bottom */}
                {index % 2 === 0 && (index !== displayedStudyYears.length - 1 || isLastOddStudyYear) && index !== 0 && (
                  <div
                    style={{ backgroundColor: selectedGraduateProfile?.color }}
                    className={`ease-in-out duration-200 hidden lg:flex absolute bottom-[calc(50%-5px)] left-[32.5px] w-[10px] h-[calc(50%+50px)] bg-${selectedGraduateProfile?.color} box-border`}
                  >
                  </div>
                )}
              </StudyYear>

              {/* Horizontal line */}
              {index % 2 === 1 && index !== displayedStudyYears.length - 1 && (
                <div className={"hidden pt-[50px] m-0 pb-[50px] lg:flex w-full justify-center align-middle items-center z-[1]"}>
                  <div
                    style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                    className={`absolute left-[52.5px] xl:left-[82.5px] h-[10px] w-[calc(100%-72.5px)] xl:w-[calc(100%-132.5px)] bg-${selectedGraduateProfile?.color} box-border`}
                  >
                    <div
                      style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                      className={"w-[10px] h-[55px] absolute left-0"}
                    />

                    <div
                      style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                      className={"w-[10px] h-[100px] absolute right-[0px] bottom-1/2"}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        }) : (
          <StudyRouteLoader />
        )}
      </div>

      {/* Reset button */}
      <div className="fixed top-[95px] right-[20px] z-10 md:top-[20px]">
        <button
          onClick={handleConfirmationDialog}
          className="bg-red-500 text-white px-[20px] py-[10px] rounded-[8px] hover:bg-red-600 transition duration-200"
        >
          Reset
        </button>
      </div>

      {/* Confirmation button */}
      {showConfirmDialog && (
        <div
          className="fixed lg:left-[250px] md:left-[250px] inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50"
          onClick={() => setShowConfirmDialog(false)}
        >
          <div
            className="flex flex-col justify-center items-center w-[300px] bg-white rounded-[12px] p-[16px] shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="absolute top-2 right-2 w-[30px] h-[30px] bg-transparent text-gray-500 hover:text-gray-700 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="font-bold text-[20px] text-gray-800 mb-2">Alles resetten</p>
            <p className="text-[14px] text-gray-600 text-center mb-4">
              Weet je het zeker?
            </p>
            <div className="w-full flex gap-2">
              <button
                onClick={() => {
                  handleReset();
                  setShowConfirmDialog(false);
                }}
                className="w-full h-[36px] bg-[#124477] rounded-[8px] text-white font-bold text-[14px]"
              >
                Ja
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="w-full h-[36px] bg-gray-300 hover:bg-gray-400 rounded-[8px] text-gray-700 font-bold text-[14px]"
              >
                Nee
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Call your coach */}
      {callYourCoach && (
        <div className="fixed lg:left-[250px] md:left-[250px] inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
          <div
            className="flex flex-col items-center w-[300px] bg-white rounded-[12px] p-[16px] shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setCallYourCoach(false)}
              className="absolute top-2 right-2 w-[30px] h-[30px] bg-transparent text-gray-500 hover:text-gray-700 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#124477"
              className="h-[60px] w-[60px] mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.5m-9.75-6.5l9.75 6.5"
              />
            </svg>
            <p className="text-[16px] font-bold text-center text-gray-800 mb-2">
              Neem contact op met je studentbegeleider.
            </p>
            <p className="text-[14px] text-gray-600 text-center mb-4">
              Het is niet gelukt om een passende studieroute te plannen.
            </p>
            <button
              onClick={() => setCallYourCoach(false)}
              className="w-full h-[36px] bg-[#124477] rounded-[8px] text-white font-bold text-[14px]"
            >
              Ja
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;