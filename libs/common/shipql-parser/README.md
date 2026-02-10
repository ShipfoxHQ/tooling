# @shipfox/shipql-parser

A Lucene-inspired query language parser for observability facet search. Parses a ShipQL query string into a typed AST.

## Usage

```ts
import { parse } from '@shipfox/shipql-parser';

const ast = parse('env:prod status:>=400');
```

`parse(input: string)` returns an `AstNode` or `null` for empty input.

## ShipQL syntax

### Facet match

Match a facet against an exact value. Unquoted values run until the next whitespace. Use double quotes for values containing spaces.

```
status:success
http.method:GET
message:"hello world"
```

### Comparison operators

Prefix a value with `>=`, `<=`, `>`, `<`, or `=` to perform numeric or lexicographic comparisons.

```
latency:>500
status:>=400
timestamp:<="2025-12-31"
```

### Range queries

Use bracket syntax to match a facet within an inclusive range.

```
status:[200 TO 299]
timestamp:["2025-01-01" TO "2025-12-31"]
```

### Boolean operators

Consecutive terms are joined with an implicit `AND`. Both `AND` and `OR` can be written explicitly. `AND` binds tighter than `OR`.

```
env:prod status:success          # implicit AND
env:prod AND status:success      # explicit AND
status:success OR status:error   # explicit OR
a:1 b:2 OR c:3                  # parsed as (a:1 AND b:2) OR c:3
```

### Negation

Negate a term with the `NOT` keyword or the `-` shorthand prefix.

```
NOT status:error
-status:error            # equivalent to NOT status:error
env:prod -status:error   # env:prod AND NOT status:error
```

### Grouped values

Use parentheses after a facet to match multiple values without repeating the facet name. All boolean operators work inside groups.

```
env:(prod OR staging)
tag:(web AND api)
tag:(web api)                    # implicit AND
http.method:(GET OR POST OR PUT)
```

### Parenthesized expressions

Use parentheses to override operator precedence in the top-level expression.

```
status:error AND (env:prod OR env:staging)
```

### Free text

Terms without a facet prefix are parsed as free text. Quoted strings are supported.

```
hello
"error occurred"
error service:api                # implicit AND between text and facet match
```

### Facet names

Facet names start with a letter or underscore, followed by alphanumeric characters or underscores. Dots are allowed for nested facets.

```
status
http.status_code
_internal.flag
```

## AST node types

The parser produces a tree of the following node types.

### `MatchNode`

A facet compared against a value. The `op` field indicates the comparison operator. Plain `facet:value` syntax uses `=`.

```ts
type MatchNode = {
  type: 'match';
  facet: string;
  op: '>=' | '<=' | '>' | '<' | '=';
  value: string;
};
```

| Input | `op` | `facet` | `value` |
|---|---|---|---|
| `status:success` | `=` | `status` | `success` |
| `status:=success` | `=` | `status` | `success` |
| `latency:>500` | `>` | `latency` | `500` |
| `status:>=400` | `>=` | `status` | `400` |

### `RangeNode`

An inclusive range query on a facet.

```ts
type RangeNode = {
  type: 'range';
  facet: string;
  min: string;
  max: string;
};
```

| Input | `facet` | `min` | `max` |
|---|---|---|---|
| `status:[200 TO 299]` | `status` | `200` | `299` |

### `TextNode`

Free text not bound to a facet.

```ts
type TextNode = {
  type: 'text';
  value: string;
};
```

| Input | `value` |
|---|---|
| `hello` | `hello` |
| `"error occurred"` | `error occurred` |

### `AndNode`

A conjunction of two sub-expressions. Produced by implicit adjacency or explicit `AND`.

```ts
type AndNode = {
  type: 'and';
  left: AstNode;
  right: AstNode;
};
```

### `OrNode`

A disjunction of two sub-expressions. Always explicit.

```ts
type OrNode = {
  type: 'or';
  left: AstNode;
  right: AstNode;
};
```

### `NotNode`

Negation of a sub-expression. Produced by `NOT` or `-`.

```ts
type NotNode = {
  type: 'not';
  expr: AstNode;
};
```

### Full union type

```ts
type AstNode =
  | MatchNode
  | RangeNode
  | TextNode
  | AndNode
  | OrNode
  | NotNode;
```

## Operator precedence

From lowest to highest:

1. `OR`
2. `AND` (implicit or explicit)
3. `NOT` / `-`
4. Primary (facet match, range, grouped expression, parenthesized expression, free text)

## Reserved words

`AND`, `OR`, and `NOT` are reserved when they appear as standalone tokens. They can still be used as part of facet names (e.g. `ANDROID:true`, `ORDER:asc`).
