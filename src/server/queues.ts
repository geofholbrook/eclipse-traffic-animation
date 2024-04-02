import { ExpressAdapter } from '@bull-board/express';
import { Job, Queue, Worker } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Application } from 'express';
import { IJSONConfig, getTrafficGridJson } from '../getTrafficGridJson';
import { latLonToTileXYZ } from '../utils/latLonToTileXYZ';
import { fetchAndComposeGrid } from '../fetchAndComposeGrid';

const createFrameQueue = new Queue('create-frame', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

const testQueue = new Queue('test');
const schedulerQueue = new Queue('scheduler');

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
        queues: [new BullMQAdapter(createFrameQueue), new BullMQAdapter(testQueue), new BullMQAdapter(schedulerQueue)],
        serverAdapter: serverAdapter,
    });
    app.use('/admin/queues', serverAdapter.getRouter());

    await addRepeaterJob();
}

async function addRepeaterJob() {
    const data = getTrafficGridJson();
    const existingRepeaters = await createFrameQueue.getRepeatableJobs();
    for (const repeater of existingRepeaters) {
        await createFrameQueue.removeRepeatableByKey(repeater.key);
    }
    createFrameQueue.add('repeater', data, { repeat: { pattern: '0 */30 * * * *' } });
}
