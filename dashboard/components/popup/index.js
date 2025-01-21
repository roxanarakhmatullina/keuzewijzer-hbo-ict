'use client'
import React, { useEffect, useRef } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import Button from "@/components/button";

const Popup = ({
                   children,
                   title,
                   description,
                   isOpen,
                   canAccept,
                   onAccept,
                   onCancel,
                   acceptText,
                   cancelText,
                   state
               }) => {
    const { loading } = useAuth();
    const popupContentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Disable background scroll
            document.body.style.overflow = 'hidden';

            // Wait for content to be fully loaded before scrolling
            const timeoutId = setTimeout(() => {
                if (popupContentRef.current) {
                    popupContentRef.current.scrollTop = 0; // Scroll to top
                }
            }, 100); // Adjust delay if necessary

            // Cleanup timeout on unmount or when popup is closed
            return () => clearTimeout(timeoutId);
        } else {
            // Re-enable background scroll
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // on pressing escape close the popup
    useEffect(() => {
        const handleEscape = (e) => {
            if (isOpen && e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onCancel]);

    return (
        isOpen && (
            <div
                className="fixed z-[1000] top-0 left-0 w-[100vw] h-[100vh] p-[20px] box-border bg-black bg-opacity-30 flex justify-center items-center"
                onClick={(e) => !loading && onCancel(e)}
            >
                <div
                    id="popup"
                    className="w-full max-w-[768px] h-auto max-h-[calc(100%-50px)] min-h-[100px] bg-[#fff] p-[0px] box-border rounded-[12px] flex flex-col justify-center align-middle items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full p-[20px] flex flex-col gap-[5px] justify-center align-middle items-center">
                        {title && <h1 className="text-xl font-bold">{title}</h1>}
                        {description && <h2 className="text-lg">{description}</h2>}
                    </div>
                    {state !== "delete" && (
                        <div
                            ref={popupContentRef}
                            id="popup-content"
                            className="w-full h-auto max-h-[768px] overflow-y-auto p-[20px] box-border flex flex-col gap-[25px]"
                        >
                            {children}
                        </div>
                    )}
                    {(onAccept || onCancel) && !loading && (
                        <div className="w-full p-[20px] box-border flex flex-row gap-[10px] justify-end align-middle items-center">
                            {onAccept && (
                                <Button
                                    type={state === "delete" ? "danger" : "primary"}
                                    disabled={!canAccept}
                                    onClick={(canAccept && canAccept === true ? onAccept : null) || onAccept}
                                >
                                    {acceptText ? acceptText : "Accept"}
                                </Button>
                            )}
                            {onCancel && (
                                <Button
                                    type="secondary"
                                    id="cancel"
                                    onClick={onCancel}
                                >
                                    {cancelText ? cancelText : "Cancel"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default Popup;