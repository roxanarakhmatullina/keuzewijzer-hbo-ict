'use client';
import React, { use, useEffect, useState } from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import { useError, useGraduateProfile, useStudyYear } from "@/hooks";
import { api } from "@/hooks/api";
import StudyRouteLoader from "@/components/loaders/studyRouteLoader";

const Home = () => {
  const { studyYears, startedStudyYear, setStudyYears } = useStudyYear();
  const { selectedGraduateProfile } = useGraduateProfile();
  const { setErrors, errors } = useError()

  // study years displayed
  const [displayedStudyYears, setDisplayedStudyYears] = useState([]);

  // list of clusters
  const [clustersList, setClustersList] = useState([]);

  // cluster failed
  const [hasFailedCluster, setHasFailedCluster] = useState(false);

  // add semester
  const [addSemester, setAddSemester] = useState(false);

  // put back clusters
  const [putBack, setPutBack] = useState(false);

  // call your coach
  const [callYourCoach, setCallYourCoach] = useState(false);

  useEffect(() => {
    if (selectedGraduateProfile && selectedGraduateProfile?.id) {
      // fetch study years
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
          status: null, // Add status to each cluster in the first semester
        }));

        const updatedLastSemester = studyYear.lastSemester?.map(cluster => ({
          ...cluster,
          status: null, // Add status to each cluster in the last semester
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
      const updatedStudyYears = [...prevDisplayedStudyYears];
      const semesterKey = semester === "firstSemester" ? "firstSemester" : "lastSemester";

      // Update the specific cluster's status
      updatedStudyYears[studyYearIndex][semesterKey] = updatedStudyYears[studyYearIndex][semesterKey].map(cluster => {
        if (cluster.id === clusterId) {
          if (newStatus === "failed") {
            setHasFailedCluster(true); // Update the custom state
          }
          return { ...cluster, status: newStatus };
        }
        return cluster;
      });

      return updatedStudyYears;
    });
  };

  // Handel the logic when a cluster is failed
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
            if(studyYear.lastSemester.length > 1) {
              for (let j = 0; j < studyYear.lastSemester.length; j++) {
                const cluster = studyYear.lastSemester[j];
                //uster: ", cluster.status);
                if (cluster.status === "failed") {
                  foundFailedCluster = true;
                } else {
                  cluster.id = `blank${j}`; // Replace the cluster with a blank placeholder
                  cluster.name = ""; // Replace the cluster with a blank placeholder
                }
              }
              if(foundFailedCluster) {
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
              if(foundFailedCluster) {
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
            if(studyYear.firstSemester.length > 1) {
              for (let j = 0; j < studyYear.firstSemester.length; j++) {
                const cluster = studyYear.firstSemester[j];
                //console.log("checking cluster: ", cluster.status);
                if (cluster.status === "failed") {
                  foundFailedCluster = true;
                } else {
                  cluster.id = `blank${j}`; // Replace the cluster with a blank placeholder
                  cluster.name = ""; // Replace the cluster with a blank placeholder
                }
              }
              if(foundFailedCluster) {
                break;
              } else {
                studyYear.firstSemester = []; // Remove the cluster from the array
              }
            } else {
              const updatedLastSemester = studyYear.firstSemester?.map(cluster => {
                if (cluster.status === "failed") {
                  foundFailedCluster = true; // Mark that a failed cluster has been found
                }
              });
              if(foundFailedCluster) {
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

        return prevDisplayedStudyYears;
      });

      // Reset the state after handling the logic
      setHasFailedCluster(false);
      setAddSemester(true); // Trigger the effect to add a semester
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

  // put back
  useEffect(() => {
    if (putBack) {
      console.log("putBack:", putBack);
      setDisplayedStudyYears(prevDisplayedStudyYears => {
        let updatedStudyYears = [...prevDisplayedStudyYears];
        let updatedDisplayedClustersList = [...displayedClustersList];

        for (let studyYear of updatedStudyYears) {
          //console.log("checking study year: ", studyYear.year);
          const isFirstSemesterEmpty = studyYear.firstSemester?.length === 0;
          //console.log("isFirstSemesterEmpty", isFirstSemesterEmpty);

          if (isFirstSemesterEmpty) {
            console.log("the first semester is empty in study year: ", studyYear.year);
            for (let j = 0; j < clustersList.length; j++) {
              const cluster = clustersList[j];
              const nextCluster = clustersList[j + 1];
              const nextNextCluster = clustersList[j + 2];
              
              // Check if the cluster is already in the updatedDisplayedClustersList
              const isAlreadyDisplayed = updatedDisplayedClustersList.some(
                displayedCluster => displayedCluster.id === cluster.id && displayedCluster.status !== "failed"
              );
              console.log("isAlreadyDisplayed:", isAlreadyDisplayed);

              if (!isAlreadyDisplayed && cluster.firstSemester) {
                // Check prerequisites
                //console.log("cluster prerequisites: ", cluster.prerequisites);
                //console.log("updatedDisplayedClustersList: ", updatedDisplayedClustersList);
                const prerequisites = cluster.prerequisites;
                const prerequisitesMet = prerequisites.length === 0 || prerequisites.some(prerequisite =>
                  updatedDisplayedClustersList.some(displayedCluster => displayedCluster.id === prerequisite.id && displayedCluster.status !== "failed")
                );

                //console.log("checkPrerequisites:", cluster.name, prerequisitesMet);
                if (prerequisitesMet) {
                  studyYear.firstSemester.push({ ...cluster, status: null });
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
                  console.log("cluster pushed");
                  break; // Exit the clustersList loop
                }
              }
            }
          }

          const isLastSemesterEmpty = studyYear.lastSemester?.length === 0;
          //console.log("isLastSemesterEmpty", isLastSemesterEmpty);

          if (isLastSemesterEmpty) {
            console.log("the last semester is empty in study year: ", studyYear.year);
            for (let j = 0; j < clustersList.length; j++) {
              const cluster = clustersList[j];
              const nextCluster = clustersList[j + 1];
              const nextNextCluster = clustersList[j + 2];
              
              // Check if the cluster is already in the updatedDisplayedClustersList
              const isAlreadyDisplayed = updatedDisplayedClustersList.some(
                displayedCluster => displayedCluster.id === cluster.id && displayedCluster.status !== "failed"
              );
              console.log("isAlreadyDisplayed:", isAlreadyDisplayed);

              if (!isAlreadyDisplayed && cluster.lastSemester) {
                // Check prerequisites
                //console.log("cluster prerequisites: ", cluster.prerequisites);
                //console.log("updatedDisplayedClustersList: ", updatedDisplayedClustersList);
                const prerequisites = cluster.prerequisites;
                const prerequisitesMet = prerequisites.length === 0 || prerequisites.some(prerequisite =>
                  updatedDisplayedClustersList.some(displayedCluster => displayedCluster.id === prerequisite.id && displayedCluster.status !== "failed")
                );

                //console.log("checkPrerequisites:", cluster.name, prerequisitesMet);
                if (prerequisitesMet) {
                  studyYear.lastSemester.push({ ...cluster, status: null });
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
                  console.log("cluster pushed");
                  break; // Exit the clustersList loop
                }
              }
            }
          }

          if (studyYear.firstSemester?.length === 0 || studyYear.lastSemester?.length === 0) {
            console.log("cluster not pushed");
            setCallYourCoach(true);
            handleReset();
            break;
          }

        }

        return updatedStudyYears;
      });

      // Reset the putBack state after processing
      setPutBack(false);
    }
  }, [putBack]);

  // Handle the reset button click
  const handleReset = () => {
    //delete everything from studyYears and fetches again
    if (selectedGraduateProfile && selectedGraduateProfile?.id) {
      // fetch study years
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

  return (
    <div className={"w-screen flex flex-row gap-0"}>
      {/* Sidebar */}
      <Navigation />

      {/* Main Content */}
      <div
        className={`${selectedGraduateProfile ? "flex" : "hidden"} pt-[100px] max-w-[1366px] relative w-full xl:p-[50px] p-[20px] md:pt-[75px] pb-[75px] gap-0 box-border h-auto flex-col lg:flex-row lg:flex-wrap justify-center align-middle items-center content-center`}>

        {/* Display all objects in the displayedStudyYears array */}
        {/*<div className="w-full flex flex-col gap-4">
          {displayedStudyYears.map((studyYear, index) => (
            <pre key={index} className="bg-gray-100 p-4 rounded shadow overflow-x-auto">
              {JSON.stringify(studyYear, null, 2)}
            </pre>
          ))}
        </div>*/}

        {/* Display all objects in the clustersList array */}
        {/*<div className="w-full flex flex-col gap-4">
                    clustersList array
                    {clustersList.map((cluster, index) => (
                        <pre key={index} className="bg-gray-100 p-4 rounded shadow overflow-x-auto">
                            {JSON.stringify(cluster, null, 2)}
                        </pre>
                    ))}
                </div>*/}

        {/* Display all objects in the displayedClustersList array */}
        {/*<div className="w-full flex flex-col gap-4">
                    displayedClustersList array
                    {displayedClustersList.map((cluster, index) => (
                        <pre key={index} className="bg-gray-100 p-4 rounded shadow overflow-x-auto">
                            {JSON.stringify(cluster, null, 2)}
                        </pre>
                    ))}
                </div>*/}

        {/* Scrollable content for StudyYears */}
        {selectedGraduateProfile && displayedStudyYears && displayedStudyYears.length > 0 ? displayedStudyYears.map((studyYear, index) => {
          const isLastOddStudyYear = displayedStudyYears.length % 2 === 1 && index === displayedStudyYears.length - 1;
          return (
            <React.Fragment key={"study-year-" + index}>
              <StudyYear
                year={studyYear?.year}
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
              >
                {/* Line from right side to bottom */}
                {index % 2 === 1 && index !== displayedStudyYears.length - 1 && (
                  <div
                    style={{ backgroundColor: selectedGraduateProfile?.color }}
                    className={`ease-in-out duration-200 hidden lg:flex absolute top-[calc(50%-5px)] right-0 w-[10px] h-[calc(50%+50px)] bg-${selectedGraduateProfile?.color} box-border`}>
                  </div>
                )}

                {/* Line from left side to bottom */}
                {index % 2 === 0 && (index !== displayedStudyYears.length - 1 || isLastOddStudyYear) && index !== 0 && (
                  <div
                    style={{ backgroundColor: selectedGraduateProfile?.color }}
                    className={`ease-in-out duration-200 hidden lg:flex absolute bottom-[calc(50%-5px)] left-[32.5px] w-[10px] h-[calc(50%+50px)] bg-${selectedGraduateProfile?.color} box-border`}>
                  </div>
                )}
              </StudyYear>

              {/* Horizontal line */}
              {index % 2 === 1 && index !== displayedStudyYears.length - 1 && (
                <div className={"hidden pt-[50px] m-0 pb-[50px] lg:flex w-full justify-center align-middle items-center z-[1]"}>
                  <div
                    style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                    className={`absolute left-[52.5px] xl:left-[82.5px] h-[10px] w-[calc(100%-72.5px)] xl:w-[calc(100%-132.5px)] bg-${selectedGraduateProfile?.color} box-border`}>
                    <div
                      style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                      className={"w-[10px] h-[55px] absolute left-0"} />

                    <div
                      style={{ backgroundColor: selectedGraduateProfile?.color, transition: "ease-in-out duration-200 background-color" }}
                      className={"w-[10px] h-[100px] absolute right-[0px] bottom-1/2"} />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        }) : (
          <StudyRouteLoader />
        )}
      </div>

      {/*Reset button*/}
      <div className="fixed top-[20px] right-[20px] z-10">
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-[20px] py-[10px] rounded-[8px] hover:bg-red-600 transition duration-200"
        >
          Reset
        </button>
      </div>

      {/* Call your coach */}
      {callYourCoach && (
        <div className="absolute items-center z-10">
          <p className="text-red-500 font-bold">Neem contact op met je coach!</p>
        </div>
      )}

    </div>
  );
};

export default Home;
