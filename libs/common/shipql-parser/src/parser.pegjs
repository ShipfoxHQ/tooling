{
  function node(type, props) {
    return { type, ...props };
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
  = _ expr:Expression _ { return expr; }
  / _ { return null; }

// ─── Expressions (precedence: OR < AND < NOT < Primary) ─────────────

Expression
  = OrExpression

OrExpression
  = left:AndExpression
    tail:(_ "OR" !IdentChar _ AndExpression)* {
      return tail.reduce(
        (acc, [, , , , right]) => node("or", { left: acc, right }),
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
          return node("and", { left: acc, right });
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
  / "(" _ expr:Expression _ ")" { return expr; }
  / FreeText

FacetValue
  = facet:Identifier ":" "(" _ expr:GroupExpr _ ")" {
      return injectFacet(expr, facet);
    }
  / facet:Identifier ":" body:FacetBody {
      return { ...body, facet };
    }

FacetBody
  = "[" _ min:RangeValue _ "TO" !IdentChar _ max:RangeValue _ "]" {
      return node("range", { min, max });
    }
  / op:ComparisonOp value:Value {
      return node("match", { op, value });
    }
  / value:Value {
      return node("match", { op: "eq", value });
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
        (acc, [, , , , right]) => node("or", { left: acc, right }),
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
          return node("and", { left: acc, right });
        },
        left
      );
    }

GroupPrimary
  = "NOT" !IdentChar _ expr:GroupPrimary {
      return node("not", { expr });
    }
  / value:Value {
      return node("match", { op: "eq", value });
    }
  / "(" _ expr:GroupExpr _ ")" { return expr; }

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
