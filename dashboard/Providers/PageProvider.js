'use client'
import React, {createContext, useContext, useState} from 'react'

const PageContext = createContext();

export const usePage = () => {
    return useContext(PageContext);
}

export const PageProvider = ({children}) => {
    const [currentPage, setCurrentPage] = useState("Dashboard");

    return (
        <PageContext.Provider value={{
            currentPage, setCurrentPage,
        }}>
            {children}
        </PageContext.Provider>
    )
}

export default PageProvider;
