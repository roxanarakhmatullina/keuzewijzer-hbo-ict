"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/hooks/api"; // The api instance
import { useAlert } from "@/Providers/AlertProvider";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addAlert } = useAlert();

    // Function to retrieve the token from cookies
    const getCookie = (cookieName) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === cookieName) {
                return cookie[1];
            }
        }
        return null; // Return null if not found
    };

    // Function to set the token in Axios headers
    const setTokenHeader = () => {
        const token = getCookie("keuzewijzerhboict-acc-token");  
        if (token) {
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
        }
    };

    useEffect(() => {
        setTokenHeader();  // Set token header on mount
        checkAuth();

        const interval = setInterval(() => {
            checkAuth();
        }, 2 * 60 * 1000);  // Check every 2 minutes

        return () => clearInterval(interval);
    }, []); // Empty dependency array, so it runs only once after mounting

    const checkAuth = async () => {
        setLoading(true);
        try {
            const res = await api.get("/Auth/me");
            setUser(res.data);
            console.log("✅ Authenticated user:", res.data);
        } catch (err) {
            setUser(null);
            console.error("❌ Auth error:", err.response?.status, err.response?.data);
            addAlert({
                type: "error",
                message: "Fout bij het ophalen van gebruikersdata."
            });
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post("/Auth/login", { email, password });

            if (res.data.token) {
                setCookie("keuzewijzerhboict-acc-token", res.data.token);
                console.log("✅ Token stored:", res.data.token); // Debugging log
            } else {
                console.error("❌ No token received in login response!");
            }

            setTokenHeader(); // Refresh the token in the header
            await checkAuth(); // Refresh user data after login
            addAlert({
                type: "ok",
                message: "Je bent succesvol ingelogd!"
            });
        } catch (err) {
            console.error("❌ Login error:", err.response?.status, err.response?.data);
            addAlert({
                type: "error",
                message: err.response?.status === 401
                    ? "De ingevoerde gegevens zijn onjuist."
                    : "Er is iets misgegaan bij het inloggen. Probeer het later opnieuw."
            });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        setCookie("keuzewijzerhboict-acc-token", "");
        setTokenHeader(); // Remove token from header
        console.log("🚪 User logged out. Token removed.");
    };

    const setCookie = (name, value) => {
        document.cookie = `${name}=${value || ""}; path=/;`;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setLoading, getCookie }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
