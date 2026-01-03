import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-snapgen.vercel.app/api',
    withCredentials: true,
});

export default api;
