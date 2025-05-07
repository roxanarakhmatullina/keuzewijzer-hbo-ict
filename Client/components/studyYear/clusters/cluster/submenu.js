'use client'
import React, { use, useState, useEffect, useRef, useLayoutEffect } from 'react';

const SubMenu = ({ subMenu, setSubMenu, subMenuItems, setSelected, setSubMenuHeight, clusterId, displayedClustersList, semester }) => {
    const [title, setTitle] = useState(null);

    useEffect(() => {
        if (subMenu) {
            setTitle(subMenu.name); // Immediately set to true when the menu opens
        } else {
            const timeout = setTimeout(() => {
                setTitle(null); // Delay setting to false by 500ms when the menu closes
            }, 500);

            return () => clearTimeout(timeout); // Cleanup timeout on component unmount or when `openFreeMenu` changes
        }
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

    useEffect(() => {
        if (subMenuRef.current && subMenu) {
            const timeout = setTimeout(() => {
                const rect = subMenuRef.current.getBoundingClientRect();
                setSubMenuHeight(rect.height);
                hasMeasured.current = true; // Mark as measured
                console.log("subMenuHeight", rect.height);

            }, 0); // Delay to ensure DOM is fully rendered
            return () => clearTimeout(timeout); // Cleanup timeout on component unmount
        }
    }, [subMenu]);

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

    const checkSemester = (item) => {
        if ((semester === "firstSemester" && item.firstSemester === true) || (semester === "lastSemester" && item.lastSemester === true)) {
            return true;
        } else {
            return false;
        }
    };

    const checkAttendancePrerequisite = (item) => {
        let check = false;
        displayedClustersList.forEach((cluster) => {
            if (cluster.level === item.level) {
                check = true;
            }
        });
        return check;
    };

    const checkPrerequisite = (item) => {
        return true;
    };
    

    return (
        <div ref={subMenuRef} className="flex flex-col relative w-full h-full lg:h-auto lg:max-h-[551px] py-[20px] px-[30px] lg:p-[10px] box-border lg:rounded-[12px] bg-[#D9D9D9] align-middle items-center gap-[20px] lg:gap-[10px]">
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

            <p className="text-left text-[20px] lg:text-[14px] font-bold">{title}</p>

            <div className="flex flex-col w-full h-auto gap-[10px] overflow-y-auto">
                {subMenuItems.map((item) => (
                    <div key={item.id} onClick={checkSemester(item) && checkAttendancePrerequisite(item) && checkPrerequisite(item) ? () => handleClick(item) : null} className="flex flex-row relative w-full lg:max-w-[250px] min-h-[75px] max-h-[75px] p-[20px] box-border rounded-[12px] bg-[#fff] justify-between align-middle items-center gap-[10px] hover: cursor-pointer cursor-auto">
                        {console.log("attendance", item.name, checkAttendancePrerequisite(item))}
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
                            className="cluster-info relative cursor-pointer w-[40px] h-[40px] rounded-full flex justify-center align-middle items-center"
                        >
                            <p className={`text-lg font-black`}>i</p>
                        </div>
                    </div>
                )

                )

                }
            </div>
        </div>
    )
};

export default SubMenu;