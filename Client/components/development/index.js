'use client';
import React, { useEffect } from 'react';
import './index.css';

const Development = ({ message }) => {
    // Only render the message box in development mode
    if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_API_URL) {
        return null;
    }

    const [showMessageBox, setShowMessageBox] = React.useState(true);

    useEffect(() => {
        const isEnvAdded = JSON.parse(localStorage.getItem('added-env') || 'false');
        if (isEnvAdded) {
            setShowMessageBox(false);
        }
    }, []);

    return (
        <header
            style={{
                background: "#FCEDEF",
                border: "1px solid #EF4D61",
                text: "#c00c00",
                font: "bold",
            }}
            className={'fixed animation top-[25px] right-[25px] rounded-[8px] shadow-2xl shadow-[#EF4D61]/[0.35] p-[10px] pt-[25px] pb-[25px] z-[10000] box-border max-w-[500px] w-full h-auto flex flex-col gap-[25px] justify-center align-middle items-center'}
        >
            <div className={"w-full flex flex-row gap-[10px]"}>
                <div
                    className={"min-w-[30px] min-h-[30px] max-h-[30px] max-w-[30px] bg-[#EF4D61] rounded-full flex justify-center align-middle items-center font-black text-xl text-[#fff]"}>!
                </div>
                <div className={"w-full font-bold text-[#333] text-[14px] gap-[10px] flex flex-col"}>
                    Hey dev, it looks like you forgot to add a .env file. Please add the '.env.local' file to '/Client'. Then
                    add the following content to the file:
                    <div
                        className={"w-full p-[10px] box-border rounded-[8px] bg-[#e5e5e5] border-[1px] border-[#c5c5c5] text-black flex justify-between align-middle items-center flex-row gap-[10px]"}>
                        <p className={"font-normal font-mono"}>
                            <span className={"text-[12px] text-[#666] font-bold"}>.env.local</span>
                            <br/>
                            NEXT_PUBLIC_API_URL=(URL TO API)
                        </p>
                        <button
                            className={"w-[35px] h-[35px] bg-transparent border-none hover:bg-[#c5c5c5] flex justify-center align-middle items-center rounded-full"}
                            onClick={() => {
                                navigator.clipboard.writeText('NEXT_PUBLIC_API_URL=(URL TO API)');
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={"w-[20px] h-[20px]"} viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Development;