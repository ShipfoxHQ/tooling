import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter.js';
import {FastifyAdapter} from '@bull-board/fastify';
import type {JobQueue} from 'core/jobQueue';
import type {FastifyInstance} from 'fastify';

const serverAdapter = new FastifyAdapter();

const bullBoard = createBullBoard({
  queues: [],
  serverAdapter,
});

// biome-ignore lint/suspicious/noExplicitAny: BullMQAdapter is not typed
export function addQueueToBoard(queue: JobQueue<any, any>) {
  bullBoard.addQueue(new BullMQAdapter(queue.queue));
}

interface BullBoardOptions {
  basePath?: string;
  prefix?: string;
}

export function registerBullBoard(fastify: FastifyInstance, options?: BullBoardOptions) {
  serverAdapter.setBasePath(options?.basePath ?? '/bullmq');
  fastify.register(serverAdapter.registerPlugin(), {
    prefix: options?.prefix ?? '/bullmq',
  });
}
