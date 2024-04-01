import dayjs from 'dayjs';
import { config } from './config';
import { saveTile } from './saveTile';
import sharp from 'sharp';

export async function fetchAndComposeGrid(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    zoom: number,
    tileSize: number = 256,
) {
    const rows: string[][] = [];
    for (let y = y1; y <= y2; y++) {
        const promises = [];
        for (let x = x1; x <= x2; x++) {
            promises.push(async () => {
                const path = await saveTile(x, y, zoom);
                console.log(`Tile saved at ${path}`);
                return path;
            });
        }
        rows.push(await Promise.all(promises.map((p) => p())));
    }

    // Array of input PNG files
    const inputFiles = rows.flat();

    // Number of columns and rows in the grid
    const numRows = rows.length;
    const numColumns = rows[0].length;

    // Initialize the canvas
    const canvasWidth = numColumns * tileSize; // Adjust as needed
    const canvasHeight = numRows * tileSize; // Adjust as needed

    console.log('creating canvas');
    const canvas = sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4, // RGBA
            background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
    });

    // Loop through input files and composite them onto the canvas
    console.log('resizing tiles');
    let x = 0;
    let y = 0;
    const images = [];
    let n = 1;
    for (const inputFile of inputFiles) {
        if (n % 100 === 0) console.log(`resizing #${n} out of ${inputFiles.length} tiles`);
        const resizedImage = sharp(inputFile).resize(tileSize);
        images.push({ input: await resizedImage.toBuffer(), top: y, left: x });
        x += tileSize; // Adjust spacing between images
        if (x >= canvasWidth) {
            x = 0;
            y += tileSize; // Adjust spacing between images
        }
        n++;
    }
    console.log('compositing images');
    canvas.composite(images);

    console.log('outputing combined image');
    const compositePath =
        config.compositeDirectory +
        `/output-${[x1, y1, x2, y2].join('-')}-zoom${zoom}-${dayjs().format('YYYY-MM-DD-HHmm')}.png`;

    canvas.png().toFile(compositePath, (err, info) => {
        if (err) {
            console.error('Error combining images:', err);
        } else {
            console.log(`Grid image saved to ${compositePath}`);
        }
    });
}
