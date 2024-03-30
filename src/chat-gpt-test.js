const axios = require('axios');

// TomTom API endpoint
const TOMTOM_API_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json';

// Your TomTom API key
const API_KEY = 'U8iQ0W0krLOif358VGJq7zy4LueZTSY2';

// Parameters for the request
const params = {
  key: API_KEY,
  point: '52.52585,13.31452', // Berlin coordinates for example
};

console.log('making request');

// Make the HTTP GET request
axios.get(TOMTOM_API_URL, { params })
  .then(response => {
    console.log('Response:', JSON.stringify(response.data, null, 4));
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
