---
'@shipfox/react-ui': minor
---

Add suggestion dropdown to ShipQL editor with facet/value autocompletion, range facet panel, negation support, and error border on unparseable queries. Externalize suggestion state so the editor receives `facets`, `currentFacet`, `setCurrentFacet`, `valueSuggestions`, and `isLoadingValueSuggestions` from the parent. Fix initial tokenization and right-arrow leaf exit behavior.
