const axios = require('axios');
const { getUUID }= require('../constants/mowoJangAPI')
const config = require('../../../config.json');

async function lookupPlayer(username) {
    try {
        const uuid = await getUUID(username);
        const url = `https://skykings.net/api/lookup?key=${config.api.skykings_api_key}&uuid=${uuid}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching player info:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching player info');
    }
}

module.exports = { lookupPlayer };