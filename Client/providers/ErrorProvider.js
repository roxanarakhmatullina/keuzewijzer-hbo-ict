'use client'
import React, {createContext, useState} from 'react'

export const ErrorContext = createContext();

const ErrorProvider = ({children}) => {
    const [errors, setErrors] = useState([]);

    return (
        <ErrorContext.Provider value={{errors, setErrors}}>
            {children}
        </ErrorContext.Provider>
    )
}

export default ErrorProvider;