---
"@shipfox/react-ui": minor
---

Add grouped facet suggestions with labels and inline descriptions to ShipQL editor.

Facets can now carry `FacetMetadata` (label, description, group, groupLabel, groupOrder). When any facet has metadata, the suggestion dropdown groups facets into labelled sections sorted by `groupOrder`, shows human-friendly labels with the raw facet ID right-aligned, and renders an inline description subtitle. Facets without metadata fall back to the existing flat "TYPE" header behavior.

New exports: `FacetMetadata` type.
Breaking change (additive): `FacetDef` object shape now has `config?` (optional) instead of required.
