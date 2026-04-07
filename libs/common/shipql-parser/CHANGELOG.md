# @shipfox/shipql-parser

## 0.2.1

### Patch Changes

- b30baa9: Add `allowFreeText` prop to `ShipQLEditor` and `hasTextNodes` utility to the parser. When `allowFreeText={false}`, text node chips render with error styling and `onChange` is not called on blur, enabling metrics and traces editors to reject bare-word queries.

## 0.2.0

### Minor Changes

- a2d06a0: Release @shipfox/shipql-parser, @shipfox/react-ui, @shipfox/node-pg, @shipfox/biome

## 0.1.0

### Minor Changes

- 7a9eb7a: Update css export and bump parser version

## 0.0.1

### Patch Changes

- 03a6127: Use shorthand `-` for negating expressions in ShipQL
- 9dcef22: Add ShipQL parser package
- c0e6cef: Include source strings in AST nodes
