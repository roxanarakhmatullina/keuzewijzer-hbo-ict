'use client'
import React, { use, useState, useEffect, useLayoutEffect, useRef } from 'react';
import SubMenu from './submenu';

const Free_Space_Menu = ({ selected, setSelected, openFreeMenu, setOpenFreeMenu, menuHeight, setMenuHeight}) => {
    const menuItems = ['category1', 'category2', 'category3'];
    const [subMenu, setSubMenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState(null);
    const [isVisible, setIsVisible] = useState(false);


    // Unmount the submenu with a 300ms delay
    useEffect(() => {
        if (subMenu) {
            setIsVisible(true); // Immediately set to true when the menu opens
        } else {
            const timeout = setTimeout(() => {
                setIsVisible(false); // Delay setting to false by 300ms when the menu closes
            }, 300);

            return () => clearTimeout(timeout); // Cleanup timeout on component unmount or when `openFreeMenu` changes
        }
    }, [subMenu]);

    // Open submenu
    const handleClick = (item) => {
        setSubMenu(item);
    }

    // when something in the submenu is selected, everything closes
    const handleSubMenuSelect = (item) => {
        setSelected(item);
        setSubMenu(null);
        setOpenFreeMenu(false);
    };


    // Gets measurements of the menu
    const menuRef = useRef(null);
    const hasMeasured = useRef(false); // Track if dimensions have already been measured

    useLayoutEffect(() => {
        if (menuRef.current && openFreeMenu) {
            const rect = menuRef.current.getBoundingClientRect();
            setMenuHeight(rect.height);
        }
    }, [openFreeMenu, subMenu, subMenuHeight]);

    return (
        <div ref={menuRef} className={`flex flex-col relative w-full h-full lg:w-auto lg:h-auto lg:max-h-[551px] py-[20px] px-[30px] lg:p-[10px] box-border lg:rounded-[12px] bg-[#D9D9D9] align-middle items-center gap-[20px] lg:gap-[10px] `}
            style={subMenu && (menuHeight < subMenuHeight) ? {height: subMenuHeight} : {}}
        >
            {(window.innerWidth < 1024) && (<button
                onClick={() => setOpenFreeMenu(false)}
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

            <p className="text-left text-[20px] lg:text-[14px] font-bold">Kies een categorie:</p>

            <div className="flex flex-col w-full h-auto gap-[10px] overflow-y-auto">
                {menuItems.map((item) => (
                    <div key={item} onClick={() => handleClick(item)} className="flex flex-row relative w-full min-w-[250px] lg:max-w-[250px] min-h-[75px] max-h-[75px] p-[20px] box-border rounded-[12px] bg-[#fff] justify-between align-middle items-center gap-[10px] hover: cursor-pointer cursor-auto">
                        <h1 style={{ lineHeight: "1.25" }} className={"text-left flex-auto text-[14px] font-bold"}>
                            {item}
                        </h1>
                        <svg
                            className="w-[20px] h-[20px] text-black hover:cursor-pointer cursor-auto absolute flex-auto right-[10px]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19l7-7-7-7" />
                        </svg>
                    </div>
                )

                )

                }
            </div>

            {subMenu &&(<div className={`absolute w-full h-full top-0`}>
                {isVisible && (<SubMenu
                    category={subMenu}
                    setSelected={handleSubMenuSelect}
                    subMenu={subMenu}
                    setSubMenu={setSubMenu}
                    menuHeight={menuHeight}
                    setSubMenuHeight={setSubMenuHeight}
                    subMenuHeight={subMenuHeight}
                />)}
            </div>
            )}

            {/*<h1>menuHeight:{menuHeight} menuWidth:{menuWidth}</h1>*/}
        </div>
    )
};

export default Free_Space_Menu;