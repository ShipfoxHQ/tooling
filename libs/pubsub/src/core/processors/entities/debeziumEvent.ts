interface BaseDebeziumEvent {
  schema: unknown;
  payload: {
    source: {
      table: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export type DebeziumCreateEvent<T> = BaseDebeziumEvent & {
  payload: {
    before: null;
    after: T;
    op: 'c';
  };
};

export type DebeziumUpdateEvent<T> = BaseDebeziumEvent & {
  payload: {
    before: T;
    after: T;
    op: 'u';
  };
};

export type DebeziumDeleteEvent<T> = BaseDebeziumEvent & {
  payload: {
    before: T;
    after: null;
    op: 'd';
  };
};

// biome-ignore lint/suspicious/noExplicitAny: We let the users setup their own typing upper up
export type DebeziumEvent<T = any> =
  | DebeziumCreateEvent<T>
  | DebeziumUpdateEvent<T>
  | DebeziumDeleteEvent<T>;
