export interface JobErrorParams {
  /** Additional context */
  data?: unknown;
  /** Indicates that the job can be retried, default true */
  canRetry?: boolean;
  /** If a task  */
  rescheduleInMs?: number;
}

export class JobError extends Error {
  code: string;
  data?: unknown;
  canRetry: boolean;
  rescheduleInMs?: number;

  constructor(code: string, message: string, params: JobErrorParams = {}) {
    super(message);
    this.code = code;
    this.data = params.data;
    this.canRetry = params.canRetry ?? true;
    this.rescheduleInMs = params.rescheduleInMs;
  }
}
