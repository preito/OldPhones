import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://oldphones-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
