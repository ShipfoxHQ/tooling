import {log} from '@shipfox/log';
import {redisClient} from '@shipfox/redis';
import {
  type ConnectionOptions,
  DelayedError,
  FlowProducer,
  type Job,
  type JobSchedulerJson,
  type JobsOptions,
  type Processor,
  Queue,
  type RepeatOptions,
  UnrecoverableError,
  WaitingChildrenError,
  Worker,
  type WorkerOptions,
} from 'bullmq';
import {BullMQOtel} from 'bullmq-otel';
import {jobErrorCount, jobLockAcquisitionFailedCount, jobProcessedCount} from 'metrics';
import {addQueueToBoard} from 'presentation/bullBoard';
import {JobError} from './jobError';

export type * from 'bullmq';

interface JobQueueProcessorOptions {
  /** Adds a lock to the processor for repeatable jobs, to ensure only one job is processed at a time globally per scheduler */
  repeatableJobSingleton?: {
    /** Default is false */
    enabled?: boolean;
    /** Default lock for 10 seconds */
    lockSeconds?: number;
  };
}

export function getConnection(): ConnectionOptions {
  const redis = redisClient();
  const {Connector, maxRetriesPerRequest, natMap, commandTimeout, ...connection} = redis.options;
  return connection;
}

interface JobQueueConstructor<DataType = unknown, ResultType = unknown> {
  name: string;
  processor: Processor<DataType, ResultType>;
  jobOptions?: Partial<JobsOptions>;
  workerOptions?: Partial<WorkerOptions>;
  processorOptions?: JobQueueProcessorOptions;
  onJobFailure?: (job?: Job<DataType, ResultType>, err?: Error) => void;
  onReady?: () => void | Promise<void>;
}

export class JobQueue<DataType = unknown, ResultType = unknown> {
  // biome-ignore lint/suspicious/noExplicitAny: only method found immediately
  public static queues: JobQueue<any, any>[] = [];

  public readonly name;
  private _queue?: Queue<DataType, ResultType, string, DataType, ResultType, string>;
  private _flow?: FlowProducer;
  private _worker?: Worker<DataType, ResultType>;
  private readonly processor: Processor<DataType, ResultType>;
  public readonly jobOptions?: Partial<JobsOptions>;
  public readonly workerOptions?: Partial<WorkerOptions>;
  public readonly processorOptions?: JobQueueProcessorOptions;
  private readonly onJobFailure?: (job?: Job<DataType, ResultType>, err?: Error) => void;
  private readonly onReady?: () => void | Promise<void>;

  constructor(options: JobQueueConstructor<DataType, ResultType>) {
    this.name = options.name;
    this.processor = options.processor;
    this.jobOptions = options.jobOptions;
    this.workerOptions = options.workerOptions;
    this.processorOptions = options.processorOptions;
    this.onJobFailure = options.onJobFailure;
    this.onReady = options.onReady;

    JobQueue.queues.push(this);
  }

