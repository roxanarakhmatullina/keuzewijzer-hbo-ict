'use client'
import React, { use, useState, useRef, useEffect, useLayoutEffect } from 'react'
import ClusterInfo from "@/components/studyYear/clusters/cluster/info";
import Retry from "@/icons/retry";
import Free_Space_Menu from './free_space';

const Cluster = ({ name, link, canChange, clusterSelected, clustersSize, isFreeChoice, isRetaken }) => {
    const [hoverLink, setHoverLink] = useState(false);
    const [hoverCluster, setHoverCluster] = useState(false);
    const [openClusters, setOpenClusters] = useState(false);
    const [openFreeMenu, setOpenFreeMenu] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleHoverLink = () => {
        setHoverLink(!hoverLink);
    }

    /*const handleClick = () => {
        if(isFreeChoice) {
            setOpenClusters(true);
        }
    };*/

    const handleClick = () => {
        if (isFreeChoice) {
            setOpenFreeMenu(!openFreeMenu);
        }
    }

    const handleHoverCluster = () => {
        setHoverCluster(!hoverCluster);
    }

    const handleKeyDownCluster = (e) => {
        if (e.key === 'Enter') {
            handleClick();
        }
    };

    const handleKeyDownLink = (e) => {
        if (e.key === 'Enter' && link) {
            window.open(link, "_blank");
        }
    };

    const clusterRef = useRef(null);
    const [distance, setDistance] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

    useEffect(() => {
        function updateDistance() {
            if (clusterRef.current) {
                const rect = clusterRef.current.getBoundingClientRect();
                setDistance({
                    top: rect.top,
                    right: window.innerWidth - rect.right,
                    bottom: window.innerHeight - rect.bottom,
                    left: rect.left
                });
            }
        }

        updateDistance();
        window.addEventListener("resize", updateDistance);
        return () => window.removeEventListener("resize", updateDistance);
    }, [openFreeMenu]);

    // Get the height and width of the menu

    const [menuHeight, setMenuHeight] = useState(null);
    const [menuWidth, setMenuWidth] = useState(null);
    const half = 75 / 2 - menuHeight / 2;


    const outerDivRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (outerDivRef.current && !outerDivRef.current.contains(event.target)) {
                setOpenFreeMenu(false);
            }
        };

        if (openFreeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openFreeMenu]);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (openFreeMenu) {
            setIsVisible(true); // Immediately set to true when the menu opens
        } else {
            const timeout = setTimeout(() => {
                setIsVisible(false); // Delay setting to false by 300ms when the menu closes
            }, 300);
    
            return () => clearTimeout(timeout); // Cleanup timeout on component unmount or when `openFreeMenu` changes
        }
    }, [openFreeMenu]);

    return (
        <div ref={outerDivRef} className=" relative w-full">
            <div
                ref={clusterRef}
                onMouseEnter={handleHoverCluster}
                onMouseLeave={handleHoverCluster}
                onTouchStart={handleHoverCluster}
                onTouchEnd={handleHoverCluster}
                onClick={() => handleClick()}
                onKeyDown={handleKeyDownCluster}
                tabIndex={0} // Makes the div focusable
                role="button" // Indicates interactivity for accessibility
                aria-pressed={openClusters} // ARIA state for toggleable behavior
                /*style={{zIndex: hoverCluster ? 2 : 0}}*/
                className={`relative w-full min-w-full sm:min-w-[250px] lg:max-w-[250px] ${!clusterSelected && clustersSize > 1 && "cursor-pointer hover:brightness-95 "} h-[75px] ${isFreeChoice && (selected === null) ? `bg-transparent border-2 border-dashed border-[#424242] hover:border-dashed border-spacing-[10px] cursor-pointer` : "bg-[#fff]"} ${isFreeChoice? 'cursor-pointer' : 'cursor-auto'}cursor-auto rounded-[12px] p-[20px] box-border flex justify-between align-middle items-center flex-row gap-[10px]`}>

                <h1
                    style={{ lineHeight: "1.25" }}
                    className={"text-left flex-auto text-[14px] font-bold"}>
                    {isFreeChoice ? (!selected ? name : selected) : name}
                </h1>

                {/*<h1>top:{distance.top}</h1>
                <h1>bottom:{distance.bottom}</h1>
                <h1>right:{distance.right}</h1>
                <h1>left:{distance.left}</h1>*/}

                <div
                    className={"w-auto flex flex-row gap-[10px] justify-between align-middle items-center"}>

                    {(clusterSelected || clustersSize === 1) && canChange && (
                        <div
                            style={{ backgroundColor: "rgba(18,68,119, 0.25)" }}
                            className={"w-[40px] h-[40px] p-[10px] box-border rounded-full flex justify-center align-middle items-center"}>
                            <svg className={"w-full h-full"} viewBox="0 0 16 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                    d="M7.32 0.0289756C8.70071 -0.0888534 10.0884 0.153982 11.347 0.733693C12.6056 1.31341 13.6921 2.21011 14.5 3.33598V1.74998C14.5 1.55106 14.579 1.3603 14.7197 1.21965C14.8603 1.07899 15.0511 0.999976 15.25 0.999976C15.4489 0.999976 15.6397 1.07899 15.7803 1.21965C15.921 1.3603 16 1.55106 16 1.74998V5.99998H11.75C11.5511 5.99998 11.3603 5.92096 11.2197 5.78031C11.079 5.63965 11 5.44889 11 5.24998C11 5.05106 11.079 4.8603 11.2197 4.71965C11.3603 4.57899 11.5511 4.49998 11.75 4.49998H13.477C12.7931 3.42988 11.8107 2.58356 10.6512 2.06556C9.4917 1.54757 8.20584 1.38058 6.95248 1.58524C5.69912 1.7899 4.53316 2.35723 3.59864 3.21715C2.66412 4.07708 2.00198 5.19192 1.694 6.42398C1.67128 6.52076 1.62955 6.61206 1.57123 6.69257C1.51291 6.77308 1.43917 6.84119 1.35429 6.89294C1.26942 6.9447 1.1751 6.97906 1.07682 6.99403C0.97854 7.00901 0.878265 7.0043 0.781825 6.98017C0.685385 6.95604 0.594703 6.91298 0.515053 6.8535C0.435404 6.79401 0.368375 6.71928 0.317865 6.63366C0.267355 6.54803 0.234371 6.45322 0.220832 6.35473C0.207293 6.25625 0.213469 6.15605 0.239 6.05998C0.643544 4.4424 1.5434 2.99166 2.81279 1.91052C4.08218 0.82939 5.65766 0.171906 7.319 0.0299756L7.32 0.0289756ZM3.92 14.881C4.99199 15.5164 6.19758 15.8925 7.44068 15.9795C8.68378 16.0665 9.93001 15.8618 11.08 15.3819C12.23 14.902 13.252 14.1601 14.0646 13.2153C14.8771 12.2704 15.4577 11.1489 15.76 9.93997C15.805 9.74817 15.7728 9.54635 15.6702 9.37814C15.5676 9.20993 15.403 9.08883 15.2119 9.04101C15.0207 8.9932 14.8185 9.02251 14.6488 9.12261C14.4791 9.22271 14.3556 9.38557 14.305 9.57598C13.9969 10.8078 13.3347 11.9223 12.4002 12.782C11.4658 13.6417 10.3 14.2089 9.04688 14.4136C7.79373 14.6182 6.50809 14.4513 5.34871 13.9336C4.18933 13.4158 3.20699 12.5698 2.523 11.5H4.25C4.44891 11.5 4.63968 11.421 4.78033 11.2803C4.92098 11.1397 5 10.9489 5 10.75C5 10.5511 4.92098 10.3603 4.78033 10.2196C4.63968 10.079 4.44891 9.99998 4.25 9.99998H0V14.25C0 14.4489 0.0790176 14.6397 0.21967 14.7803C0.360322 14.921 0.551088 15 0.75 15C0.948912 15 1.13968 14.921 1.28033 14.7803C1.42098 14.6397 1.5 14.4489 1.5 14.25V12.664C2.14478 13.5623 2.96879 14.3172 3.92 14.881Z"
                                    fill="black" />
                            </svg>
                        </div>
                    )}

                    <div className={"flex flex-row gap-[10px] justify-center align-middle items-center"}>
                        {/*{!isFreeChoice && (*/}
                        {/*    <div*/}
                        {/*        onMouseEnter={handleHoverLink}*/}
                        {/*        onMouseLeave={handleHoverLink}*/}
                        {/*        onTouchStart={handleHoverLink}*/}
                        {/*        onTouchEnd={handleHoverLink}*/}
                        {/*        className={"w-[30px] h-[30px] bg-[#b4c7db] rounded-full p-[7px] box-border flex justify-center align-middle items-center"}>*/}
                        {/*        <Retry/>*/}
                        {/*    </div>*/}
                        {/*)}*/}

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

                </div>

            </div>

            <div
                className={`absolute z-[2] transition-transform ease-in-out duration-300 ${openFreeMenu ? 'scale-100 opacity-100' : 'scale-[1%] opacity-30'}`}
                style={{ left: distance.right < 290 ? -290 : 270, top: distance.top < -half + 10 ? -distance.top + 10 : distance.bottom < -half + 10 ? window.innerHeight - menuHeight - 10 - distance.top : half, transformOrigin: distance.right < 290 ? "center right" : "center left"}}>
                {isVisible &&(<Free_Space_Menu
                    selected={selected}
                    setSelected={setSelected}
                    openFreeMenu={openFreeMenu}
                    setOpenFreeMenu={setOpenFreeMenu}
                    menuHeight={menuHeight}
                    setMenuHeight={setMenuHeight}
                    menuWidth={menuWidth}
                    setMenuWidth={setMenuWidth}
                />)}
            </div>
            {/*<h1>menuHeight: {menuHeight} menuWidth: {menuWidth}</h1>*/}
        </div>

    )
}

export default Cluster