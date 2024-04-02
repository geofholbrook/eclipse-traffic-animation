import 'dotenv/config';
import { latLonToTileXYZ } from './utils/latLonToTileXYZ';
import { fetchAndComposeGrid } from './fetchAndComposeGrid';
import { getTrafficGridJson } from './getTrafficGridJson';

const trafficGridJson = getTrafficGridJson();

const upperLeftLatLon = trafficGridJson.upperLeftLatLon || [45, -90];
const lowerRightLatLon = trafficGridJson.lowerRightLatLon || [30, -70];
const zoom = trafficGridJson.zoom || 7;
const style = trafficGridJson.style || 'relative-delay';

export const tileSize = 64;

const { x: x1, y: y1 } = latLonToTileXYZ(upperLeftLatLon[0], upperLeftLatLon[1], zoom);
const { x: x2, y: y2 } = latLonToTileXYZ(lowerRightLatLon[0], lowerRightLatLon[1], zoom);

(async () => {
    await fetchAndComposeGrid(x1, y1, x2, y2, zoom, tileSize, style);
})();
