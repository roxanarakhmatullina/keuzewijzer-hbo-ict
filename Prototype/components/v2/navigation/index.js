'use client'
import React from 'react'
import MobileNav from "@/components/v2/navigation/mobile";
import DesktopNav from "@/components/v2/navigation/dekstop";

const Navigation = ({selectedGraduateProfile, setSelectedGraduateProfile, startedStudyYear, setStartedStudyYear}) => {
    const [graduateProfiles, setGraduateProfiles] = React.useState([]);
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    const [availableStudyYears, setAvailableStudyYears] = React.useState([
        "2019 of eerder",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
    ]);

    React.useEffect(() => {
        const fetchGraduateProfiles = async () => {
            try {
                // const response = await fetch('/nieuw/prototype/v2/graduate-profiles.json');
                const response = await fetch('/prototype/v2/graduate-profiles.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGraduateProfiles(data);
            } catch (error) {
                console.error('Error fetching the graduate profiles:', error);
            }
        };

        fetchGraduateProfiles();
    }, []);
    return (
        <>
            <DesktopNav
                availableStudyYears={availableStudyYears}
                startedStudyYear={startedStudyYear}
                setStartedStudyYear={setStartedStudyYear}
                selectedGraduateProfile={selectedGraduateProfile} setSelectedGraduateProfile={setSelectedGraduateProfile} graduateProfiles={graduateProfiles} navbarOpen={navbarOpen}/>
            <MobileNav
                availableStudyYears={availableStudyYears}
                startedStudyYear={startedStudyYear}
                setStartedStudyYear={setStartedStudyYear}
                selectedGraduateProfile={selectedGraduateProfile} setSelectedGraduateProfile={setSelectedGraduateProfile} setNavbarOpen={setNavbarOpen} navbarOpen={navbarOpen} graduateProfiles={graduateProfiles} />
        </>
    )
}

export default Navigation;