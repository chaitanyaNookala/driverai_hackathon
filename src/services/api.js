import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Auth APIs
export const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
};

export const getProfile = async () => {
    const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: getAuthHeader()
    });
    return response.data;
};

// Product APIs
export const getProductByBarcode = async (barcode) => {
    const response = await axios.get(`${API_URL}/products/${barcode}`);
    return response.data;
};

export const getSimilarProducts = async (barcode) => {
    const response = await axios.get(`${API_URL}/products/${barcode}/similar`);
    return response.data;
};

export const translateText = async (text, targetLang = 'en') => {
    const response = await axios.post(`${API_URL}/products/translate`, {
        text,
        targetLang
    });
    return response.data;
};