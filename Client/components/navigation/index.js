'use client'
import React, {useState} from 'react'
import DesktopNav from "@/components/navigation/dekstop";

const Navigation = () => {
    const [navbarOpen, setNavbarOpen] = useState(true);

    return (
        <>
            <DesktopNav navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen}/>
        </>
    )
}

export default Navigation;