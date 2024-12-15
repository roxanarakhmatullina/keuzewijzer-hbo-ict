'use client'
import React, {createContext, useEffect, useState} from 'react'

export const GoogleAnalyticsContext = createContext();

const GoogleAnalyticsProvider = ({children}) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <GoogleAnalyticsContext.Provider value={{showModal, setShowModal}}>
            {children}
        </GoogleAnalyticsContext.Provider>
    )
}

export default GoogleAnalyticsProvider;