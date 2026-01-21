import type {Duration, NormalizedInterval} from 'date-fns';

export type IntervalSelection =
  | {
      type: 'relative';
      duration: Duration;
    }
  | {
      type: 'interval';
      interval: NormalizedInterval;
    };

export interface RelativeSuggestion {
  type: 'relative';
  duration: Duration;
}

export interface IntervalSuggestion {
  label: string;
  type: 'interval';
  interval: NormalizedInterval;
}

export type Suggestion = RelativeSuggestion | IntervalSuggestion;
