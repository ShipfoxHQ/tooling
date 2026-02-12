import {QueryBuilderProvider} from './context';

export interface QueryBuilderProps {
  value?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
  container?: HTMLElement | null;
}

export function QueryBuilder(props: QueryBuilderProps) {
  return <QueryBuilderProvider {...props} />;
}