  public static async init(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const queue of JobQueue.queues) {
      promises.push(queue.init());
      addQueueToBoard(queue);
    }
    await Promise.all(promises);
  }

  public static async close(): Promise<void> {
    await Promise.all(JobQueue.queues.map((queue) => queue._worker?.close()));
  }

  public get queue() {
    if (!this._queue) {
      this._queue = new Queue<DataType, ResultType, string, DataType, ResultType, string>(
        this.name,
        {
          connection: getConnection(),
          telemetry: new BullMQOtel(this.name),
        },
      );
    }
    return this._queue;
  }

  private get flow() {
    if (!this._flow) {
      this._flow = new FlowProducer({
        connection: getConnection(),
        telemetry: new BullMQOtel(this.name),
      });
    }
    return this._flow;
  }

  public async init(): Promise<void> {
    await this.queue.waitUntilReady();
    this._worker = new Worker<DataType, ResultType>(this.name, this.process.bind(this), {
      connection: getConnection(),
      telemetry: new BullMQOtel(this.name),
      ...this.workerOptions,
    });
    if (this.onJobFailure) {
      this._worker.on('failed', this.onJobFailure);
    }
    await this._worker.waitUntilReady();
    if (this.onReady) await this.onReady();
  }

  private async process(job: Job<DataType, ResultType>, token?: string): Promise<ResultType> {
    let processingSuccess = true;
    const repeatableJobSingleton = this.processorOptions?.repeatableJobSingleton?.enabled ?? false;
    const useLock = repeatableJobSingleton && Boolean(job.repeatJobKey);
    if (useLock) {
      const locked = await this.acquireJobLock(job);
      if (!locked) {
        job.log('Could not acquire job lock, skipping...');
        jobLockAcquisitionFailedCount.add(1, {queue: this.name});
        return undefined as unknown as ResultType;
      }
    }
    try {
      return await this.processor(job, token);
    } catch (err) {
      processingSuccess = false;
      await this.handleProcessingErrors(job, err, token);
      throw err;
    } finally {
      if (useLock) await this.releaseJobLock(job);
      jobProcessedCount.add(1, {queue: this.name, success: processingSuccess});
    }
  }

  private async handleProcessingErrors(
    job: Job<DataType, ResultType>,
    error: unknown,
    token?: string,
  ) {
    log.error({error, job: {name: job.name, id: job.id, queue: this.name}});
    this.countError(error);
    if (!(error instanceof JobError)) throw error;
    if (!error.canRetry) {
      throw new UnrecoverableError(error.message);
    }
    if (typeof error.rescheduleInMs === 'number') {
      await job.moveToDelayed(Date.now() + error.rescheduleInMs, token);
      throw new DelayedError();
    }
  }

  private countError(error: unknown) {
    // These are "expected" errors and should not be counted as such
    if (error instanceof WaitingChildrenError) return;

    let code = 'unhandled';
    let canRetry = true;
    let rescheduled = false;

    if (error instanceof JobError) {
      code = error.code;
      canRetry = error.canRetry;
      rescheduled = error.rescheduleInMs !== undefined;
    }

    jobErrorCount.add(1, {
      queue: this.name,
      code,
      canRetry,
      rescheduled,
    });
  }

  public add(name: string, data: DataType, opts?: Partial<JobsOptions>) {
    return this.queue.add(name, data, {...this.jobOptions, ...opts});
  }

  public addBulk(items: {name: string; data: DataType; opts?: Partial<JobsOptions>}[]) {
    return this.queue.addBulk(
      items.map((item) => ({...item, opts: {...this.jobOptions, ...item.opts}})),
    );
  }

  public addWithParent(
    name: string,
    data: DataType,
    parent: {id: string; queue: JobQueue},
    opts?: Partial<JobsOptions>,
  ) {
    return this.flow.add({
      name,
      queueName: this.name,
      data: data,
      opts: {
        parent: {id: parent.id, queue: parent.queue.queue.qualifiedName},
        ...this.jobOptions,
        ...opts,
      },
    });
  }

  public addBulkWithParent(
    items: {name: string; data: DataType; opts?: Partial<JobsOptions>}[],
    parent: {id: string; queue: JobQueue},
  ) {
    return this.flow.addBulk(
      items.map((item) => ({
        name: item.name,
        queueName: this.name,
        data: item.data,
        opts: {
          parent: {id: parent.id, queue: parent.queue.queue.qualifiedName},
          ...this.jobOptions,
          ...item.opts,
        },
      })),
    );
  }

  public upsertJobScheduler(
    schedulerId: string,
    repeatOptions: Omit<RepeatOptions, 'key'>,
    job?: {data?: DataType; opts?: Partial<JobsOptions>},
  ) {
    return this.queue.upsertJobScheduler(schedulerId, repeatOptions, {
      ...job,
      opts: {...this.jobOptions, ...job?.opts},
    });
  }

  public removeJobScheduler(schedulerId: string): Promise<boolean> {
    return this.queue.removeJobScheduler(schedulerId);
  }

  public getJobSchedulers(): Promise<JobSchedulerJson<DataType>[]> {
    return this.queue.getJobSchedulers();
  }

  private getJobLockKey(job: Job<DataType, ResultType>) {
    if (!job.repeatJobKey) {
      throw new Error('Job must have a repeatJobKey');
    }
    return `jobs:${this.name}:${job.repeatJobKey}:lock`;
  }

  private async acquireJobLock(job: Job<DataType, ResultType>): Promise<boolean> {
    const redis = redisClient();
    const key = this.getJobLockKey(job);
    const lockSeconds = this.processorOptions?.repeatableJobSingleton?.lockSeconds ?? 10;
    const result = await redis.set(key, 'true', 'EX', lockSeconds, 'NX');
    return result === 'OK';
  }

  private async releaseJobLock(job: Job<DataType, ResultType>) {
    await redisClient().del(this.getJobLockKey(job));
  }
}
