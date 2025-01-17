/**
 * Fetch API calls and returns data
 * Url is used from ENV file.
 * @param url
 * @returns {Promise<*>}
 */

import axios from "axios";

const envAPI = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: envAPI,
})