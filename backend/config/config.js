require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    externalApiUrl: process.env.EXTERNAL_API_URL,
    externalApiKey: process.env.EXTERNAL_API_KEY
};

module.exports = config;
