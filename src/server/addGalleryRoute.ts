import { Application } from 'express';

export function addGalleryRoute(app: Application, images: string[]) {
    app.get('/', (req, res) => {
        let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Traffic Animation Frames</title>
      <style>
    .gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 10px; /* Adjust the gap between thumbnails */
    }
    .thumbnail {
      background-color: black; /* Apply black background */
      padding: 5px; /* Add padding around each thumbnail */
      text-align: center; /* Center the filename */
    }
    .thumbnail img {
      display: block;
      width: 256px; /* Thumbnail width */
      height: 256px; /* Thumbnail height */
    }
    .filename {
      color: white; /* Filename color */
      margin-top: 5px; /* Adjust margin between thumbnail and filename */
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
          <div class="filename">${image}</div>
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
}
