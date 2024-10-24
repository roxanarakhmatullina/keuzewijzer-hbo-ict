'use client';
import React from 'react';
import Graph from "@/components/graph";
import Navbar from "@/components/navigation/navbar";

const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col md:flex-row justify-between items-start overflow-hidden">
            <Navbar/>
            {/* Sidebar */}
            <div className="min-w-[312px] md:max-w-[312px] w-full h-full hidden md:flex"/>
            {/* Main Graph Area */}
            <div className="w-full h-full overflow-auto">
                <Graph/>
            </div>
        </div>
    );
}

export default Home;
