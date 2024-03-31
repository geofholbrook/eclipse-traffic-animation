import { writeFileSync } from 'fs';
import { fetchTile } from './fetchTile';
import path from 'path';

export async function saveTile(x: number, y: number, zoom: number): Promise<string> {
    const savePath = path.dirname(__dirname) + `/png/tile-${zoom}-${x}-${y}.png`;
    
    if (process.env.SKIP_FETCH === 'true') {
        return savePath;
    }

    const buffer = await fetchTile(x, y, zoom);
    writeFileSync(savePath, buffer);
    return savePath;
}
