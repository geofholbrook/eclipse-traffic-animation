import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { config } from '../config';

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Generate thumbnails and list of images
const images: string[] = [];

console.log('generating thumbnails')
fs.readdirSync(config.compositeDirectory).forEach((file) => {
  if (file.toLowerCase().endsWith('.png')) {
    images.push(file);

    // Generate thumbnails
    sharp(
      path.join(config.compositeDirectory, file))
      .resize({width: 256, background: { r: 0, g: 0, b: 0, alpha: 1 }}) // Thumbnail size
      .toFile(path.join(__dirname, 'public', 'thumbnails', file), (err) => {
        if (err) {
          console.error('Error generating thumbnail:', err);
        }
      });
  }
});

// Serve HTML page
app.get('/', (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Gallery</title>
      <style>
        .gallery {
          display: flex;
          flex-wrap: wrap;
        }
        .thumbnail {
          margin: 5px;
          background-color: #000000;
        }
      </style>
    </head>
    <body>
      <h1>Image Gallery</h1>
      <div class="gallery">
  `;

  images.forEach((image) => {
    html += `
      <div class="thumbnail">
        <a href="/images/${image}" download>
          <img src="/thumbnails/${image}" alt="${image}">
        </a>
      </div>
    `;
  });

  html += `
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
