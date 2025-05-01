'use client'
import React, {useEffect, useState} from 'react';
import {useGraduateProfile, useError, useLocation} from "@/hooks";
import SkeletonLoader from "@/components/loaders/skeletonLoader";

const Locations = ({navbarOpen}) => {
    const {selectedGraduateProfile} = useGraduateProfile();
    const {errors, setErrors} = useError();
    const {location, setLocation, availableLocations, setAvailableLocations} = useLocation();

    // Temporary hardcoded locations
    const [hardcodedLocations] = useState([
        { name: "Zwolle" },
        { name: "Almere" }
    ]);

    useEffect(() => {
        // Commented out the API call for fetching locations
        // api.get("/Locations").then(res => {
        //     setAvailableLocations(res.data);
        // })
        // .catch(error => {
        //     setErrors([...errors, {
        //         id: new Date().getTime(),
        //         type: "locations",
        //         message: 'Er is iets misgegaan bij het ophalen van de locaties. Probeer het later opnieuw.',
        //         error: error,
        //     }]);
        // });

        // Using hardcoded locations instead
        setAvailableLocations(hardcodedLocations);
    }, [setAvailableLocations, hardcodedLocations]);

    const handleKeyDown = (event, loc) => {
        if (event.key === 'Enter' || event.key === ' ') setLocation(loc);
    };

    const clusterSupportsUserLocation = false;

    const profilesAvailableInZwolle = Array.isArray(selectedGraduateProfile) ? 
    selectedGraduateProfile.filter(profile => 
        profile.Zwolle === true && profile.Almere === false
    ) : [];


    return (
        <div
            className={`${navbarOpen ? "flex md:flex" : "hidden md:flex"} w-full md:max-w-[300px] h-auto flex flex-col gap-[15px] justify-center align-middle items-center`}>

            {!location && (
                <>
                    <p className={"w-full text-center font-bold"}>Waar wil je studeren?</p>
                    <div className={"w-full h-auto flex flex-col gap-[10px] justify-center align-middle items-center box-border rounded-[12px]"}>
                        {availableLocations && availableLocations?.length > 0 ? availableLocations.map((loc, index) => (
                            <div key={index} onClick={() => setLocation(loc)} onKeyDown={(event) => handleKeyDown(event, loc)} // Handle keyboard events
                            tabIndex={0} // Make div focusable via Tab key
                                 className={"hover:brightness-95 w-full h-[50px] bg-[#f3f3f3] rounded-[12px] p-[10px] box-border cursor-pointer flex justify-start flex-row gap-[10px] align-middle items-center"}>
                                <div
                                    className={"w-[25px] h-[25px] border-[3px] box-border border-[#124477] bg-transparent rounded-full flex justify-center align-middle items-center"}>
                                    <div
                                        className={`${location?.name === loc?.name ? "w-[15px] h-[15px]" : "w-[0px] h-[0px]"} ease-in-out duration-300 rounded-full bg-[#124477]`}/>
                                </div>
                                <p className={"text-[#124477] text-[14px] font-bold"}>{loc?.name}</p>
                            </div>
                        )) : <SkeletonLoader/>}

                        {errors && errors.length > 0 && (
                            errors.filter(error => error.type === "locations").map((error) => (
                                <div key={error?.id} className={"w-full h-auto p-[20px] border-[1px] border-[#c00c00] bg-[rgba(255,0,0,0.1)] rounded-[12px] box-border"}>
                                    {error.message}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {location?.name === "Almere" && profilesAvailableInZwolle?.length > 0 && (
                <div className="w-full text-center">
                    <h3 className="font-bold text-lg">Available in Zwolle:</h3>
                    {profilesAvailableInZwolle.map((profile, index) => (
                        <div key={index} className="w-full bg-[#f3f3f3] p-[10px] rounded-[12px] mt-[10px]">
                            <p>{profile.name}</p>
                        </div>
                    ))}
                </div>
            )}


            {(!location && !selectedGraduateProfile) && (
                <button
                onClick={() => location && !selectedGraduateProfile && setLocation(location)}
                className={`hover:brightness-95 w-full h-[50px] font-bold ${location && !selectedGraduateProfile 
                    ? "bg-[#124477] text-white" 
                    : "bg-[#e5e5e5] pointer-events-none text-[#888888]"} rounded-[12px] p-[10px] box-border`}
                aria-disabled={!location || selectedGraduateProfile}
                aria-label={location && !selectedGraduateProfile 
                    ? "Proceed to the next step" 
              
                  : "You must select a location and graduate profile to proceed"}

            >
                Volgende
            </button>
            )}
        </div>
    );
};

export default Locations;