'use client'
import React, {createContext, useState} from 'react'

export const StudyYearContext = createContext();

const StudyYearProvider = ({children}) => {
    const [currentSavedStudyYear, setCurrentSavedStudyYear] = useState(null);
    const [startedStudyYear, setStartedStudyYear] = useState(null);
    const [studyYears, setStudyYears] = useState([]);
    const [availableStudyYears, setAvailableStudyYears] = useState([]);

    return (
        <StudyYearContext.Provider value={{
            studyYears, setStudyYears,
            availableStudyYears, startedStudyYear,
            setStartedStudyYear, currentSavedStudyYear,
            setCurrentSavedStudyYear, setAvailableStudyYears}}
        >
            {children}
        </StudyYearContext.Provider>
    )
}

export default StudyYearProvider;