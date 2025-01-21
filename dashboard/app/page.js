'use client'
import React, {useEffect} from 'react';
import {useAuth} from "@/Providers/AuthProvider";
import LoginPage from "@/components/auth/login";
import Navigation from "@/components/navigation";
import Pages from "@/components/pages";
import Loading from "@/components/loading";

const DashboardPage = () => {
    const {user, loading} = useAuth();
    return (
        loading && !user ? <Loading/> : !loading && !user ? <LoginPage/> : user && (
            <div className={`w-[100vw] h-[100vh] flex flex-row ${loading && !user ? "" : "animate"}`}>
                <Navigation/>
                <Pages/>
            </div>
        )
    )
}

export default DashboardPage;