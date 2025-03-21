'use client'
import React, { use, useState, useEffect } from 'react';

const SubMenu = ({ category, setSelected, setSubMenu, menuHeight, menuWidth }) => {
    const menuItems = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8'];
    const [title, setTitle] = useState(null);

    useEffect(() => {
        if (category) {
            setTitle(category); // Immediately set to true when the menu opens
        } else {
            const timeout = setTimeout(() => {
                setTitle(null); // Delay setting to false by 300ms when the menu closes
            }, 300);

            return () => clearTimeout(timeout); // Cleanup timeout on component unmount or when `openFreeMenu` changes
        }
    }, [category]);

    const handleClick = (item) => {
        setSelected(item);
        setSubMenu(null);
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

    return (
        <div className="w-full lg:w-auto p-[10px] box-border rounded-[12px] bg-[#D9D9D9] flex flex-col justify-center align-middle items-center gap-[10px]" style={{ height: menuHeight, width: menuWidth }}>
            <div className="flex w-full">
                {/*<p onClick={handleClickBack} className="absolute text-left flex-auto text-[14px] font-bold">X</p>*/}
                <svg
                    onClick={handleClickBack}
                    className="w-6 h-6 text-black hover:cursor-pointer cursor-auto absolute flex-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <p className="absoulte text-center flex-auto text-[14px] font-bold">{title}</p>
            </div>

            <div className="overflow-y-auto w-full min-w-full sm:min-w-[250px] lg:max-w-[250px] box-border rounded-[12px] flex flex-col align-middle items-center gap-[10px]">
                {menuItems.map((item) => (
                    <div key={item} onClick={() => handleClick(item)} className=" hover: cursor-pointer w-full min-w-full h-[75px] min-h-[75px] cursor-auto rounded-[12px] p-[20px] box-border flex justify-between align-middle items-center flex-row gap-[10px] bg-[#fff]">
                        <h1
                            style={{ lineHeight: "1.25" }}
                            className={"text-left flex-auto text-[14px] font-bold"}>{item}</h1>

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