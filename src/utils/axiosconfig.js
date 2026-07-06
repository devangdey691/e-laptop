import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://e-backend-one.vercel.app';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default axiosInstance;