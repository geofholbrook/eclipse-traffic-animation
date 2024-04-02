import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { config } from '../config';
import { addGalleryRoute } from './addGalleryRoute';
import { createFrameQueue, initializeQueues } from './queues';
import { KeyValueStore } from '../KeyValueStore';
import { dayjsUTC } from '../utils/dayjsUTC';
import _ from 'lodash';
import { getTrafficGridJson } from '../getTrafficGridJson';

export const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(config.publicDirectory));

export const keyValueStore = new KeyValueStore(process.env.STORAGE_PATH!);

initializeQueues(app);

// Generate thumbnails and list of images
export const images: string[] = [];

console.log('generating thumbnails');
fs.readdirSync(config.compositeDirectory).forEach((file) => {
    if (file.toLowerCase().endsWith('.png')) {
        images.push(file);

        // Generate thumbnails
        sharp(path.join(config.compositeDirectory, file))
            .resize({ width: 256, height: 256, background: { r: 0, g: 0, b: 0, alpha: 1 } }) // Thumbnail size
            .toFile(path.join(__dirname, 'public', 'thumbnails', file), (err) => {
                if (err) {
                    console.error('Error generating thumbnail:', err);
                }
            });
    }
});

addGalleryRoute(app, images);

function shouldExecuteNow() {
    const timestamp = keyValueStore.get<number>('latestExecutionStamp');
    if (!timestamp) {
        console.log('no value stored, should execute.');
        keyValueStore.set('latestExecutionStamp', Date.now());
        return true;
    }
    const latestExecution = dayjsUTC(timestamp);
    const expectedExecution = dayjsUTC()
        .startOf('hour')
        .add(dayjsUTC().minute() < 30 ? 0 : 30, 'minutes');

    console.log(
        JSON.stringify(
            {
                latestExecution: latestExecution.toISOString(),
                expectedExecution: expectedExecution.toISOString(),
            },
            null,
            4,
        ),
    );

    if (latestExecution.isBefore(expectedExecution)) {
        console.log('should execute.');
        keyValueStore.set('latestExecutionStamp', Date.now());
        return true;
    } else {
        return false;
    }
}

setInterval(() => {
    console.log(`[${dayjsUTC().toISOString()}] running stale check...`);
    if (shouldExecuteNow()) {
        console.log('adding job to queue');
        createFrameQueue.add('create-frame' + _.uniqueId(), getTrafficGridJson());
    }
}, 60000);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
