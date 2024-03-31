import axios from 'axios';
import { config } from './config';

export async function fetchTile(x: number, y: number, zoom: number): Promise<Buffer> {
    const url = `https://api.tomtom.com/traffic/map/4/tile/flow/relative-delay/${zoom}/${x}/${y}.png?key=${config.tomtomApiKey}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pngBuffer = Buffer.from(response.data);
    return pngBuffer;
}
