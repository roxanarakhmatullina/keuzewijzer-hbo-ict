'use client'
import React, {createContext, useState} from 'react'

export const LocationContext = createContext();

const LocationProvider = ({children}) => {
    const [location, setLocation] = useState(null);
    const [availableLocations, setAvailableLocations] = useState([]);

    return (
        <LocationContext.Provider value={{
            location, setLocation,
            availableLocations, setAvailableLocations}}
        >
            {children}
        </LocationContext.Provider>
    )
}

export default LocationProvider;