import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { config } from '../config';
import { addGalleryRoute } from './addGalleryRoute';
import { initializeQueues } from './queues';

export const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
