'use client';
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/navigation';
import StudyYear from "@/components/studyYear";
import {useError, useGraduateProfile, useStudyYear, useLocation} from "@/hooks";
import {api} from "@/hooks/api";
import StudyRouteLoader from "@/components/loaders/studyRouteLoader";

const Home = () => {
    const {studyYears, startedStudyYear, setStudyYears} = useStudyYear();
    const {selectedGraduateProfile} = useGraduateProfile();
    const {setErrors, errors} = useError();
    const {location} = useLocation;

    useEffect(() => {
        if(selectedGraduateProfile && selectedGraduateProfile?.id) {
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
    

    const isClusterAvailableInLocation = (cluster, location) => { 
        
        return cluster.locations.includes(location); 
    }; 

    const getClusterLocationLabel = (cluster) => {
        if (cluster.Zwolle && cluster.Almere) {
            return 'Beschikbaar in Zwolle en Almere';
        } else if (cluster.Zwolle) {
            return 'Beschikbaar in Zwolle';
        } else if (cluster.Almere) {
            return 'Beschikbaar in Almere';
        } else {
            return 'Niet beschikbaar voor deze locatie';
        }
    };
    const shouldShowLabel = (cluster, userLocation) => {
        // Only show label if the cluster is not available for the user's location
        return (userLocation === 'Almere' && !cluster.Almere) || (userLocation === 'Zwolle' && !cluster.Zwolle);
    };
    return (
        <div className={"w-screen flex flex-row gap-0"}>
            {/* Sidebar */}
            <Navigation/>

            {/* Main Content */}
            <div
                className={`${selectedGraduateProfile ? "flex" : 'hidden'} pt-[100px] max-w-[1366px] relative w-full xl:p-[50px] p-[20px] md:pt-[75px] pb-[75px] gap-0 box-border h-auto flex-col lg:flex-row lg:flex-wrap justify-center align-middle items-center content-center`}>

                {/* Scrollable content for StudyYears */}
                {selectedGraduateProfile && studyYears && studyYears.length > 0 ? studyYears.map((studyYear, index) => {
                    return (
                        <React.Fragment key={"study-year-" + index}>
                            <StudyYear
                                year={studyYear?.year}
                                firstClusters={studyYear?.firstSemester}
                                secondClusters={studyYear?.lastSemester}
                                selectedGraduateProfile={selectedGraduateProfile}
                                studyYears={studyYears}
                                isLastStudyYear={index === studyYears.length - 1}
                                isEndOfRow={index % 2 === 1 && index !== studyYears.length - 1}
                            >
                                {/* Line from right side to bottom */}
                                {index % 2 === 1 && index !== studyYears.length - 1 && (
                                    <div
                                        style={{backgroundColor: selectedGraduateProfile?.color}}
                                        className={`ease-in-out duration-200 hidden lg:flex absolute top-[calc(50%-5px)] right-0 w-[10px] h-[calc(50%+5px)] bg-${selectedGraduateProfile?.color} box-border`}>
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

      {/* Reset Pop-Up */}
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
      {/*Fucking Decide Pop-Up*/}
      {multipleChoicePopUp && (
        <div className="fixed lg:left-[250px] md:left-[250px] inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
          <div
            className="flex flex-col items-center w-[300px] bg-white rounded-[12px] p-[16px] shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setMultipleChoicePopUp(false)}
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
            <p className="text-[16px] font-bold text-center text-gray-800 mb-2">
              You dumb Fuck!!!
            </p>
            <p className="text-[14px] text-gray-600 text-center mb-4">
              Decide between the clusters
            </p>
            <button
              onClick={() => setMultipleChoicePopUp(false)}
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