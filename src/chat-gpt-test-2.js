const axios = require("axios");
const fs = require("fs");

// TomTom API endpoint for traffic flow tile
const TOMTOM_TRAFFIC_TILE_URL =
  "https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{zoom}/{x}/{y}.png";

// Your TomTom API key
const API_KEY = "U8iQ0W0krLOif358VGJq7zy4LueZTSY2";

// Zoom level of the map tiles (adjust as needed)
const zoom = 10;
const x = 302;
const y = 366;

// Construct the URL with placeholders for zoom, x, and y
const url =
  TOMTOM_TRAFFIC_TILE_URL.replace("{zoom}", zoom)
    .replace("{x}", x)
    .replace("{y}", y) + `?key=${API_KEY}`;

// Make a request to fetch traffic flow data for the specified area
axios
  .get(url, {
    responseType: "arraybuffer",
  })
  .then((response) => {
    // console.log("Traffic flow data:", response.data);
    const pngBuffer = Buffer.from(response.data);

    // Write the binary buffer to a PNG file
    fs.writeFile(__dirname + `/image-${Date.now()}.png`, pngBuffer, (err) => {
      if (err) {
        console.error("Error saving PNG file:", err);
        return;
      }
      console.log("PNG file saved successfully!");
    });
  })
  .catch((error) => {
    console.error("Error fetching traffic flow data:", error);
  });
