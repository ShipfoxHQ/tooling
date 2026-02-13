/**
 * Mirrors Visibility's SelectedFacets (BE contract).
 * List facets: include or exclude a set of values.
 * Range facets: numeric min/max bounds.
 */
export interface SelectedFacets {
  [facetId: string]:
    | {
        type: 'list';
        methodology: 'include' | 'exclude';
        values: Set<string | null>;
      }
    | {
        type: 'range';
        min: number;
        max: number;
      };
}
