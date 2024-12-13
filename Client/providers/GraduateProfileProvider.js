'use client'
import React, {createContext, useState} from 'react'

export const GraduateProfileContext = createContext();

const GraduateProfileProvider = ({children}) => {
    const [selectedGraduateProfile, setSelectedGraduateProfile] = useState(null);
    const [graduateProfiles, setGraduateProfiles] = useState([]);

    return (
        <GraduateProfileContext.Provider value={{
            graduateProfiles, setGraduateProfiles,
            selectedGraduateProfile, setSelectedGraduateProfile,
        }}>
            {children}
        </GraduateProfileContext.Provider>
    )
}

export default GraduateProfileProvider;