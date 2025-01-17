'use client'
import React from "react";
import {useAuth} from "@/Providers/AuthProvider";

const Popup = ({children, title, description, isOpen, canAccept, onAccept, onCancel, acceptText, cancelText, state}) => {
    const {loading} = useAuth();

    return (
        isOpen && (
            <div
                className={`fixed z-[1000] top-0 left-0 w-full h-full p-[20px] box-border bg-black bg-opacity-30 flex justify-center items-center ${isOpen ? "" : "hidden"}`}
                onClick={(e) => !loading && onCancel(e)}>
                <div
                    id={"popup"}
                    className={"w-full max-w-[768px] h-auto max-h-[768px] bg-[#fff] p-[0px] box-border rounded-[12px] flex flex-col justify-center align-middle items-center"}
                    onClick={(e) => e.stopPropagation()}>
                    <div className={"w-full p-[20px] flex flex-col gap-[5px] justify-center align-middle items-center"}>
                        {title && <h1 className={"text-xl font-bold"}>{title}</h1>}
                        {description && <h2 className={"text-lg"}>{description}</h2>}
                    </div>
                    {state !== "delete" && (
                        <div
                            className={"w-full h-full gap-[25px] p-[20px] box-border overflow-y-scroll flex flex-col justify-center align-middle items-center"}>
                            {children}
                        </div>
                    )}
                    {(onAccept || onCancel) && !loading && (
                        <div className={"w-full p-[20px] box-border flex flex-row gap-[10px] justify-end align-middle items-center"}>
                            {onAccept && (
                                <button
                                    onClick={(canAccept && canAccept === true ? onAccept : null) || onAccept}
                                    className={`${!canAccept && "bg-gray-300 cursor-not-allowed pointer-events-none"} min-w-[100px] hover:brightness-95 md:w-auto w-full h-[40px] text-sm ${state && state === "delete" ? "bg-red-600" : "bg-blue-600"} text-white rounded-[8px] p-[10px] box-border`}>
                                    {acceptText ? acceptText : "Accept"}
                                </button>
                            )}
                            {onCancel && (
                                <button
                                    id={"cancel"}
                                    onClick={onCancel}
                                    className={"min-w-[100px] hover:brightness-95 md:w-auto w-full h-[40px] text-sm bg-gray-400 text-white rounded-[8px] p-[10px] box-border"}>
                                    {cancelText ? cancelText : "Cancel"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    )
}

export default Popup;