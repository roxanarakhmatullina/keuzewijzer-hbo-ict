'use client'
import React from 'react';
import NavLink from "@/components/navigation/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRange from "@mui/icons-material/DateRange";
import School from "@mui/icons-material/School";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import People from "@mui/icons-material/People";
import {useAuth} from "@/Providers/AuthProvider";

const Links = ({open, setOpen}) => {

    const {user} = useAuth();

    return (
        <div
            onClick={() => setOpen(false)}
            className={`${open ? "md:flex flex md:relative absolute top-[75px] md:top-0 left-0" : "md:flex hidden top-0 left-0 relative"} border-t-[1px] border-[#c5c5c5] md:border-t-0 shadow-lg md:shadow-none bg-[#fff] p-[20px] md:p-0 mb-auto w-full h-auto max-h-[75vh] overflow-y-auto overflow-x-hidden flex-auto flex-col gap-[10px] justify-start items-center`}>

            {/*  Dashboard   */}
            <NavLink
                title={"Dashboard"}>
                <DashboardIcon/>
            </NavLink>

            {/*  Cohorts   */}
            <NavLink title={"Cohorten"}>
                <DateRange/>
            </NavLink>

            <NavLink title={"Afstudeerrichtingen"}>
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

    )
}

export default Links;