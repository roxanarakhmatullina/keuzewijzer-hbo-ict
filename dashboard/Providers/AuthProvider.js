'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/hooks/api";
import {useAlert} from "@/Providers/AlertProvider";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const {addAlert} = useAlert();

    useEffect(() => {
        checkAuth();

        // Set an interval to check authentication every 2 minutes
        const interval = setInterval(() => {
            checkAuth();
        }, 2 * 60 * 1000); // 2 minutes in milliseconds

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const checkAuth = async () => {
            await api.get("/Auth/me").then(res => {
                setUser(res.data);
            }).catch(err => {
                setUser(null);
                console.error(err);
                setLoading(false);
            })
                .finally(() => setLoading(false));
    };

    // Login
    const login = async (email, password) => {
        setLoading(true);
            await api.post("/Auth/login", {
                email,
                password,
            }).then(async res => {
                await setCookie("keuzewijzerhboict-acc-token", res.data.token);
                await checkAuth(); // Ensure this runs after the cookie is set

                addAlert({
                    type: "ok",
                    message: "Je bent succesvol ingelogd!"
                });
            })
            .catch(err => {
                addAlert({
                    type: "error",
                    message: err.status === 401 ? "De ingevoerde gegevens zijn onjuist." : "Er is iets misgegaan bij het inloggen. Probeer het later opnieuw."
                });
            })
            .finally(() => setLoading(false));
    };

    // Logout
    const logout = async () => {
        setUser(null);
        setCookie("keuzewijzerhboict-acc-token", "");
    };

    const setCookie = (name, value) => {
        document.cookie = `${name}=${value || ""}; path=/;`;
    };

    const getCookie = (cookieName) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === cookieName) {
                return cookie[1];
            }
        }
        return null; // Cookie not found
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setLoading, getCookie }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;