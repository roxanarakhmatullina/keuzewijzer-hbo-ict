'use client'
import React, { createContext, useContext, useState } from 'react';

const ContextProviderContext = createContext();

export const useContextProvider = () => {
    return useContext(ContextProviderContext);
};


const firstAvailable = (cluster, studyYear) => {
    const startYearIndex = Math.floor(cluster.order / 2);
    const startSemesterIndex = cluster.order % 2;

    for (let yearIndex = startYearIndex; yearIndex < studyYear.length; yearIndex++) {

        if (!studyYear[yearIndex].firstSemester.blocked && cluster.autumn_semester) {
            return yearIndex * 2; // Autumn semester (first semester)
        }

        if (!studyYear[yearIndex].lastSemester.blocked && cluster.spring_semester) {
            return yearIndex * 2 + 1; // Spring semester (last semester)
        }
    }

    return -1;
};



const createYears = (clusters) => {
    const highestOrder = clusters.reduce((max, cluster) => {
        return cluster.order > max ? cluster.order : max;
    }, 0);

    const numYears = Math.ceil(highestOrder / 2);
    const studyYears = Array.from({ length: numYears }, () => ({
        firstSemester: {clusters: [], blocked: false},
        lastSemester: {clusters: [], blocked: false},
    }));
    return studyYears;
};







const ContextProvider = ({ children }) => {
    const [currentSavedStudyYear, setCurrentSavedStudyYear] = useState(null);
    const [selectedGraduateProfile, setSelectedGraduateProfile] = useState(null);
    const [startedStudyYear, setStartedStudyYear] = useState(null);

    console.log("ContextProvider initialized");

    return (
        <ContextProviderContext.Provider
            value={{
                currentSavedStudyYear,
                setCurrentSavedStudyYear,
                selectedGraduateProfile,
                setSelectedGraduateProfile,
                startedStudyYear,
                setStartedStudyYear,
            }}
        >
            {children}
        </ContextProviderContext.Provider>
    );
};

export default ContextProvider;
