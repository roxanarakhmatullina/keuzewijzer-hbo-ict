'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

const ApiContext = createContext();

export const useApi = () => {
    return useContext(ApiContext);
};

const APIProvider = ({ children }) => {
    const [clusters, setClusters] = useState([]);
    const [graduateProfiles, setGraduateProfiles] = useState([]);
    const [availableStudyYears, setAvailableStudyYears] = useState([]);
    const [errors, setErrors] = useState([]);

    const url = process.env.NEXT_PUBLIC_API_URL;
    const COHORTS_ENDPOINT = `${url}/cohorts/`;
    const PROFILE_ENDPOINT = `${url}/graduate-profiles/`;
    const CLUSTER_ENDPOINT = `${url}/clusters/`;


    const fetchApi = async (url, type) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            setErrors((prevErrors) => [
                ...prevErrors,
                {
                    id: new Date().getTime(),
                    type,
                    message: `Er is iets misgegaan bij het ophalen van ${type}. Probeer het later opnieuw.`,
                    error,
                },
            ]);
            return null;
        }
    };

    useEffect(() => {
        // Fetch graduate profiles
        fetchApi(PROFILE_ENDPOINT, "graduate profiles").then((data) => {
            if (data) setGraduateProfiles(data);
            else (console.log("FAILURE ON API"));
        });



        // Fetch study years
        fetchApi(CLUSTER_ENDPOINT, "study years").then((data) => {
            if (data) setClusters(data);
            else (console.log("FAILURE ON API"));
        });

        fetchApi(CLUSTER_ENDPOINT, "study years").then((data) => {
            if (data) setClusters(data);
            else (console.log("FAILURE ON API"));
        });


        // Fetch available study years
        fetchApi(COHORTS_ENDPOINT, "cohort study years").then((data) => {
            if (data) {
                const cohortYears = data.map((cohort) => cohort.name);
                setAvailableStudyYears(cohortYears);
            }
            else (console.log("FAILURE ON API"));
        });




        return () => {
            // Optional cleanup if needed
        };
    }, []);

    return (
        <ApiContext.Provider
            value={{
                graduateProfiles,
                clusters,
                availableStudyYears,
                errors,


            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

export default APIProvider;
