'use client'
import React from 'react';
import HomePage from "@/components/pages/home";
import {usePage} from "@/Providers/PageProvider";
import CohortsPage from "@/components/pages/cohorts";
import GraduateProfiles from "@/components/pages/graduateProfiles";
import ClustersPage from "@/components/pages/clusters/page";
import UsersPage from "@/components/pages/users";
import ProfilePage from "@/components/pages/profile";
import {useAuth} from "@/Providers/AuthProvider";

const Pages = () => {
    const {currentPage} = usePage();
    const {loading} = useAuth();
    return (
        <div
            className={"w-4/5 pt-[75px] pb-[150px] p-[25px] box-border flex flex-col justify-start items-center align-middle gap-[10px]"}>
            <h1 className={"w-full max-w-[1366px] text-2xl font-bold text-black"}>{currentPage}</h1>
            <div
                className={`${loading && "pointer-events-none"} max-w-[1366px] w-full bg-[#fff] rounded-[12px] p-[20px] box-border flex flex-col gap-[25px] justify-start items-center align-middle`}>
                {currentPage === "Dashboard" ? (
                    <HomePage/>
                ) : currentPage === "Cohorts" ? (
                    <CohortsPage/>
                ) : currentPage === "Afstudeerprofielen" ? (
                    <GraduateProfiles/>
                ) : currentPage === "Clusters" ? (
                    <ClustersPage/>
                ) : currentPage === "Gebruikers" ? (
                    <UsersPage/>
                ) : currentPage === "Profiel" ? (
                    <ProfilePage/>
                ) : <p>404 not found</p>}
            </div>
        </div>
    )
}

export default Pages;