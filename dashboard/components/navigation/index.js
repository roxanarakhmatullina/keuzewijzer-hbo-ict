'use client'
import React, {useState} from 'react';
import {useAuth} from "@/Providers/AuthProvider";
import DashboardIcon from '@mui/icons-material/Dashboard';
import DateRange from '@mui/icons-material/DateRange';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import People from '@mui/icons-material/People';
import School from '@mui/icons-material/School';
import Image from 'next/image';
import NavLink from "@/components/navigation/link";
import {usePage} from "@/Providers/PageProvider";

const Navigation = () => {
    const {user} = useAuth();
    const {setCurrentPage} = usePage();

    return (
        <>
            <div className={"top-0 left-0 min-w-[250px] w-1/5"}/>
            <nav
                className={"fixed top-0 left-0 w-1/5 min-w-[250px] max-h-[100vh] h-[100%] bg-[#fff] shadow-lg p-[20px] box-border flex flex-col gap-[25px] z-[3]"}>
                <div className={"w-full h-auto flex flex-auto flex-row gap-[10px] justify-start items-center"}>
                    <Image
                        src={"/dashboard/logo.png"}
                        width={50}
                        height={50}
                        alt={"Logo"}
                        className={"w-[50px] h-[50px]"}>
                    </Image>
                    <h1 className={"text-xl font-bold"}>Keuzewijzer</h1>
                </div>

                <div className={"w-full h-full flex flex-auto flex-col gap-[10px] justify-start items-center border-b-[1px] border-b-[#e5e5e5]"}>

                    {/*  Dashboard   */}
                    <NavLink title={"Dashboard"}>
                        <DashboardIcon/>
                    </NavLink>

                    {/*  Cohorts   */}
                    <NavLink title={"Cohorten"}>
                        <DateRange/>
                    </NavLink>

                    <NavLink title={"Afstudeerprofielen"}>
                        <School/>
                    </NavLink>

                    {/*  Clusters   */}
                    <NavLink title={"Clusters"}>
                        <WorkspacesIcon/>
                    </NavLink>

                    {/*  Clusters   */}
                    {user && user.role === "Admin" && (
                        <NavLink title={"Gebruikers"}>
                            <People/>
                        </NavLink>
                    )}

                </div>

                <div
                    onClick={() => setCurrentPage("Profiel")}
                    className={"cursor-pointer hover:brightness-95 bg-[#fff] w-full rounded-[12px] p-[10px] box-border border-[#e5e5e5] pt-[20px] pb-[20px] h-auto flex flex-auto flex-row gap-[10px] justify-start items-center"}>
                    <div
                        className={"min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] flex justify-center align-middle items-center p-[7px] bg-blue-600 text-white rounded-full"}>
                        {user?.email.substring(0, 1).toUpperCase()}
                    </div>
                    <p className={"w-full text-[16px] text-ellipsis overflow-hidden"}>{user?.email}</p>
                </div>
            </nav>
        </>
    )
}

export default Navigation;