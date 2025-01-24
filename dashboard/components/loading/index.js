'use client';
import React from 'react';
import { useAuth } from '@/Providers/AuthProvider';

const Loading = () => {
    const {loading} = useAuth();

    return (
        loading && (
            <div className="z-[10000] relative h-[4px] w-full rounded-full overflow-hidden">
                <div className="w-full rounded-full absolute top-0 left-0 h-[4px] bg-blue-200"></div>
                <div className="w-full rounded-full absolute top-0 left-0 h-[4px] bg-blue-700 animate-loading"></div>
            </div>
        )
    );
};

export default Loading;