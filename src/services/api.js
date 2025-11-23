import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================
// AUTH APIs
// ============================================

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

// ============================================
// PRODUCT APIs
// ============================================

export const getProductByBarcode = async (barcode) => {
    const response = await axios.get(`${API_URL}/products/${barcode}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getSimilarProducts = async (barcode) => {
    const response = await axios.get(`${API_URL}/products/${barcode}/similar`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const translateText = async (text, targetLang = 'en') => {
    const response = await axios.post(`${API_URL}/products/translate`, {
        text,
        targetLang
    }, {
        headers: getAuthHeader()
    });
    return response.data;
};

// ============================================
// AI IMAGE PROCESSING API
// ============================================

export const analyzeImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axios.post(`${API_URL}/take-picture`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            },
            timeout: 120000, // 2 minutes timeout for AI processing
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload Progress: ${percentCompleted}%`);
            }
        });

        return response.data;
    } catch (error) {
        // Better error handling
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - AI processing took too long. Please try with a clearer image.');
        } else if (error.code === 'ERR_NETWORK') {
            throw new Error('Network error - Make sure backend server is running on http://localhost:5000');
        } else if (error.response) {
            throw new Error(error.response.data?.error || error.response.data?.details || 'Server error occurred');
        } else {
            throw new Error(error.message || 'Failed to analyze image');
        }
    }
};