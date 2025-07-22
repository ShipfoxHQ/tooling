import {Card, CardContent} from 'components/Card';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from 'components/Collapsible';
import {type HTMLAttributes, useState} from 'react';
import {cn} from 'utils';
import {FacetHeader} from './FacetHeader';
import {ListFacetContent, type ListFacetContentProps} from './ListFacetContent';
import {RangeFacetContent, type RangeFacetContentProps} from './RangeFacetContent';

type TypeSpecificFacetProps =
  | (ListFacetContentProps & {type: 'list'})
  | (RangeFacetContentProps & {type: 'range'});

type BaseFacetProps = {
  id: string;
  name: string;
  defaultOpen?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>;

export type FacetProps = BaseFacetProps & TypeSpecificFacetProps;

export function Facet({id, name, defaultOpen, className, ...props}: FacetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <Card className={cn('flex flex-col overflow-hidden', className)}>
        <CollapsibleTrigger asChild>
          <FacetHeader isOpen={isOpen} name={name} />
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <CardContent className={cn(['flex flex-col gap-2', className])}>
            {props.type === 'list' ? (
              <ListFacetContent
                id={id}
                values={props.values}
                search={props.search}
                onSearch={props.onSearch}
                onInclude={props.onInclude}
                onExclude={props.onExclude}
                onSelect={props.onSelect}
              />
            ) : (
              <RangeFacetContent
                id={id}
                min={props.min}
                max={props.max}
                value={props.value}
                step={props.step}
                format={props.format}
                onValueChange={props.onValueChange}
                onValueCommit={props.onValueCommit}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
