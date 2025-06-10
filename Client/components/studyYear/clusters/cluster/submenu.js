'use client'
import React, { use, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { api } from "@/hooks/api";



const SubMenu = ({setOpenFreeMenu, subMenu, setSubMenu, subMenuItems, setSelected, setSubMenuHeight, clusterId, displayedClustersList, semester, cohort, checkSemester, checkAttendancePrerequisite, checkPrerequisite }) => {
    const [title, setTitle] = useState(null);
    const [graduateProfiles, setGraduateProfiles] = useState([]);
    const [allClusters, setAllClusters] = useState([]); // Added state for all clusters

    const fetchAllClustersFromStudyRoutes = async (cohort) => {
        try {
            // Étape 1 : Récupérer tous les GraduateProfiles pour le cohort donné
            const graduateProfilesResponse = await api.get(`/Cohort/${cohort}/graduateProfiles`);
            const graduateProfiles = graduateProfilesResponse.data;

            const allClustersData = [];

            // Étape 2 : Parcourir chaque GraduateProfile
            for (const profile of graduateProfiles) {
                const studyRouteResponse = await api.get(`/StudyRoute/cohort/${cohort}/graduateProfile/${profile.id}`);
                const studyYears = studyRouteResponse.data;

                // Étape 3 : Parcourir chaque StudyYear et récupérer les clusters
                for (const studyYear of studyYears) {
                    if (studyYear.firstSemester) {
                        allClustersData.push(...studyYear.firstSemester);
                    }
                    if (studyYear.lastSemester) {
                        allClustersData.push(...studyYear.lastSemester);
                    }
                }
            }

            // Mettre à jour la variable allClusters
            setAllClusters(allClustersData);
            //console.log("allClustersData from study routes", allClustersData);
        } catch (error) {
            //console.error('Error fetching clusters from study routes:', error);
        }
    };

    useEffect(() => {
        if (subMenu) {
            setTitle(subMenu.name); // Immediately set to true when the menu opens
        } else {
            const timeout = setTimeout(() => {
                setTitle(null); // Delay setting to false by 500ms when the menu closes
            }, 500);

            return () => clearTimeout(timeout); // Cleanup timeout on component unmount or when `openFreeMenu` changes
        }
        //.log("allClusters", allClusters);
        allClusters == [];
        //console.log("allClusters", allClusters);

        fetchAllClustersFromStudyRoutes(cohort); // Fetch all clusters from graduate profiles
        //console.log("allClusters", allClusters);

    }, [subMenu]);

    const handleClick = (item) => {
        setSelected(item);
    }
    const handleClickBack = () => {
        setSubMenu(null);
    }

    const [hoverLink, setHoverLink] = useState(false);
    const [link, setLink] = useState(null);

    const handleHoverLink = () => {
        setHoverLink(!hoverLink);
    }

    const handleKeyDownLink = (e) => {
        if (e.key === 'Enter' && link) {
            window.open(link, "_blank");
        }
    };

    const subMenuRef = useRef(null);
    const hasMeasured = useRef(false); // Track if dimensions have already been measured

    // useEffect(() => {
    //     if (subMenuRef.current && subMenu) {
    //         const timeout = setTimeout(() => {
    //             const rect = subMenuRef.current.getBoundingClientRect();
    //             setSubMenuHeight(rect.height);
    //             hasMeasured.current = true; // Mark as measured
    //         }, 0); // Delay to ensure DOM is fully rendered
    //         return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    //     }
    // }, [subMenu]);

    useEffect(() => {
        if (subMenuRef.current && subMenu) {
            const observer = new MutationObserver(() => {
                const rect = subMenuRef.current.getBoundingClientRect();
                setSubMenuHeight(rect.height);
            });

            observer.observe(subMenuRef.current, { childList: true, subtree: true });

            return () => observer.disconnect(); // Cleanup observer on unmount
        }
    }, [subMenu]);

    // Check if it's scrollable
    const [isScrollable, setIsScrollable] = useState(false);
    const scrollableRef = useRef(null);

    useEffect(() => {
        const checkScrollable = () => {
            if (scrollableRef.current) {
                setIsScrollable(scrollableRef.current.scrollHeight > scrollableRef.current.clientHeight);
            }
        };
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, [subMenuItems]);

    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    const handleItemClick = (item) => {
        const messages = [];
        const isSemesterValid = checkSemester(item);
        const isAttendanceValid = checkAttendancePrerequisite(item);
        const isPrerequisiteValid = checkPrerequisite(item);

        if (!isSemesterValid) {
            if (semester === "firstSemester") {
                messages.push("- Dit semester is alleen in de tweede helft van het schooljaar beschikbaar");
            } else if (semester === "lastSemester") {
                messages.push("- Dit semester is alleen in de eerste helft van het schooljaar beschikbaar");
            }
        }
        if (!isAttendanceValid) {
            const unmetAttendance = displayedClustersList
                .filter(cluster => cluster.id !== clusterId && cluster.status === "failed")
                .map(cluster => cluster.name)
                .filter((name, idx, arr) => arr.indexOf(name) === idx); // <-- retire les doublons
            messages.push({
                type: 'attendance',
                text: '- Voor dit semester moet je eerst ',
                clusters: unmetAttendance,
                end: ' gevolgd hebben'
            });
        }
        if (!isPrerequisiteValid) {
            const unmetPrerequisites = item.prerequisiteIds
                .map(prerequisiteId => {
                    const prerequisiteCluster = allClusters.find(cluster => cluster.id === prerequisiteId);
                    return prerequisiteCluster ? prerequisiteCluster.name : `Unknown Cluster (${prerequisiteId})`;
                })
                .filter((name, idx, arr) => arr.indexOf(name) === idx); // <-- retire les doublons
            messages.push({
                type: 'prerequisite',
                text: '- Voor dit semester moet je eerst ',
                clusters: unmetPrerequisites,
                end: ' behaald hebben'
            });
        }

        if (messages.length > 0) {
            setWarningMessage(messages);
            setShowWarning(true);
        } else {
            handleClick(item);
        }
    };

    const handleCloseWarning = () => {
        const warningElement = document.querySelector('.warning-popup');
        if (warningElement) {
            warningElement.style.transition = 'opacity 0.5s ease';
            warningElement.style.opacity = '0';
            setTimeout(() => setShowWarning(false), 500); // Cache après la transition
        } else {
            setShowWarning(false);
        }
    };



    return (
        <div className="relative w-full h-full top-0 left-0 flex justify-center items-center z-50">
            {showWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div
                        className="flex flex-col justify-center items-center w-[90%] max-w-[300px] bg-white rounded-[12px] p-[16px] shadow-lg relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleCloseWarning}
                            className="absolute top-2 right-2 w-[30px] h-[30px] bg-transparent text-gray-500 hover:text-gray-700 flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <p className="font-bold text-[16px] text-gray-800 mb-2">Let op</p>
                        <div className="flex flex-col mt-4">
                            {Array.isArray(warningMessage) ? warningMessage.map((msg, idx) => (
                                typeof msg === 'string' ? (
                                    <p key={idx} className="text-[14px] text-gray-600 mb-2">{msg}</p>
                                ) : (
                                    <p key={idx} className="text-[14px] text-gray-600 mb-2">
                                        {msg.text}
                                        {msg.clusters && msg.clusters.map((name, i) => (
                                            <React.Fragment key={i}>
                                                <span className="font-bold">{name}</span>
                                                {i < msg.clusters.length - 1 && <span> of </span>}
                                            </React.Fragment>
                                        ))}
                                        {msg.end}
                                    </p>
                                )
                            )) : null}
                        </div>
                        <div className="w-full flex gap-2 mt-2">
                            <button
                                onClick={handleCloseWarning}
                                className="w-full h-[36px] bg-[#124477] rounded-[8px] text-white font-bold text-[14px]"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div ref={subMenuRef} className="flex flex-col relative w-full h-full lg:h-auto lg:max-h-[551px] lg:w-[270px] py-[20px] px-[30px] lg:p-[10px] box-border lg:rounded-[12px] bg-[#D9D9D9] align-middle items-center gap-[20px] lg:gap-[10px]">
                <button
                    onClick={handleClickBack}
                    className="flex absolute top-[20px] left-[20px] lg:top-[10px] lg:left-[10px] bg-transparent text-black justify-center items-center"
                >
                    <svg
                        onClick={handleClickBack}
                        className="w-[30px] h-[30px] lg:w-[20px] lg:h-[20px]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {(window.innerWidth < 1024) && (<button
                    onClick={() => {
                        setOpenFreeMenu(false);
                        setTimeout(() => handleClickBack(), 300);
                    }}
                    className="flex absolute top-[20px] right-[20px] bg-transparent text-black justify-center items-center"
                >
                    <svg
                        className="w-[30px] h-[30px]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                )}

                <p className="text-left text-[20px] lg:text-[14px] font-bold">{title}</p>

                <div
                    ref={scrollableRef}
                    className={`flex flex-col w-full h-auto rounded-[12px] gap-[10px] overflow-y-auto ${isScrollable ? 'pr-[5px]' : ''}`}
                >
                    {subMenuItems.map((item) => (
                        <div key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`flex flex-row relative w-full lg:max-w-[250px] min-h-[75px] max-h-[75px] p-[10px] box-border rounded-[12px] ${checkSemester(item) && checkAttendancePrerequisite(item) && checkPrerequisite(item) ? 'bg-[#fff] cursor-pointer opacity-100' : 'bg-[#fff] cursor-not-allowed opacity-50'} justify-between align-middle items-center gap-[10px]`}>
                            <h1
                                style={{ lineHeight: "1.25" }}
                                className={"text-left flex-auto text-[14px] font-bold"}>{item.name}</h1>

                            <div
                                onMouseEnter={handleHoverLink}
                                onMouseLeave={handleHoverLink}
                                onTouchStart={handleHoverLink}
                                onTouchEnd={handleHoverLink}
                                onClick={() => {
                                    if (link && link !== "-") {
                                        const formattedLink = link.startsWith("http://") || link.startsWith("https://")
                                            ? link
                                            : `https://${link}`;
                                        window.open(formattedLink, "_blank");
                                    }
                                }}
                                onKeyDown={handleKeyDownLink}
                                tabIndex={link ? 0 : -1} // Focusable if `link` is present
                                role={link ? "button" : undefined} // Interactive if `link` exists
                                style={{
                                    backgroundColor:
                                        (link && link !== "-") ? "#b4c7db" : "#e5e5e5",
                                    color: (link && link !== "-") ? "#000" : "#c5c5c5",
                                }}
                                className="cluster-info relative cursor-pointer w-[40px] h-[40px] min-w-[40px] rounded-full flex justify-center align-middle items-center"
                            >
                                <p className={`text-lg font-black`}>i</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubMenu;