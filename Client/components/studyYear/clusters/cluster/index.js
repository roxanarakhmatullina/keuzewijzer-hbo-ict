'use client'
import React, { useState, useEffect, useRef } from 'react';
import ClusterInfo from "@/components/studyYear/clusters/cluster/info";
import Retry from "@/icons/retry";

const Cluster = ({
  name,
  link,
  canChange,
  clusterSelected,
  clustersSize,
  isFreeChoice,
  isRetaken,
  updateClusterStatus,
  initialStatus,
  handleMultipleClusters,
  menuDisabled,
  setShutDown,
}) => {
  const [hoverLink, setHoverLink] = useState(false);
  const [hoverCluster, setHoverCluster] = useState(false);
  const [openClusters, setOpenClusters] = useState(false);
  const [openRetakeMenu, setOpenRetakeMenu] = useState(false);
  const [clusterStatus, setClusterStatus] = useState(initialStatus);
  const retakeMenuRef = useRef(null);

  const handleHoverLink = () => {
    setHoverLink(!hoverLink);
  };

  const handleClick = () => {
    if (isFreeChoice) {
      setOpenClusters(true);
    }
  };

  const handleHoverCluster = () => {
    setHoverCluster(!hoverCluster);
  };

  const handleKeyDownCluster = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleKeyDownLink = (e) => {
    if (e.key === 'Enter' && link) {
      const formattedLink = link.startsWith("http://") || link.startsWith("https://")
        ? link
        : `https://${link}`;
      window.open(formattedLink, "_blank");
    }
  };

  const handleOpenRetakeMenu = () => {
    setOpenRetakeMenu(!openRetakeMenu);
  };

  const handleStatusChange = (newStatus) => {
    if (updateClusterStatus) {
      updateClusterStatus(newStatus);
    }
    setOpenRetakeMenu(false);
  };

  useEffect(() => {
    setClusterStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (retakeMenuRef.current && !retakeMenuRef.current.contains(event.target)) {
        setOpenRetakeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleHoverCluster}
      onMouseLeave={handleHoverCluster}
      onTouchStart={handleHoverCluster}
      onTouchEnd={handleHoverCluster}
      onClick={() => handleClick()}
      onKeyDown={handleKeyDownCluster}
      tabIndex={0}
      role="button"
      aria-pressed={openClusters}
      style={{
        backgroundColor:
          clusterStatus === "passed"
            ? "#ccffcc"
            : clusterStatus === "failed"
              ? "#ffcccc"
              : isFreeChoice
                ? "transparent"
                : "#ffffff",
      }}
      className={`w-full min-w-full sm:min-w-[250px] lg:max-w-[250px] ${!clusterSelected && clustersSize > 1 && "cursor-pointer hover:brightness-95 "} h-[75px] ${isFreeChoice ? `border-2 border-dashed border-[#424242] hover:border-dashed border-spacing-[10px] cursor-pointer` : ""} cursor-auto rounded-[12px] p-[10px] box-border flex justify-between align-middle items-center flex-row gap-[10px]`}
    >

      {/*Name*/}
      <h1
        style={{ lineHeight: "1.25" }}
        className={"text-left flex-auto text-[14px] font-bold"}>{name}</h1>

      {/*Buttons*/}
      <div className="w-auto flex flex-row gap-[10px] justify-between align-middle items-center">
        {/*Info Button*/}
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
        
        {/*Retake Button*/}
        <div ref={retakeMenuRef} className="relative">
          {!menuDisabled && !isFreeChoice && clusterSelected?.level !== 4 && clusterStatus == null && !handleMultipleClusters && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenRetakeMenu();
                }}
                className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full flex justify-center items-center cursor-pointer"
                role="button"
                tabIndex={0}
              >
                {openRetakeMenu ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-black"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-black"
                  >
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                )}
              </button>

              {openRetakeMenu && (
                <div
                  className="absolute bg-white rounded-lg p-2 flex flex-col z-10 shadow"
                  style={{
                    minWidth: "170px", // Updated menu width
                    right: "0px", // Adjusted for better alignment
                    top: "calc(100% + 10px)", // Positioned below the button
                  }}
                >
                  <button
                    className="flex items-center gap-2 px-3 lg:py-1 py-4 rounded-md hover:bg-green-100"
                    onClick={() => {
                      handleStatusChange("passed");
                      setOpenRetakeMenu(false);
                      setShutDown(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="16"
                      height="16"
                      className="mr-[5px]"
                    >
                      <path
                        fill="#16a34a"
                        d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Gehaald</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 lg:py-1 py-4 rounded-md hover:bg-red-100"
                    onClick={() => {
                      handleStatusChange("failed");
                      setOpenRetakeMenu(false);
                      setShutDown(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="16"
                      height="16"
                      className="mr-[5px]"
                    >
                      <path
                        fill="#dc2626"
                        d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Niet gehaald</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cluster;