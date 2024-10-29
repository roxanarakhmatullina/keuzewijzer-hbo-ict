'use client'
import React, {createContext, useContext, useEffect, useState} from 'react'
import axios from "axios";

const ApiContext = createContext();

export const useApi = () => {
    return useContext(ApiContext);
}

const ApiProvider = ({children}) => {
    const [currentSavedStudyYear, setCurrentSavedStudyYear] = useState(null);
    const [selectedGraduateProfile, setSelectedGraduateProfile] = useState(null);
    const [startedStudyYear, setStartedStudyYear] = useState(null);
    const [availableStudyYears, setAvailableStudyYears] = useState([
        "2019 of eerder",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
    ]);

    const [studyYears, setStudyYears] = useState([]);
    const [graduateProfiles, setGraduateProfiles] = useState([]);


    const fetchApi = async (url) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }

    useEffect(() => {
        // fetch graduate profiles
        fetchApi('/prototype/v2/graduate-profiles.json').then(data => setGraduateProfiles(data));

        // fetch study years
        fetchApi('/prototype/v2/graduate-paths.json').then(data => setStudyYears(data));

        return () => {
            // cleanup

        };
    }, []);


    return (
        <ApiContext.Provider value={{graduateProfiles, studyYears,
            availableStudyYears, startedStudyYear,
            setStartedStudyYear, selectedGraduateProfile,
            setSelectedGraduateProfile, currentSavedStudyYear,
            setCurrentSavedStudyYear}}>
            {children}
        </ApiContext.Provider>
    )
}

export default ApiProvider;