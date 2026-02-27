import {Icon} from 'components/icon';
import type {LeafAstNode} from '../lexical/shipql-leaf-node';
import type {ShipQLFieldDef, SuggestionItem} from './types';

// ─── Internal suggestion shape ────────────────────────────────────────────────

interface RawSuggestion {
  type: 'field' | 'value' | 'complete' | 'wildcard';
  value: string;
  label: string;
  field?: string;
  icon: 'search' | 'check' | 'arrow' | 'negate' | 'timer';
  isNegated?: boolean;
  isSelected?: boolean;
}

// ─── Icon + label rendering ───────────────────────────────────────────────────

function renderIcon(icon: RawSuggestion['icon']): React.ReactNode {
  if (icon === 'check')
    return <Icon name="check" className="size-16 text-foreground-neutral-base" />;
  if (icon === 'negate')
    return <span className="text-background-accent-warning-base font-bold text-sm">-</span>;
  if (icon === 'search')
    return <Icon name="searchLine" className="size-16 text-foreground-neutral-subtle" />;
  if (icon === 'timer')
    return <Icon name="timer2Line" className="size-16 text-foreground-neutral-subtle" />;
  return <Icon name="arrowRightLongFill" className="size-16 text-foreground-neutral-subtle" />;
}

function renderLabel(s: RawSuggestion): React.ReactNode {
  if (s.isNegated && typeof s.label === 'string' && s.label.startsWith('-')) {
    const text = s.label.slice(1);
    return <span className="text-background-accent-warning-base">-{text}</span>;
  }
  return s.label;
}

// ─── Input parsing ────────────────────────────────────────────────────────────

interface ParsedInput {
  field?: string;
  value?: string;
  isNegated: boolean;
  hasOperator: boolean;
}

function parseCurrentInput(text: string, fields: ShipQLFieldDef[]): ParsedInput {
  const colonIdx = text.indexOf(':');
  if (colonIdx > 0) {
    const candidate = text.slice(0, colonIdx).trim().toLowerCase();
    const field = fields.find(
      (f) => f.name.toLowerCase() === candidate || f.label.toLowerCase() === candidate,
    );
    if (field) {
      const afterColon = text.slice(colonIdx + 1);
      const isNegated = afterColon.startsWith('!') || afterColon.startsWith('-');
      const rawValue = isNegated ? afterColon.slice(1) : afterColon;
      return {
        field: field.name,
        value: rawValue || undefined,
        isNegated,
        hasOperator: true,
      };
    }
  }
  return {value: text || undefined, isNegated: false, hasOperator: false};
}

// ─── Leaf helpers (for refocus) ───────────────────────────────────────────────

export function extractFacetFromLeaf(leaf: LeafAstNode): string | undefined {
  if (leaf.type === 'match') return leaf.facet;
  if (leaf.type === 'range') return leaf.facet;
  if (leaf.type === 'not') {
    const inner = leaf.expr;
    if (inner.type === 'match' || inner.type === 'range') return inner.facet;
  }
  return undefined;
}

function extractValueFromLeaf(leaf: LeafAstNode): string | undefined {
  if (leaf.type === 'match') return leaf.value;
  if (leaf.type === 'not' && leaf.expr.type === 'match') return leaf.expr.value;
  return undefined;
}

// ─── Range / duration suggestions ────────────────────────────────────────────

