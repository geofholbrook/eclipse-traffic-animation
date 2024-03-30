import { writeFileSync } from 'fs';
import { fetchTile } from './fetchTile';
import path from 'path';

export async function saveTile(x: number, y: number, zoom: number): Promise<string> {
    const buffer = await fetchTile(x, y, zoom);
    const savePath = path.dirname(__dirname) + `/png/tile-${zoom}-${x}-${y}.png`;
    writeFileSync(savePath, buffer);
    return savePath;
}
