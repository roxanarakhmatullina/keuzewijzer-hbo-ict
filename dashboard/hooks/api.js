import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/`,
});

// Attach the token
api.interceptors.request.use(config => {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("keuzewijzerhboict-acc-token="))
        ?.split("=")[1];

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;