function generateRangeSuggestions(field: ShipQLFieldDef): SuggestionItem[] {
  const presets: SuggestionItem[] = [
    {
      value: `__raw__${field.name}:<1s `,
      label: '< 1s',
      icon: renderIcon('timer'),
      selected: false,
      isNegated: false,
    },
    {
      value: `__raw__${field.name}:[1s TO 5s] `,
      label: '1s – 5s',
      icon: renderIcon('timer'),
      selected: false,
      isNegated: false,
    },
    {
      value: `__raw__${field.name}:[5s TO 30s] `,
      label: '5s – 30s',
      icon: renderIcon('timer'),
      selected: false,
      isNegated: false,
    },
    {
      value: `__raw__${field.name}:>30s `,
      label: '> 30s',
      icon: renderIcon('timer'),
      selected: false,
      isNegated: false,
    },
  ];

  const sliderItem: SuggestionItem = {
    value: `__duration-range__${field.name}`,
    label: 'Custom range',
    icon: null,
    selected: false,
    isNegated: false,
    type: 'duration-range',
    rangeField: field,
  };

  return [...presets, sliderItem];
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface SuggestionsContext {
  isNegated?: boolean;
}

// ─── Main generator ───────────────────────────────────────────────────────────

/**
 * Derives suggestion items from the current editor text and field definitions.
 * The `activeText` is the segment currently being typed (last token after a leaf
 * chip, or the whole text if no chips yet).
 */
export function generateSuggestions(
  activeText: string,
  fields: ShipQLFieldDef[],
  context: SuggestionsContext = {},
): SuggestionItem[] {
  const trimmed = activeText.trim();
  const parsed = parseCurrentInput(trimmed, fields);
  const raw: RawSuggestion[] = [];
  const showNegated = parsed.isNegated || Boolean(context.isNegated);

  // ── Case 1: Typing a field:value ─────────────────────────────────────────
  if (parsed.field && parsed.hasOperator) {
    const field = fields.find((f) => f.name === parsed.field);
    if (!field) return [];

    // Range fields get slider + presets
    if (field.type === 'range') {
      return generateRangeSuggestions(field);
    }

    const enumValues = field.values ?? [];
    const search = parsed.value?.toLowerCase() ?? '';
    const matching = enumValues.filter((v) => !search || v.toLowerCase().includes(search));

    if (matching.length === 0 && (search || enumValues.length === 0)) {
      return [
        {
          value: '__none__',
          label: 'No suggestions found',
          icon: <Icon name="searchLine" className="size-16 text-foreground-neutral-muted" />,
          selected: false,
          isNegated: false,
          type: 'section-header',
        },
      ];
    }

    for (const v of matching) {
      if (showNegated) {
        raw.push({
          type: 'value',
          value: v,
          label: `-${v}`,
          field: parsed.field,
          icon: 'negate',
          isNegated: true,
        });
      } else {
        raw.push({
          type: 'value',
          value: v,
          label: v,
          field: parsed.field,
          icon: 'arrow',
          isNegated: false,
        });
      }
    }

    // Wildcard option when no value typed yet
    if (!parsed.value) {
      raw.push({
        type: 'wildcard',
        value: '*',
        label: '* (any value)',
        field: parsed.field,
        icon: 'search',
      });
    }

    return toSuggestionItems(raw);
  }

  // ── Case 2: Partial field name typed ─────────────────────────────────────
  if (trimmed) {
    const search = trimmed.toLowerCase();
    const matchingFields = fields.filter(
      (f) => f.name.toLowerCase().includes(search) || f.label.toLowerCase().includes(search),
    );

    for (const f of matchingFields.slice(0, 6)) {
      raw.push({type: 'field', value: f.name, label: f.name, icon: 'search'});
    }

    // Also search across values for an exact field:value match (list fields only)
    for (const f of fields) {
      if (f.type === 'range') continue;
      for (const v of f.values ?? []) {
        if (v.toLowerCase().includes(search)) {
          raw.push({
            type: 'complete',
            value: v,
            label: `${f.name}:"${v}"`,
            field: f.name,
            icon: 'check',
            isNegated: showNegated,
          });
        }
      }
    }

    // Deduplicate by label
    const seen = new Set<string>();
    const deduped = raw.filter((s) => {
      const key = String(s.label);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const sliced = deduped.slice(0, 8);
    const fieldItems = sliced.filter((s) => s.type === 'field');
    const completeItems = sliced.filter((s) => s.type !== 'field');
    if (fieldItems.length > 0 && completeItems.length > 0) {
      return injectSectionHeaders(sliced);
    }
    return toSuggestionItems(sliced);
  }

  // ── Case 3: Empty input → show all fields ────────────────────────────────
  for (const f of fields.slice(0, 6)) {
    raw.push({type: 'field', value: f.name, label: f.name, icon: 'search'});
  }

  return toSuggestionItems(raw);
}

// ─── Leaf-refocus suggestions ─────────────────────────────────────────────────

/**
 * Generate value suggestions for an existing leaf chip the user focused on.
 * The current value is marked as `selected: true`.
 */
export function generateSuggestionsForLeaf(
  leaf: LeafAstNode,
  fields: ShipQLFieldDef[],
  isNegated: boolean,
): SuggestionItem[] {
  const facet = extractFacetFromLeaf(leaf);
  if (!facet) return [];

  const field = fields.find((f) => f.name === facet);
  if (!field) return [];

  const currentValue = extractValueFromLeaf(leaf);
  const activeText = `${facet}:${currentValue ?? ''}`;
  const items = generateSuggestions(activeText, fields, {isNegated});

  if (!currentValue) return items;

  // Mark the currently selected value
  return items.map((item) => {
    if (item.type) return item;
    const isCurrentValue = item.value.includes(`__${currentValue}__`);
    return isCurrentValue ? {...item, selected: true} : item;
  });
}

// ─── Encode + convert ─────────────────────────────────────────────────────────

function encodeValue(s: RawSuggestion): string {
  if (s.type === 'field') return `__field__${s.value}`;
  if (s.type === 'wildcard') return `__wildcard__${s.field}`;
  if (s.type === 'complete')
    return `__complete__${s.field}__${s.value}__${s.isNegated ? '1' : '0'}`;
  return `__value__${s.field}__${s.value}__${s.isNegated ? '1' : '0'}`;
}

function toSuggestionItems(raw: RawSuggestion[]): SuggestionItem[] {
  return raw.map((s) => ({
    value: encodeValue(s),
    label: renderLabel(s),
    icon: renderIcon(s.icon),
    selected: s.isSelected ?? false,
    isNegated: s.isNegated ?? false,
  }));
}

function injectSectionHeaders(raw: RawSuggestion[]): SuggestionItem[] {
  const fieldItems = raw.filter((s) => s.type === 'field');
  const others = raw.filter((s) => s.type !== 'field');
  const result: SuggestionItem[] = [];

  if (fieldItems.length > 0) {
    result.push({
      value: '__header__fields',
      label: 'Fields',
      icon: null,
      selected: false,
      isNegated: false,
      type: 'section-header',
    });
    result.push(...toSuggestionItems(fieldItems));
  }
  if (others.length > 0) {
    result.push({
      value: '__header__matches',
      label: 'Matches',
      icon: null,
      selected: false,
      isNegated: false,
      type: 'section-header',
    });
    result.push(...toSuggestionItems(others));
  }
  return result;
}
