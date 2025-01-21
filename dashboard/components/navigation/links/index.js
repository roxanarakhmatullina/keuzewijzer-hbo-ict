'use client'
import React from 'react';
import NavLink from "@/components/navigation/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRange from "@mui/icons-material/DateRange";
import School from "@mui/icons-material/School";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import People from "@mui/icons-material/People";
import {useAuth} from "@/Providers/AuthProvider";

const Links = () => {

    const {user} = useAuth();

    return (
        <div
            className={"mb-auto w-full h-auto max-h-[75vh] overflow-y-auto overflow-x-hidden hidden md:flex flex-auto flex-col gap-[10px] justify-start items-center"}>

            {/*  Dashboard   */}
            <NavLink title={"Dashboard"}>
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