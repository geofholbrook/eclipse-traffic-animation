import { ExpressAdapter } from '@bull-board/express';
import { Job, Queue, Worker } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Application } from 'express';
import { IJSONConfig, getTrafficGridJson } from '../getTrafficGridJson';
import { latLonToTileXYZ } from '../utils/latLonToTileXYZ';
import { fetchAndComposeGrid } from '../fetchAndComposeGrid';

export const createFrameQueue = new Queue('create-frame', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

const testQueue = new Queue('test');

const createFrameWorker = new Worker(
    'create-frame',
    async (job: Job) => {
        console.log(`starting job ${job.id} with data ${JSON.stringify(job.data, null, 4)}`);
        const data = job.data as IJSONConfig;

        const { x: x1, y: y1 } = latLonToTileXYZ(data.upperLeftLatLon[0], data.upperLeftLatLon[1], data.zoom);
        const { x: x2, y: y2 } = latLonToTileXYZ(data.lowerRightLatLon[0], data.lowerRightLatLon[1], data.zoom);

        job.log('fetchAndComposeGrid() ...');
        await fetchAndComposeGrid(x1, y1, x2, y2, data.zoom, data.tileSize, data.style);

        job.log('done');
        return { success: true };
    },
    {
        concurrency: 1,
        connection: {
            host: 'localhost',
            port: 6379,
        },
    },
);

export async function initializeQueues(app: Application) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    createBullBoard({
        queues: [new BullMQAdapter(createFrameQueue), new BullMQAdapter(testQueue)],
        serverAdapter: serverAdapter,
    });
    app.use('/admin/queues', serverAdapter.getRouter());
    return {
        testQueue,
        createFrameQueue,
    };
}
