import {randomUUID} from 'node:crypto';
import type {Static, TSchema} from '@fastify/type-provider-typebox';
import {type FlowJob, JobQueue, type JobsOptions, type WorkerOptions, getFlow} from '@shipfox/jobs';
import {log} from '@shipfox/log';
import Ajv, {type ValidateFunction, ValidationError} from 'ajv';
import addFormats from 'ajv-formats';
import {type MessageMetadata, type SubscriptionConfig, on} from 'core/consumer';
import {merge} from 'ts-deepmerge';

const ajv = new Ajv({strict: true, removeAdditional: true});
addFormats(ajv);

const baseJobOptions: JobsOptions = {
  attempts: 5,
  backoff: {type: 'exponential', delay: 1_000},
  removeOnComplete: {age: 60 * 60 * 24 * 7, count: 1_000},
};

type BasicWorkerOptions = Omit<WorkerOptions, 'connection'>;

const baseWorkerOptions: BasicWorkerOptions = {concurrency: 50};

export interface EventHandler<QueueEventType, FilteredEventType extends QueueEventType> {
  name: string;
  filter: (event: QueueEventType) => event is FilteredEventType;
  process: (event: FilteredEventType) => Promise<void>;
  idempotencyKeySelector?: (event: FilteredEventType) => string;
  jobOptions?: JobsOptions;
  workerOptions?: {concurrency: number};
}

export interface PubSubProcessorOptions<QueueEventTypeSchema extends TSchema | undefined> {
  defaultJobOptions?: JobsOptions;
  defaultWorkerOptions?: BasicWorkerOptions;
  subscriptionConfig?: SubscriptionConfig;
  schema?: QueueEventTypeSchema;
}

export class PubSubProcessor<
  QueueEventType extends QueueEventTypeSchema extends TSchema
    ? Static<QueueEventTypeSchema>
    : unknown,
  QueueEventTypeSchema extends TSchema | undefined = undefined,
> {
  protected subscription: string;
  // biome-ignore lint/suspicious/noExplicitAny: Type safety is handled by the filter function
  protected handlers: Array<EventHandler<QueueEventType, any>> = [];
  // biome-ignore lint/suspicious/noExplicitAny: Type safety is handled by the filter function
  protected queues = new Map<string, JobQueue<any>>();
  protected defaultJobOptions: JobsOptions;
  protected defaultWorkerOptions: BasicWorkerOptions;
  protected subscriptionConfig?: SubscriptionConfig;
  protected schema?: QueueEventTypeSchema;
  protected schemaValidator?: ValidateFunction<QueueEventType>;
  protected subscriptionRegistered = false;

  constructor(subscription: string, options: PubSubProcessorOptions<QueueEventTypeSchema> = {}) {
    this.subscription = subscription;

    this.defaultJobOptions = merge(baseJobOptions, options.defaultJobOptions ?? {});
    this.defaultWorkerOptions = merge(baseWorkerOptions, options.defaultWorkerOptions ?? {});
    this.subscriptionConfig = options.subscriptionConfig;
    this.schema = options.schema;
    if (this.schema) this.schemaValidator = ajv.compile(this.schema);
  }

  public addHandler<FilteredEventType extends QueueEventType>(
    handler: EventHandler<QueueEventType, FilteredEventType>,
  ): void {
    const handlerName = handler.name;
    const subscription = this.subscription;

    if (!this.queues.has(handlerName)) this.createQueue(handlerName, handler);

    this.handlers.push(handler);
    log.info({handlerName, subscription}, 'Registered event handler');
    this.registerSubscription();
  }

  protected createQueue<FilteredEventType extends QueueEventType>(
    queueName: string,
    handler: EventHandler<QueueEventType, FilteredEventType>,
  ): JobQueue<FilteredEventType> {
    const jobOptions = merge(this.defaultJobOptions, handler.jobOptions ?? {});
    const workerOptions = merge(this.defaultWorkerOptions, handler.workerOptions ?? {});
    const queue = new JobQueue<FilteredEventType>({
      name: queueName,
      processor: (job) => handler.process(job.data),
      jobOptions,
      workerOptions,
    });

    this.queues.set(queueName, queue);

    return queue;
  }

  protected getJobToAdd<FilteredEventType extends QueueEventType>(
    event: FilteredEventType,
    handler: EventHandler<QueueEventType, FilteredEventType>,
  ): FlowJob {
    const handlerName = handler.name;
    const queue = this.queues.get(handlerName) as JobQueue<FilteredEventType>;

    if (!queue) throw new Error(`Queue not found: ${handlerName}`);

    const jobId = handler.idempotencyKeySelector
      ? handler.idempotencyKeySelector(event)
      : randomUUID();

    return {
      name: jobId,
      queueName: queue.name,
      data: event,
      opts: {...queue.jobOptions, jobId},
    };
  }

  protected validateEvent<QueueEventType>(
    event: unknown,
    validator: ValidateFunction<QueueEventType>,
  ): event is QueueEventType {
    const isValid = validator(event);
    if (!isValid) throw new ValidationError(validator.errors ?? []);
    return true;
  }

  protected parseMessage(content: Buffer): QueueEventType {
    const eventString = content.toString('utf8');
    const event = JSON.parse(eventString);
    if (this.schemaValidator) this.validateEvent<QueueEventType>(event, this.schemaValidator);
    return event as QueueEventType;
  }

  protected async onMessage(content: Buffer, _metadata: MessageMetadata): Promise<void> {
    const event = this.parseMessage(content);

    const impactedHandlers = this.handlers.filter((handler) => handler.filter(event));
    if (impactedHandlers.length === 0) return;

    const jobs = impactedHandlers.map((handler) => this.getJobToAdd(event, handler));
    await getFlow().addBulk(jobs);

    log.debug({jobs}, `Created ${jobs.length} job(s) for pub/sub event processing`);
  }

  protected registerSubscription(): void {
    if (this.subscriptionRegistered) return;
    on(this.subscription, this.onMessage.bind(this), this.subscriptionConfig);
    this.subscriptionRegistered = true;
  }
}
