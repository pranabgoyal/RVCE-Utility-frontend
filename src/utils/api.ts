import axios from 'axios';

// Get the base key from environment or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getBaseUrl = () => {
    // If running on Client and Localhost, force Local Backend
    // This fixes the issue where local dev env tries to fetch local files from Render Cloud
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:5000/api';
    }
    return API_URL;
};

export const getApiUrl = () => {
    return getBaseUrl();
};

const api = {
    login: async (credentials: any) => {
        const response = await axios.post(`${getBaseUrl()}/auth/login`, credentials);
        return response.data;
    },
    signup: async (userData: any) => {
        const response = await axios.post(`${getBaseUrl()}/auth/signup`, userData);
        return response.data;
    }
};

export default api;
