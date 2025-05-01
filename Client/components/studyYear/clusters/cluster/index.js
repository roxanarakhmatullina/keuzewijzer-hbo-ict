'use client';
import React, { useState, useRef } from 'react';
import ClusterInfo from "@/components/studyYear/clusters/cluster/info";
import Retry from "@/icons/retry";
import Free_Space_Menu from './free_space';
import { api, useLocation } from "@/hooks/api";

const Cluster = ({
  clusterID,
  name,
  link,
  canChange,
  clusterSelected,
  clustersSize,
  isFreeChoice,
  isRetaken,
  cohort,
  updatedClusterStatus,
  initialStatus,
  handleMultipleClustersDelayed,
  multipleChoiceClustersOpen,
  setMultipleChoicePopUp,
  menuDisabled,
  setShutDown,
  clusterList,
  displayedClusterList,
  semester,
  setRefresh,
}) => {
  const [hoverLink, setHoverLink] = useState(false);
  const [hoverCluster, setHoverCluster] = useState(false);
  const [openClusters, setOpenClusters] = useState(false);
  const [location] = useLocation();
  const [openRetakeMenu, setOpenRetakeMenu] = useState(false);
  const [clusterStatus, setClusterStatus] = useState(initialStatus);
  const retakeMenuRef = useRef(null);
  const [openFreeMenu, setOpenFreeMenu] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [subMenu, setSubMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [menuHeight, setMenuHeight] = useState('auto');
  const menuContentRef = useRef(null);

  const handleHoverLink = () => {
    setHoverLink(!hoverLink);
  };

  const handleClick = () => {
    if (isFreeChoice) {
      setOpenClusters(true);
      setOpenFreeMenu(!openFreeMenu);
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

  const handleStatusChange = (status) => {
    setClusterStatus(status);
    // Assume there's some API or effect to be triggered here
  };

  const handleOpenRetakeMenu = () => {
    setOpenRetakeMenu(!openRetakeMenu);
  };

  return (
    <div className="relative">
      <div
        onMouseEnter={handleHoverCluster}
        onMouseLeave={handleHoverCluster}
        onTouchStart={handleHoverCluster}
        onTouchEnd={handleHoverCluster}
        onClick={handleClick}
        onKeyDown={handleKeyDownCluster}
        tabIndex={0}
        role="button"
        aria-pressed={openClusters}
        style={{ zIndex: hoverCluster ? 2 : 0 }}
        className={`w-full min-w-full sm:min-w-[250px] lg:max-w-[250px] ${!clusterSelected && clustersSize > 1 && "cursor-pointer hover:brightness-95 "} h-[75px] ${isFreeChoice ? `bg-transparent border-2 border-dashed border-[#424242]` : "bg-[#fff]"} cursor-auto rounded-[12px] p-[20px] flex justify-between items-center`}
      >
        <h1 className="text-left flex-auto text-[14px] font-bold" style={{ lineHeight: "1.25" }}>{name}</h1>
        <div className="flex flex-row gap-[10px] items-center">
          {(clusterSelected || clustersSize === 1) && canChange && (
            <div className="w-[40px] h-[40px] p-[10px] rounded-full flex justify-center items-center" style={{ backgroundColor: "rgba(18,68,119, 0.25)" }}>
              <svg className="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="..." fill="black" />
              </svg>
            </div>
          )}

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
            tabIndex={link ? 0 : -1}
            role={link ? "button" : undefined}
            className="w-[40px] h-[40px] rounded-full flex justify-center items-center"
            style={{
              backgroundColor: (link && link !== "-") ? "#b4c7db" : "#e5e5e5",
              color: (link && link !== "-") ? "#000" : "#c5c5c5",
            }}
          >
            <p className="text-lg font-black">i</p>
          </div>
        </div>
      </div>

      {/* Retake Menu */}
      <div ref={retakeMenuRef} className="relative">
        {!menuDisabled && !isFreeChoice && clusterSelected?.level !== 4 && clusterStatus == null && !handleMultipleClustersDelayed && (
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
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              ) : (
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
              )}
            </button>

            {openRetakeMenu && (
              <div className="absolute bg-white rounded-lg p-2 flex flex-col z-10 shadow" style={{ minWidth: "170px", right: "0px", top: "calc(100% + 10px)" }}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-100"
                  onClick={() => {
                    handleStatusChange("passed");
                    setOpenRetakeMenu(false);
                    setShutDown(true);
                  }}
                >
                  ✅ <span className="text-sm font-medium text-gray-700">Gehaald</span>
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-100"
                  onClick={() => {
                    handleStatusChange("failed");
                    setOpenRetakeMenu(false);
                    setShutDown(true);
                  }}
                >
                  ❌ <span className="text-sm font-medium text-gray-700">Niet gehaald</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Optional: Free_Space_Menu or other overlays can go here */}
      {openFreeMenu && (
        <div className="absolute z-[2] bg-white shadow-lg rounded-md p-4 transition-transform scale-100 opacity-100">
          <Free_Space_Menu
            clusterID={clusterID}
            clusterList={clusterList}
            displayedClusterList={displayedClusterList}
            setOpenFreeMenu={setOpenFreeMenu}
            setRefresh={setRefresh}
            semester={semester}
          />
        </div>
      )}
    </div>
  );
};

export default Cluster;
