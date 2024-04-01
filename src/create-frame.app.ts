import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { latLonToTileXYZ } from './utils/latLonToTileXYZ';
import { fetchAndComposeGrid } from './fetchAndComposeGrid';

// const upperLeftLatLon = [55, -141];
// const lowerRightLatLon = [10, -62];

const trafficGridJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'traffic-grid.json')).toString(),
) as {
    upperLeftLatLon: [number, number];
    lowerRightLatLon: [number, number];
    zoom: number;
};

const upperLeftLatLon = trafficGridJson.upperLeftLatLon || [45, -90];
const lowerRightLatLon = trafficGridJson.lowerRightLatLon || [30, -70];

const zoom = trafficGridJson.zoom || 7;

export const tileSize = 64;

const { x: x1, y: y1 } = latLonToTileXYZ(upperLeftLatLon[0], upperLeftLatLon[1], zoom);
const { x: x2, y: y2 } = latLonToTileXYZ(lowerRightLatLon[0], lowerRightLatLon[1], zoom);

(async () => {
    await fetchAndComposeGrid(x1, y1, x2, y2, zoom, tileSize);
})();
