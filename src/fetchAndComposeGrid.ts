import dayjs from 'dayjs';
import { config } from './config';
import { saveTile } from './saveTile';
import sharp from 'sharp';
import { Style } from './fetchTile';

export async function fetchAndComposeGrid(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    zoom: number,
    tileSize: number = 256,
    style: Style = 'relative-delay'
) {
    const rows: string[][] = [];
    for (let y = y1; y <= y2; y++) {
        const promises = [];
        for (let x = x1; x <= x2; x++) {
            promises.push(async () => {
                const path = await saveTile(x, y, zoom, style);
                console.log(`Tile saved at ${path}`);
                return path;
            });
        }
        rows.push(await Promise.all(promises.map((p) => p())));
    }

    const inputFiles = rows.flat();
    const numRows = rows.length;
    const numColumns = rows[0].length;

    console.log('creating canvas');
    const canvasWidth = numColumns * tileSize;
    const canvasHeight = numRows * tileSize;
    const canvas = sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    });

    console.log('resizing tiles');
    let x = 0;
    let y = 0;
    const images = [];
    let n = 1;
    for (const inputFile of inputFiles) {
        const resizedImage = sharp(inputFile).resize(tileSize);
        images.push({ input: await resizedImage.toBuffer(), top: y, left: x });
        x += tileSize;
        if (x >= canvasWidth) {
            x = 0;
            y += tileSize;
        }
        if (n % 100 === 0) console.log(`resized #${n} out of ${inputFiles.length} tiles`);
        n++;
    }

    console.log('compositing images');
    canvas.composite(images);

    console.log('outputing combined image');
    const compositePath =
        config.compositeDirectory +
        `/output-${[x1, y1, x2, y2].join('-')}-zoom${zoom}-${style}-${dayjs().format('YYYY-MM-DD-HHmm')}.png`;

    canvas.png().toFile(compositePath, (err, info) => {
        if (err) {
            console.error('Error combining images:', err);
        } else {
            console.log(`Grid image saved to ${compositePath}`);
        }
    });
}
