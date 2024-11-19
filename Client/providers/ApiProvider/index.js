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

    const [studyYears, setStudyYears] = useState([]);
    const [graduateProfiles, setGraduateProfiles] = useState([]);
    const [availableStudyYears, setAvailableStudyYears] = useState([]); // Empty initially

    const COHORTS_ENDPOINT = 'http://127.0.0.1:8000/keuzeApp/api/cohorts/'
    const PROFILE_ENDPOINT= 'http://127.0.0.1:8000/keuzeApp/api/graduate-profiles/'
    const CLUSTER_ENDPOINT= 'http://127.0.0.1:8000/keuzeApp/api/clusters/'

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
        fetchApi(PROFILE_ENDPOINT).then(data => setGraduateProfiles(data));

        // fetch study years
        fetchApi(CLUSTER_ENDPOINT).then(data => setStudyYears(data));

        fetchApi(COHORTS_ENDPOINT).then(data => {
            const cohortYears = data.map(cohort => cohort.name);
            setAvailableStudyYears(cohortYears);
        });

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