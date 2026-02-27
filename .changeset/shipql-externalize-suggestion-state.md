---
'@shipfox/react-ui': minor
---

Externalize ShipQL editor suggestion state: replace `fields`/`fetchSuggestions` with `facets`, `currentFacet`, `setCurrentFacet`, `valueSuggestions`, and `isLoadingValueSuggestions` props. The editor is now "dumb" — it reports cursor context via `setCurrentFacet` and renders whatever `facets`/`valueSuggestions` the parent provides.
