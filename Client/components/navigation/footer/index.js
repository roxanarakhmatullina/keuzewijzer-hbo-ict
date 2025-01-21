'use client'
import React from 'react';
import Link from "next/link";

const NavigationFooter = ({navbarOpen}) => {
    return (
        <div
            className={`${navbarOpen ? "flex" : "hidden md:flex"} flex-col text-[14px] text-[#424242] text-center gap-[0.5ch] justify-center items-center`}>
            <p>&copy; {new Date().getFullYear()} keuzewijzerhboict.nl. Aan deze website kunnen geen rechten worden
                ontleend.</p>
            <div className={"flex flex-row gap-[10px] justify-center align-middle items-center"}>
                <Link className="text-[#124477] underline hover:text-[#092A3B] focus:text-[#092A3B] gap-[0.5ch]"
                      href="https://www.windesheim.nl/over-windesheim/disclaimer">Disclaimer</Link>
                <div className={"h-[15px] w-[1px] bg-[#424242]"}/>
                <Link className={"text-[#124477] underline hover:text-[#092A3B] focus:text-[#092A3B] gap-[0.5ch]"}
                      href={"/privacy-policy"}>Privacyverklaring</Link>
            </div>
        </div>
    )
}

export default NavigationFooter;