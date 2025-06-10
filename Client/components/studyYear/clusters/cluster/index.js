'use client'
import React, { use, useState, useRef, useEffect, useLayoutEffect } from 'react'
import ClusterInfo from "@/components/studyYear/clusters/cluster/info";
import Retry from "@/icons/retry";
import Free_Space_Menu from './free_space';
import { api } from "@/hooks/api";

const Cluster = ({
  cluster,
  link,
  canChange,
  clusterSelected,
  clustersSize,
  cohort,
  updateClusterStatus,
  initialStatus,
  handleMultipleClustersDelayed,
  multipleChoiceClustersOpen,
  setMultipleChoicePopUp,
  menuDisabled,
  setShutDown,
  clustersList,
  displayedClustersList,
  displayedStudyYears,
  semester,
  setRefresh,
  handleClusterInvalid, // new prop
  invalidRoute,
  setInvalidRoutePopUp,
}) => {
  const [hoverLink, setHoverLink] = useState(false);
  const [hoverCluster, setHoverCluster] = useState(false);
  const [openClusters, setOpenClusters] = useState(false);
  const [openRetakeMenu, setOpenRetakeMenu] = useState(false);
  const [clusterStatus, setClusterStatus] = useState(initialStatus);
  const retakeMenuRef = useRef(null);
  const [openFreeMenu, setOpenFreeMenu] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [subMenu, setSubMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [menuHeight, setMenuHeight] = useState('auto');
  const menuContentRef = useRef(null);
  const [invalid, setInvalid] = useState(false);

  const handleHoverLink = () => {
    setHoverLink(!hoverLink);
  };

  const handleClick = () => {
    if (cluster.isFreeChoice && cluster.status === null) {
      if (!multipleChoiceClustersOpen) {
        if (invalidRoute) {
          if (invalid) {
            setOpenFreeMenu(!openFreeMenu);
          } else {
            setInvalidRoutePopUp(true);
          }
        } else {
          setOpenFreeMenu(!openFreeMenu);
        }
      }
      else {
        setMultipleChoicePopUp(true)
      }
      setTimeout(() => setSubMenu(false), 300);
    }
  }

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
    if (multipleChoiceClustersOpen) {
      setMultipleChoicePopUp(true);
    } else if (invalidRoute) {
      setInvalidRoutePopUp(true);
    } else {
      setOpenRetakeMenu(!openRetakeMenu);
      setOpenFreeMenu(false);
    }
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

  // Fetching the categories
  useEffect(() => {
    if (cohort) {
      // fetch categories
      api.get(`/Category/cohort/${cohort}`).then(res => {
        setMenuItems(res.data);
      });
    }
  }, []); // Removed the dependency array to trigger on every render

  const [subMenuItems, setSubMenuItems] = useState([]);

  //Fetch subMenu items from the API
  useEffect(() => {
    if (subMenu) {
      setSubMenuItems([]);
      // fetch categories
      api.get(`/Category/${subMenu.id}`).then(res => {
        const cohortClusters = res.data.cohortClusters;
        cohortClusters.forEach(cc => {
          if (cc.cohortId === cohort) {
            cc.clusters.forEach(c => {
              if (!clustersList.some(cluster => cluster.id === c.id)) {
                api.get(`/Cluster/${c.id}`).then(resc => {
                  setSubMenuItems(prev => [...prev, resc.data]);
                });
              }
            })
          }
        });
      });
    }
  }, [subMenu]);

  // Order Clusters
  useEffect(() => {
    if (subMenuItems && subMenuItems.length > 0) {
      subMenuItems.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [subMenuItems]);

  // Insert cluster when selected
  useEffect(() => {
    if (selected) {
      handleClusterInvalid(cluster.id, false);
      clustersList.forEach(c => {
        if (c.id === cluster.id) {
          Object.assign(c, { ...selected, isFreeChoice: true });
        }
      })
      setRefresh(true);
    }
  }, [selected]);

  const clusterRef = useRef(null);
  const [distance, setDistance] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  // Get the height and width of the menu

  const [containerHeight, setContainerHeight] = useState(null);
  const half = 75 / 2 - containerHeight / 2;

  //Gets distance from edges of the screen
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
  }, [openFreeMenu, containerHeight]);


  // Blocks scrolling when the menu is open
  const outerDivRef = useRef(null);

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (outerDivRef.current && !outerDivRef.current.contains(event.target)) {
        setOpenFreeMenu(false);
        setTimeout(() => {
          setSubMenu(null);
        }, 300); // Wait for the closing animation to finish
      }
    };

    if (openFreeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openFreeMenu]);


  // Unmount the menu with a 300ms delay
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

  // 
  useEffect(() => {
    if (openFreeMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openFreeMenu]);

  const [subMenuAnimation, setSubMenuAnimation] = useState(false);

  // Unmount the submenu with a 500ms delay
  useEffect(() => {
    if (subMenu) {
      setSubMenuAnimation(true); // Immediately set to true when the menu opens
    } else {
      const timeout = setTimeout(() => {
        setSubMenuAnimation(false); // Delay setting to false by 500ms when the menu closes
      }, 500);

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount or when `openFreeMenu` changes
    }
  }, [subMenu]);

  // blocks the cluster menu when status is not null
  useEffect(() => {
    if (clusterStatus !== null) {
      setShutDown(true);
    }
  }, [clusterStatus]);

  const checkInAlready = (item) => {
    let count = 0;
    clustersList?.forEach(cluster => {
      if (cluster.id === item.id) {
        count++;
      }
    }
    );
    return count > 1;
  };

  const checkSemester = (item) => {
    if ((semester === "firstSemester" && item.firstSemester === true) || (semester === "lastSemester" && item.lastSemester === true)) {
      return true;
    } else {
      return false;
    }
  };

  const checkAttendancePrerequisite = (item) => {
    let check = false;
    for (let i = 0; i < displayedClustersList.length; i++) {
      const displayedCluster = displayedClustersList[i];
      if (displayedCluster.id === cluster.id) {
        break;
      } else {
        if (item.firstSemester && displayedCluster.lastSemester && displayedCluster.level === item.level - 1) {
          check = true;
        } else if (item.lastSemester && displayedCluster.firstSemester && displayedCluster.level === item.level) {
          check = true;
        } else if (item.level === 0) {
          check = true;
        }
      }
    }
    return check;
  };

  const checkPrerequisite = (item) => {
    // const prerequisites = item.prerequisiteIds;
    // return prerequisites.length === 0 || prerequisites.some(prerequisite =>
    //   displayedClustersList.some(displayedCluster => displayedCluster.id === prerequisite && displayedCluster.status !== "failed")
    // );
    for (let i = 0; i < displayedClustersList.length; i++) {
      const displayedCluster = displayedClustersList[i];
      if (displayedCluster.id === cluster.id) {
        break;
      } else {
        if (item.prerequisiteIds?.length > 0) {
          for (let j = 0; j < item.prerequisiteIds.length; j++) {
            const prerequisiteId = item.prerequisiteIds[j];
            if (displayedCluster.id === prerequisiteId && displayedCluster.status !== "failed") {
              return true;
            }
          }
        } else if (item.prerequisiteIds?.length === 0) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    setInvalid(cluster.isFreeChoice && cluster.level !== 0 && ((checkInAlready(cluster) || !checkSemester(cluster) || !checkAttendancePrerequisite(cluster) || !checkPrerequisite(cluster)) || cluster.id === "toBeChanged"));
  }, [multipleChoiceClustersOpen, cluster.id]);

  // Track invalid state for this cluster
  useEffect(() => {
    if (handleClusterInvalid) {
      handleClusterInvalid(cluster.id, invalid);
    }
  }, [invalid]);


  const [prevId, setPrevId] = useState(null);

  useEffect(() => {
    if (cluster.isFreeChoice && cluster.level !== 0) {
      if (!multipleChoiceClustersOpen && checkInAlready(cluster)) {
        setPrevId(cluster.id);
        clustersList?.forEach((c) => {
          if (c.id === cluster.id && c.isFreeChoice) {
            c.id = "toBeChanged";
          }
        });

        displayedStudyYears?.forEach((studyYear) => {
          if (studyYear.firstSemester) {
            studyYear.firstSemester.forEach((c) => {
              if (c.id === cluster.id && c.isFreeChoice) {
                c.id = "toBeChanged";
              }
            });
          }
          if (studyYear.lastSemester) {
            studyYear.lastSemester.forEach((c) => {
              if (c.id === cluster.id && c.isFreeChoice) {
                c.id = "toBeChanged";
              }
            });
          }
        })
      } else if (multipleChoiceClustersOpen && !checkInAlready(cluster) && cluster.id === "toBeChanged") {
        clustersList?.forEach((c) => {
          if (c.id === "toBeChanged") {
            c.id = prevId;
          }
        });

        displayedStudyYears?.forEach((studyYear) => {
          if (studyYear.firstSemester) {
            studyYear.firstSemester.forEach((c) => {
              if (c.id === "toBeChanged") {
                c.id = prevId;
              }
            });
          }
          if (studyYear.lastSemester) {
            studyYear.lastSemester.forEach((c) => {
              if (c.id === "toBeChanged") {
                c.id = prevId;
              }
            });
          }
        });
      }
    }
  }, [multipleChoiceClustersOpen]);

  return (
    <div ref={outerDivRef} className="relative w-full">
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
        style={{
          backgroundColor:
            clusterStatus === "passed"
              ? "#ccffcc"
              : clusterStatus === "failed"
                ? "#ffcccc"
                : cluster.isFreeChoice && cluster.level === 0
                  ? "transparent"
                  : "#ffffff",
        }}
        className={`flex flex-row relative w-full min-w-full sm:min-w-[250px] lg:max-w-[250px] h-[75px] rounded-[12px] p-[10px] box-border justify-between align-middle items-center gap-[10px]
          ${!clusterSelected && clustersSize > 1 && "cursor-pointer hover:brightness-95 "}
          ${cluster.isFreeChoice ? "border-2 border-dashed border-[#424242] border-spacing-[10px]" : ""}
          ${cluster.isFreeChoice ? 'cursor-pointer' : 'cursor-auto'}
          ${invalid ? "opacity-50" : "opacity-100"}`}>

        <h1
          style={{ lineHeight: "1.25" }}
          className={"text-left flex-auto text-[14px] font-bold"}>
          {cluster.name}
        </h1>

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
            <div
              onMouseEnter={handleHoverLink}
              onMouseLeave={handleHoverLink}
              onTouchStart={handleHoverLink}
              onTouchEnd={handleHoverLink}
              onClick={(e) => {
                e.stopPropagation();
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

          {/*Retake Button*/}
          <div ref={retakeMenuRef} className="relative">
            {!menuDisabled && !(cluster.isFreeChoice && cluster.level === 0) && clusterSelected?.level !== 4 && clusterStatus == null && !handleMultipleClustersDelayed && !invalid && (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange("passed");
                        setOpenRetakeMenu(false);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange("failed");
                        setOpenRetakeMenu(false);
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

      {/* Free Space Menu */}
      <div
        className={`absolute z-[4]`}
        style={{
          ...(typeof window !== "undefined" && window.innerWidth >= 1024
            ? {
              left: distance.right < 290 ? -290 : 270,
              top: distance.top < -half + 10
                ? -distance.top + 10
                : distance.bottom < -half + 10
                  ? window.innerHeight - containerHeight - 10 - distance.top
                  : half,
              transformOrigin: distance.right < 290 ? "center right" : "center left"
            }
            : {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              transformOrigin: "center center",
              zIndex: 1000
            }
          ),
          // Browser adaptability
          transform: openFreeMenu ? "scale(1)" : "scale(0.01)",
          opacity: openFreeMenu ? 1 : 0.3,
          willChange: "all, transform, opacity",
          ...(subMenuAnimation && openFreeMenu ? { transition: "all 0.5s" } : { transition: "transform 0.3s, opacity 0.3s" }),
        }}
      >
        {/* <div>{containerHeight}</div> */}
        {isVisible && (<Free_Space_Menu
          selected={selected}
          setSelected={setSelected}
          openFreeMenu={openFreeMenu}
          setOpenFreeMenu={setOpenFreeMenu}
          menuItems={menuItems}
          setContainerHeight={setContainerHeight}
          subMenu={subMenu}
          setSubMenu={setSubMenu}
          subMenuItems={subMenuItems}
          cohort={cohort}
          clusterId={cluster.id}
          displayedClustersList={displayedClustersList}
          semester={semester}
          checkSemester={checkSemester}
          checkAttendancePrerequisite={checkAttendancePrerequisite}
          checkPrerequisite={checkPrerequisite}
        />)}
      </div>
    </div>
  );
};

export default Cluster;