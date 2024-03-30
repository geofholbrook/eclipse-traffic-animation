import 'dotenv/config'
import { saveTile } from '../saveTile'

(async () => {
    const path = await saveTile(302, 366, 10);
    console.log(`Tile saved at ${path}`);
})()