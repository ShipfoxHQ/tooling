---
"@shipfox/shipql-parser": patch
"@shipfox/react-ui": patch
---

Add `allowFreeText` prop to `ShipQLEditor` and `hasTextNodes` utility to the parser. When `allowFreeText={false}`, text node chips render with error styling and `onChange` is not called on blur, enabling metrics and traces editors to reject bare-word queries.
