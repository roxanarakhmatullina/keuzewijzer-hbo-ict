'use client'
import React, { useEffect, useState } from "react";
import {usePage} from "@/Providers/PageProvider";

const NavLink = ({ children, title }) => {
    const [isActive, setIsActive] = useState(false);
    const {setCurrentPage, currentPage} = usePage();

    useEffect(() => {
        setIsActive(title === currentPage);
    }, [currentPage]);

    return (
        <div
            onClick={() => setCurrentPage(title)}
            style={{backgroundColor: isActive ? "#2563eb" : "white"}}
            className={`hover:brightness-90 cursor-pointer transition ease-in-out w-full p-[10px] box-border rounded-[8px] flex flex-row gap-[10px] justify-start items-center`}>
            {React.Children.map(children, child =>
                React.cloneElement(child, {
                    className: `${child.props.className} ${isActive ? 'text-white' : 'text-black'}`
                })
            )}
            <p className={`${isActive ? "text-white" : "text-black"}`}>{title}</p>
        </div>
    )
}

export default NavLink;