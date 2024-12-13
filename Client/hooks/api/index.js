/**
 * Fetch API calls and returns data
 * Url is used from ENV file.
 * @param url
 * @returns {Promise<*>}
 */

import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async (url) => {
    try {
        const response = await axios.get(api + url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the data:', error);
        return error;
    }
}
