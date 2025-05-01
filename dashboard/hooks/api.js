import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Ensure this is correctly set
});

// Function to retrieve the token from cookies
const getCookie = (cookieName) => {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === cookieName) {
            return cookie[1];
        }
    }
    return null; // Return null if the cookie isn't found
};

// Add an interceptor to attach the token to each request
api.interceptors.request.use(
    (config) => {
        const token = getCookie("keuzewijzerhboict-acc-token");  // Get token from cookies
        console.log("🔑 Token being sent:", token);  // Debugging log
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("⚠️ No token found! API request may fail.");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
