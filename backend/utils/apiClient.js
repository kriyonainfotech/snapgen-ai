// src/utils/apiClient.js
const axios = require('axios');
require('dotenv').config();

// Create a configured instance of Axios
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
        'X-Api-Key': process.env.EXTERNAL_API_KEY // Loaded from .env
    }
});

module.exports = apiClient;