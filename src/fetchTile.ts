import axios from 'axios';
import { config } from './config';

export type Style = 'relative' | 'relative0' | 'absolute' | 'relative-delay';

export async function fetchTile(x: number, y: number, zoom: number, style: Style = 'relative-delay' ): Promise<Buffer> {
    const url = `https://api.tomtom.com/traffic/map/4/tile/flow/${style}/${zoom}/${x}/${y}.png?key=${config.tomtomApiKey}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pngBuffer = Buffer.from(response.data);
    return pngBuffer;
}
