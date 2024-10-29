'use client'
import React, {useState} from 'react'
import MobileNav from "@/components/navigation/mobile";
import DesktopNav from "@/components/navigation/dekstop";

const Navigation = () => {
    const [navbarOpen, setNavbarOpen] = useState(true);

    return (
        <>
            <DesktopNav navbarOpen={navbarOpen}/>
            <MobileNav setNavbarOpen={setNavbarOpen} navbarOpen={navbarOpen} />
        </>
    )
}

export default Navigation;