'use client'
import React, {useEffect} from 'react'
import {useGraduateProfile, useError, useStudyYear} from "@/hooks";
import GraduateProfile from "@/components/navigation/graduateProfiles/graduateProfile";
import SkeletonLoader from "@/components/loaders/skeletonLoader";
import {fetchApi} from "@/hooks/api";

const GraduateProfiles = ({setNavbarOpen}) => {
    const {selectedGraduateProfile, graduateProfiles, setGraduateProfiles} = useGraduateProfile();
    const {setStudyYears} = useStudyYear();
    const {errors, setErrors} = useError();

    useEffect(() => {
        // fetch graduate profiles
        fetchApi("/graduate-profiles/").then(data => {
            setGraduateProfiles(data);
        }).catch(error => {
            console.log("hewyghreyfh");
            setErrors([...errors, {
                id: new Date().getTime(),
                type: "profiles",
                message: 'Er is iets misgegaan bij het ophalen van de afstudeerprofielen. Probeer het later opnieuw.',
                error: error,
            }]);
        })

        // fetch study years
        fetchApi("/clusters/").then(data => {
            setStudyYears(data.data)
        }).catch(error => {
                setErrors([...errors, {
                    id: new Date().getTime(),
                    type: "clusters",
                    message: 'Er is iets misgegaan bij het ophalen van de clusters. Probeer het later opnieuw.',
                    error: error,
                }]);
            })
    }, []);

    return (
        <div
            className={`flex w-full md:max-w-[300px] h-auto flex-col gap-[15px] justify-center align-middle items-center`}>
            <p className={`w-full text-center ${selectedGraduateProfile ? "md:text-left md:text-[13px]" : ""} font-bold`}>
                Afstudeerprofielen:
            </p>

            {/* Profiles */}
            <div
                className={"w-full h-auto flex flex-col gap-[10px] box-border justify-center align-middle items-center"}>
                {graduateProfiles && graduateProfiles.length > 0 ? graduateProfiles.map((graduateProfile) => (
                    <GraduateProfile key={"graduate-profile-"+ graduateProfile.id} {...graduateProfile} />
                )) : <SkeletonLoader/>}

                {errors && errors.length > 0 && (
                    errors.filter(error => (error.type === "profiles" || error.type === "clusters")).map((error) => (
                        <div key={error.id} className={"w-full h-auto p-[20px] border-[1px] border-[#c00c00] bg-[rgba(255,0,0,0.1)] rounded-[12px] box-border"}>
                            {error.message}
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={() => setNavbarOpen(false)}
                className={`md:hidden hover:brightness-95 w-full h-[50px] font-bold ${selectedGraduateProfile ? "bg-[#124477] text-white" : "bg-[#e5e5e5] pointer-events-none text-[#c5c5c5]"} rounded-[12px] p-[10px] box-border`}>Volgende
            </button>
        </div>
    )
}

export default GraduateProfiles;