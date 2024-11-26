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
    const [errors, setErrors] = useState([]);
    const url = process.env.NEXT_PUBLIC_API_URL;
    const COHORTS_ENDPOINT = `${url}/cohorts/`
    const PROFILE_ENDPOINT= `${url}/graduate-profiles/`
    const CLUSTER_ENDPOINT= `${url}/clusters/`

    const fetchApi = async (url) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching the data:', error);
            return error;
        }
    }

    useEffect(() => {
        // fetch graduate profiles
        fetchApi(PROFILE_ENDPOINT).then(data => {
            setGraduateProfiles(data);
        })
            .catch(error => {
                setErrors([...errors, {
                    id: new Date().getTime(),
                    type: "profiles",
                    message: 'Er is iets misgegaan bij het ophalen van de afstudeerprofielen. Probeer het later opnieuw.',
                    error: error,
                }]);
            })

        // fetch study years
        fetchApi(CLUSTER_ENDPOINT).then(data => {
            setStudyYears(data)
        });

        fetchApi(COHORTS_ENDPOINT).then(data => {
            const cohortYears = data.map(cohort => cohort.name);
            setAvailableStudyYears(cohortYears);
        })
            .catch(error => {
                setErrors([...errors, {
                    id: new Date().getTime(),
                    type: "studyyears",
                    message: 'Er is iets misgegaan bij het ophalen van de studiejaren. Probeer het later opnieuw.',
                    error: error,
                }]);
            })

        return () => {
            // cleanup

        };
    }, []);

    return (
        <ApiContext.Provider value={{graduateProfiles, studyYears,
            availableStudyYears, startedStudyYear,
            setStartedStudyYear, selectedGraduateProfile,
            setSelectedGraduateProfile, currentSavedStudyYear,
            setCurrentSavedStudyYear, errors}}
        >
            {children}
        </ApiContext.Provider>
    )
}

export default ApiProvider;