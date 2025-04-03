'use client'
import React, { useState, useEffect } from 'react';
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
  menuDisabled
}) => {
  const [hoverLink, setHoverLink] = useState(false);
  const [hoverCluster, setHoverCluster] = useState(false);
  const [openClusters, setOpenClusters] = useState(false);
  const [openRetakeMenu, setOpenRetakeMenu] = useState(false);
  const [clusterStatus, setClusterStatus] = useState(initialStatus);

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
  };

  useEffect(() => {
    setClusterStatus(initialStatus);
  }, [initialStatus]);

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
      className={`w-full min-w-full sm:min-w-[250px] lg:max-w-[250px] h-[75px] rounded-lg p-5 flex justify-between items-center relative cursor-pointer ${
        isFreeChoice ? "border-2 border-dashed border-[#424242]" : ""
      }`}
    >
      <h1 className="text-left flex-auto text-sm font-bold text-black">{name}</h1>

      <div className="flex items-center gap-2">
        {(clusterSelected || clustersSize === 1) && canChange && (
          <div className="w-10 h-10 p-2 rounded-full flex justify-center items-center bg-blue-100">
            <Retry className="w-full h-full" />
          </div>
        )}

        <button
          onClick={() => link && window.open(link.startsWith("http") ? link : `https://${link}`, "_blank")}
          className="w-10 h-10 flex justify-center items-center rounded-full text-lg font-black bg-blue-200 text-black"
        >
          i
        </button>

        <div className="relative">
          {!menuDisabled && !isFreeChoice && clusterSelected?.level !== 4 && clusterStatus !== "failed" && !handleMultipleClusters && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenRetakeMenu();
                }}
                className="w-9 h-9 rounded-full flex justify-center items-center bg-white shadow-md hover:bg-gray-100 z-[50]"
              >
                {openRetakeMenu ? "×" : "⋮"}
              </button>

              {openRetakeMenu && (
                <div
                  className="absolute left-0 top-[calc(100%+10px)] bg-white shadow-lg rounded-lg p-2 flex flex-col gap-1 min-w-[170px] border border-gray-200 z-[50]"
                >
                  <button
                    onClick={() => {
                      handleStatusChange("passed");
                      setOpenRetakeMenu(false);
                    }}
                    className="menu-item flex items-center px-3 hover:bg-green-100 text-[16px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="mr-[5px]">
                      <path fill="#16a34a" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                    </svg>
                    Passed
                  </button>

                  <button
                    onClick={() => {
                      handleStatusChange("failed");
                      setOpenRetakeMenu(false);
                    }}
                    className="menu-item flex items-center px-3 hover:bg-red-100 text-[16px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="mr-[5px]">
                      <path fill="#dc2626" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                    </svg>
                    Failed
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