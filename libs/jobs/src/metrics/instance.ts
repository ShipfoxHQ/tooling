import {instanceMetrics} from '@shipfox/opentelemetry';
import {JobQueue} from 'core/jobQueue';

const meter = instanceMetrics.getMeter('jobs');

export const jobProcessedCount = meter.createCounter<{queue: string; success: boolean}>(
  'jobs_job_processed',
  {
    description: 'Count of all jobs processed',
  },
);

export const jobErrorCount = meter.createCounter<{
  queue: string;
  code: string;
  rescheduled: boolean;
  canRetry: boolean;
}>('jobs_job_error', {
  description: 'Count of all jobs processed',
});

export const jobLockAcquisitionFailedCount = meter.createCounter<{queue: string}>(
  'jobs_lock_acquisition_failed',
);

const jobCount = meter.createObservableGauge<{queue: string; state: string}>('jobs_job_count');
jobCount.addCallback(async (observer) => {
  for (const queue of JobQueue.queues) {
    const counts = await queue.queue.getJobCounts();
    for (const [state, count] of Object.entries(counts)) {
      observer.observe(count, {queue: queue.name, state});
    }
  }
});
