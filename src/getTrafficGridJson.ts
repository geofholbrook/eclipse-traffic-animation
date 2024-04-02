import fs from 'fs';
import path from 'path';
import { Style } from './fetchTile';

export interface IJSONConfig {
    upperLeftLatLon: [number, number];
    lowerRightLatLon: [number, number];
    zoom: number;
    style: Style;
    tileSize: number;
}

// const upperLeftLatLon = [55, -141];
// const lowerRightLatLon = [10, -62];
export function getTrafficGridJson() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'traffic-grid.json')).toString()) as IJSONConfig;
}
