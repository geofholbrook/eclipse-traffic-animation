export function latLonToTileXYZ(lat: number, lon: number, zoomLevel: number) {
    const MIN_ZOOM_LEVEL = 0;
    const MAX_ZOOM_LEVEL = 22;
    const MIN_LAT = -85.051128779807;
    const MAX_LAT = 85.051128779806;
    const MIN_LON = -180.0;
    const MAX_LON = 180.0;

    if (zoomLevel == undefined || isNaN(zoomLevel) || zoomLevel < MIN_ZOOM_LEVEL || zoomLevel > MAX_ZOOM_LEVEL) {
        throw new Error(
            'Zoom level value is out of range [' + MIN_ZOOM_LEVEL.toString() + ', ' + MAX_ZOOM_LEVEL.toString() + ']',
        );
    }

    if (lat == undefined || isNaN(lat) || lat < MIN_LAT || lat > MAX_LAT) {
        throw new Error('Latitude value is out of range [' + MIN_LAT.toString() + ', ' + MAX_LAT.toString() + ']');
    }

    if (lon == undefined || isNaN(lon) || lon < MIN_LON || lon > MAX_LON) {
        throw new Error('Longitude value is out of range [' + MIN_LON.toString() + ', ' + MAX_LON.toString() + ']');
    }

    let z = Math.trunc(zoomLevel);
    let xyTilesCount = Math.pow(2, z);
    let x = Math.trunc(Math.floor(((lon + 180.0) / 360.0) * xyTilesCount));
    let y = Math.trunc(
        Math.floor(
            ((1.0 - Math.log(Math.tan((lat * Math.PI) / 180.0) + 1.0 / Math.cos((lat * Math.PI) / 180.0)) / Math.PI) /
                2.0) *
                xyTilesCount,
        ),
    );

    return { x, y, z };
}

if (require.main === module) {
    // Test the function with some example values
    console.log(latLonToTileXYZ(Number(process.argv[2]), Number(process.argv[3]), Number(process.argv[4])));
}
