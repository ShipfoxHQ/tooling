{
  function node(type, props) {
    const loc = location();
    return { type, ...props, _start: loc.start.offset, _end: loc.end.offset };
  }

  function addSource(ast) {
    if (ast === null) return null;
    const source = input.substring(ast._start, ast._end);
    const { _start, _end, ...rest } = ast;

    switch (rest.type) {
      case "and":
      case "or":
        return { ...rest, left: addSource(rest.left), right: addSource(rest.right), source };
      case "not":
        return { ...rest, expr: addSource(rest.expr), source };
      default:
        return { ...rest, source };
    }
  }

  function injectFacet(ast, facet) {
    if (ast.type === "and" || ast.type === "or") {
      return { ...ast, left: injectFacet(ast.left, facet), right: injectFacet(ast.right, facet) };
    }
    if (ast.type === "not") {
      return { ...ast, expr: injectFacet(ast.expr, facet) };
    }
    return { ...ast, facet };
  }
}

// ─── Entry ───────────────────────────────────────────────────────────

Query
  = _ expr:Expression _ { return addSource(expr); }
  / _ { return null; }

// ─── Expressions (precedence: OR < AND < NOT < Primary) ─────────────

Expression
  = OrExpression

OrExpression
  = left:AndExpression
    tail:(_ "OR" !IdentChar _ AndExpression)* {
      return tail.reduce(
        (acc, [, , , , right]) => ({ type: "or", left: acc, right, _start: acc._start, _end: right._end }),
        left
      );
    }

AndExpression
  = left:Primary
    tail:(
      (_ "AND" !IdentChar _ Primary)
      / (_ !("OR" !IdentChar) Primary)
    )* {
      return tail.reduce(
        (acc, part) => {
          const right = part[part.length - 1];
          return { type: "and", left: acc, right, _start: acc._start, _end: right._end };
        },
        left
      );
    }

// ─── Primary ────────────────────────────────────────────────────────

Primary
  = "NOT" !IdentChar _ expr:Primary {
      return node("not", { expr });
    }
  / "-" expr:FacetValue {
      return node("not", { expr });
    }
  / FacetValue
  / "(" _ expr:Expression _ ")" {
      const loc = location();
      return { ...expr, _start: loc.start.offset, _end: loc.end.offset };
    }
  / FreeText

FacetValue
  = facet:Identifier ":" "(" _ expr:GroupExpr _ ")" {
      const loc = location();
      const result = injectFacet(expr, facet);
      result._start = loc.start.offset;
      result._end = loc.end.offset;
      return result;
    }
  / facet:Identifier ":" body:FacetBody {
      const loc = location();
      return { ...body, facet, _start: loc.start.offset, _end: loc.end.offset };
    }

FacetBody
  = "[" _ min:RangeValue _ "TO" !IdentChar _ max:RangeValue _ "]" {
      return node("range", { min, max });
    }
  / op:ComparisonOp value:Value {
      return node("match", { op, value });
    }
  / value:Value {
      return node("match", { op: "=", value });
    }

FreeText
  = value:QuotedString {
      return node("text", { value });
    }
  / !ReservedWord value:UnquotedValue {
      return node("text", { value });
    }

// ─── Grouped values: facet:(val1 OR val2) ───────────────────────────

GroupExpr
  = GroupOrExpr

GroupOrExpr
  = left:GroupAndExpr
    tail:(_ "OR" !IdentChar _ GroupAndExpr)* {
      return tail.reduce(
        (acc, [, , , , right]) => ({ type: "or", left: acc, right, _start: acc._start, _end: right._end }),
        left
      );
    }

GroupAndExpr
  = left:GroupPrimary
    tail:(
      (_ "AND" !IdentChar _ GroupPrimary)
      / (_ !("OR" !IdentChar) GroupPrimary)
    )* {
      return tail.reduce(
        (acc, part) => {
          const right = part[part.length - 1];
          return { type: "and", left: acc, right, _start: acc._start, _end: right._end };
        },
        left
      );
    }

GroupPrimary
  = "NOT" !IdentChar _ expr:GroupPrimary {
      return node("not", { expr });
    }
  / value:Value {
      return node("match", { op: "=", value });
    }
  / "(" _ expr:GroupExpr _ ")" {
      const loc = location();
      return { ...expr, _start: loc.start.offset, _end: loc.end.offset };
    }

// ─── Tokens ─────────────────────────────────────────────────────────

ReservedWord
  = ("AND" / "OR" / "NOT") !IdentChar

ComparisonOp
  = ">=" / "<=" / ">" / "<" / "="

Identifier
  = $([a-zA-Z_] IdentChar* ("." IdentChar+)*)

IdentChar
  = [a-zA-Z0-9_]

Value
  = QuotedString
  / UnquotedValue

RangeValue
  = QuotedString
  / $([^ \t\n\r"()\[\]]+)

QuotedString
  = "\"" chars:([^"]*) "\"" { return chars.join(""); }

UnquotedValue
  = $([^ \t\n\r"()]+)

_ "whitespace"
  = [ \t\n\r]*
