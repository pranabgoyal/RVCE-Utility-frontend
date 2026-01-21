import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getApiUrl = () => API_URL;

const api = {
    login: async (credentials: any) => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    },
    signup: async (userData: any) => {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        return response.data;
    }
};

export default api;
