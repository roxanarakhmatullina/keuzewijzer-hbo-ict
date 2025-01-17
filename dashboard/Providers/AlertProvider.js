'use client';
import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
    return useContext(AlertContext);
};

const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    // Function to create an alert
    const addAlert = (alert) => {
        const id = Date.now(); // Unique ID for the alert
        const newAlert = {
            id,
            type: alert.type,
            message: alert.message,
            exiting: false, // To track if the alert is exiting
        };
        setAlerts((prev) => [...prev, newAlert]);

        // Automatically remove the alert after 7.5 seconds
        setTimeout(() => {
            // Start exit animation
            setAlerts((prev) =>
                prev.map((a) => (a.id === id ? { ...a, exiting: true } : a))
            );

            // Remove the alert after the exit animation duration (500ms)
            setTimeout(() => {
                setAlerts((prev) => prev.filter((a) => a.id !== id));
            }, 500); // Duration should match the CSS exit animation duration
        }, 7500);
    };

    return (
        <AlertContext.Provider value={{ addAlert }}>
            <div className="fixed top-0 left-0 w-full h-full z-[3000] p-[20px] box-border pointer-events-none flex flex-col gap-[5px] justify-end align-middle items-center">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        style={{
                            minWidth: '100px',
                            maxWidth: 'calc(100vw-20px)',
                            border: alert.type === 'error' ? '1px solid red' : alert.type === 'ok' ? '1px solid green' : '1px solid blue',
                            background: alert.type === 'error' ? '#fecaca' : alert.type === 'ok' ? '#bbf7d0' : '#bfdbfe',
                        }}
                        className={`shadow-lg shadow-black/30 alert ${
                            alert.exiting ? 'alert-exit' : 'alert-enter'
                        }`}
                    >
                        {alert.message}
                    </div>
                ))}
            </div>
            {children}
        </AlertContext.Provider>
    );
};

export default AlertProvider;