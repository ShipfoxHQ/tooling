import {Input, type InputProps} from 'components/Input';
import {type ChangeEvent, useCallback} from 'react';

export interface FacetSearchProps extends InputProps {
  search?: string;
  onSearch?: (value: string) => void;
}

export function FacetSearch({search, onSearch}: FacetSearchProps) {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      onSearch?.(value);
    },
    [onSearch],
  );

  return <Input value={search} onChange={onChange} startIcon="magnifyingGlass" />;
}
