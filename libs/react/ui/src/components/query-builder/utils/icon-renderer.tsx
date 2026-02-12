import {Icon} from 'components/icon';
import type {AutocompleteSuggestion} from './suggestions';

export function renderSuggestionIcon(s: AutocompleteSuggestion): React.ReactNode {
  if (s.type === 'wildcard') {
    return <span className="text-background-accent-purple-base text-sm font-bold">*</span>;
  }
  if (s.type === 'custom' || s.icon === 'plus') {
    return <Icon name="addLine" className="size-16 text-tag-success-text" />;
  }
  if (s.icon === 'clock') {
    return <Icon name="timeLine" className="size-16 text-foreground-neutral-subtle" />;
  }
  if (s.icon === 'negate') {
    return <span className="text-background-accent-warning-base font-bold text-sm">-</span>;
  }
  if (s.icon === 'search') {
    return <Icon name="searchLine" className="size-16 text-foreground-neutral-subtle" />;
  }
  if (s.icon === 'check') {
    return <Icon name="check" className="size-16 text-foreground-neutral-base" />;
  }
  return <Icon name="arrowRightLongFill" className="size-16 text-foreground-neutral-subtle" />;
}

export function renderSuggestionLabel(
  s: AutocompleteSuggestion,
  isValueType: boolean,
  isSelected: boolean,
  applyNegation: boolean,
): React.ReactNode {
  const isNegatedLabel = s.isNegated && s.label.toString().startsWith('-');
  const labelText = isNegatedLabel ? s.label.toString().slice(1) : s.label;

  if (isValueType && isSelected) {
    return isNegatedLabel ? (
      <span className="text-background-accent-warning-base">-{labelText}</span>
    ) : (
      labelText
    );
  }
  if (applyNegation) {
    return (
      <>
        <span className="text-background-accent-warning-base">-</span>
        {s.label}
      </>
    );
  }
  if (s.isNegated && s.label.toString().startsWith('-')) {
    const textPart = s.label.toString().slice(1);
    return <span className="text-background-accent-warning-base">-{textPart}</span>;
  }
  return s.label;
}
