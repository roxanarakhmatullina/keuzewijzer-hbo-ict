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


const checkConditions = (cluster, order, studyYears) => {
    const yearIndex = Math.floor(order / 2);
    const semesterIndex = order % 2;

    if (
        (semesterIndex === 0 && !cluster.autumn_semester) ||
        (semesterIndex === 1 && !cluster.spring_semester)
    ) {
        return false;
    } else if (
        (semesterIndex === 0 && studyYears[yearIndex].firstSemester.blocked) ||
        (semesterIndex === 1 && studyYears[yearIndex].lastSemester.blocked)
    ) {
        return false;
    } else {
        return true
    }
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



const transformClustersToStudyYears = (clusters) => {

    const studyYears = createYears(clusters)

    clusters.forEach(cluster => {

        const yearIndex = Math.floor(cluster.order / 2); // Divide order by 2 to determine the year (0-based)
        const semesterIndex = cluster.order % 2; // If 0, firstSemester; if 1, lastSemester



        if (checkConditions(cluster, cluster.order, studyYears)) { // case it fits

            if (semesterIndex === 0){
                studyYears[yearIndex].firstSemester.clusters.push(cluster);
            } else {
                studyYears[yearIndex].lastSemester.clusters.push(cluster);
            }


        } else { // case does not fit

            const firstAvailableOrder = firstAvailable(cluster);



            if (firstAvailableOrder !== null) {

                const newYearIndex = Math.floor(firstAvailableOrder / 2);
                const newSemesterIndex = firstAvailableOrder % 2

/*
                for (let i = studyYears.length * 2 - 1; i >= firstAvailableOrder; i--) {
                    const currentYearIndex = Math.floor(i / 2);
                    const nextYearIndex = Math.floor((i - 1) / 2);

                    if (i % 2 === 0) {
                        // Shift firstSemester of the current year to lastSemester of the previous year
                        studyYears[currentYearIndex].firstSemester.clusters =
                            studyYears[nextYearIndex].lastSemester.clusters;
                    } else {
                        // Shift lastSemester of the current year to firstSemester of the previous year
                        studyYears[currentYearIndex].lastSemester.clusters =
                            studyYears[nextYearIndex].firstSemester.clusters;
                    }
                }

*/

                if (newSemesterIndex === 0){
                    studyYears[newYearIndex].firstSemester.clusters.push(cluster);
                    studyYears[newYearIndex].lastSemester.blocked = true;
                } else {
                    studyYears[newYearIndex].lastSemester.clusters.push(cluster);
                    studyYears[newYearIndex].lastSemester.blocked = true;
                }



            }
        }
    }
    );

    return studyYears;
};






const ContextProvider = ({ children }) => {
    const [currentSavedStudyYear, setCurrentSavedStudyYear] = useState(null);
    const [selectedGraduateProfile, setSelectedGraduateProfile] = useState(null);
    const [startedStudyYear, setStartedStudyYear] = useState(null);

    const [route, setRoute] = useState([]);

    const addClusterToRoute = (name) => {
        setRoute((prev) => [...prev, {id, isfree}]);
    };

    const removeClusterFromRoute = (id) => {
        setRoute((prev) => prev.filter(cluster => cluster.id !== id));
    };

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
                addClusterToRoute,
                removeClusterFromRoute,

                transformClustersToStudyYears

            }}
        >
            {children}
        </ContextProviderContext.Provider>
    );
};

export default ContextProvider;
