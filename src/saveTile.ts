import { writeFileSync } from 'fs';
import { fetchTile, Style } from './fetchTile';
import path from 'path';
import { config } from './config';

export async function saveTile(x: number, y: number, zoom: number, style: Style = 'relative-delay'): Promise<string> {
    const savePath = `${config.tileDirectory}/tile-${style}-${zoom}-${x}-${y}.png`;
    
    if (process.env.SKIP_FETCH === 'true') {
        return savePath;
    }

    const buffer = await fetchTile(x, y, zoom);
    writeFileSync(savePath, buffer);
    return savePath;
}
