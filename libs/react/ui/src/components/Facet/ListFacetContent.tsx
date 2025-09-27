import {Typography} from 'components/Typography';
import {FacetList} from './FacetList';
import {FacetSearch} from './FacetSearch';
import type {FacetValueData, FacetValueSelectors} from './FacetValue';

export interface ListFacetContentProps extends FacetValueSelectors {
  values: FacetValueData[];
  search?: string;
  onSearch?: (value: string) => void;
}

export function ListFacetContent({
  values,
  search,
  onSearch,
  id,
  onInclude,
  onExclude,
  onSelect,
}: Omit<ListFacetContentProps, 'type'> & {id: string}) {
  const displaySearch = values.length > 30 || search?.length !== 0;
  return (
    <>
      {displaySearch && <FacetSearch search={search} onSearch={onSearch} />}
      {values.length === 0 && search?.length && (
        <Typography variant="muted" className="text-center">
          No results for &quot;{search}&quot;
        </Typography>
      )}
      <FacetList
        id={id}
        values={values}
        onInclude={onInclude}
        onExclude={onExclude}
        onSelect={onSelect}
      />
    </>
  );
}
