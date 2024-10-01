'use client';
import React, { useState, useEffect } from 'react';

const Popup = ({ children, handleClose, handleAccept, acceptText, closeText, title }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true); // Trigger the opening animation when the component mounts
    }, []);

    const handleCloseFunction = (e) => {
        e.preventDefault();
        if (e.target.classList.contains('popup') || e.target.closest('.popup')) {
            return;
        }
        setIsVisible(false); // Trigger the closing animation
        setTimeout(() => {
            handleClose(); // Delay the actual close until the animation is done
        }, 300); // Match this to your CSS transition duration
    };

    return (
        <div
            className={`fixed z-[3001] flex justify-center align-middle items-center top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => handleCloseFunction(e)}
        >
            <div
                className={`popup fixed md:max-w-[500px] h-auto md:rounded-[25px] md:max-h-[75vh] bottom-0 md:bottom-auto pt-[25px] pb-[25px] box-border w-full max-w-[500px] min-h-[50vh] max-h-[90vh] overflow-y-auto flex flex-col justify-start items-center gap-[10px] bg-[#fff] z-[3002] rounded-t-[25px] transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className={"w-full p-[20px] box-border h-[50px] flex justify-evenly align-middle items-center"}>
                    <div className={"flex-auto flex justify-end items-center"}>
                        <button className={"w-[30px] h-[30px] bg-transparent border-none"}></button>
                    </div>
                    <div className="flex-auto flex justify-center items-center align-middle">
                        <h1 className="w-full text-center text-black text-[20px] font-bold">
                            {title ? title : "Popup Title"}
                        </h1>
                    </div>
                    <div className={"flex-auto flex justify-end items-center"}>
                        <button
                            className="w-[30px] h-[30px] bg-[#e5e5e5] flex justify-center items-center align-middle text-[#666] rounded-full hover:bg-[#c5c5c5] hover:text-[#444]"
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(() => handleClose(), 300);
                            }
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-x">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                {children}
                <div
                    className="w-full mt-auto p-[20px] box-border max-w-[500px] h-auto flex flex-col justify-center items-center align-middle gap-[10px]">
                    {handleAccept && (
                        <button
                            className="w-full min-w-[150px] md:w-full pt-[5px] pb-[5px] p-[10px] h-[50px] bg-blue-500 rounded-[8px] text-white"
                            onClick={() => handleAccept()}
                        >
                            {acceptText || "Accept"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popup;
