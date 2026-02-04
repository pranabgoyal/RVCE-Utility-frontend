import axios from 'axios';

// Get the base key from environment or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getBaseUrl = () => {
    // 1. Browser: Force Localhost if running on localhost
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:5000/api';
    }

    // 2. Server (SSR): Force Localhost if in Development mode
    // This ensures that server-side content generation (like ResourceCard hrefs) uses localhost
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:5000/api';
    }

    // 3. Production / Fallback
    return API_URL;
};

export const getApiUrl = () => {
    return getBaseUrl();
};

const api = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await axios.post(`${getBaseUrl()}/auth/login`, credentials);
        return response.data;
    },
    signup: async (userData: { fullName: string; email: string; password: string; year: string; department: string }) => {
        const response = await axios.post(`${getBaseUrl()}/auth/signup`, userData);
        return response.data;
    }
};

export default api;
