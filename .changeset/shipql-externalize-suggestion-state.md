---
'@shipfox/react-ui': minor
---

ShipQL editor: add suggestion dropdown with facet/value autocompletion, range facet panel, and negation support. Externalize suggestion state—parent supplies `facets`, `currentFacet`, `setCurrentFacet`, `valueSuggestions`, and `isLoadingValueSuggestions`. Add `onLeafChange(payload)` with `{ partialValue, ast }` for value-context updates (drives suggestions / backend). Export `ShipQLEditor`, `ShipQLEditorProps`, `LeafChangePayload`, `LeafAstNode`, `FacetDef`, `RangeFacetConfig`. Error border on unparseable queries; fix initial tokenization and right-arrow leaf exit.
