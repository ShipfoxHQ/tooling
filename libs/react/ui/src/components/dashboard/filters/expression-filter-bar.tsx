/**
 * Expression Filter Bar Component
 *
 * A horizontal button group for filtering by resource type.
 */

import {Button} from 'components/button';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';
import type {ResourceType} from '../context';

export interface ResourceTypeOption {
  id: ResourceType;
  label: string;
  disabled?: boolean;
}

export interface ExpressionFilterBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Available resource type options
   */
  options?: ResourceTypeOption[];
  /**
   * Currently selected resource type
   */
  value?: ResourceType;
  /**
   * Callback when resource type changes
   */
  onValueChange?: (value: ResourceType) => void;
}

/**
 * Default resource type options
 */
const DEFAULT_OPTIONS: ResourceTypeOption[] = [
  {id: 'ci-pipeline', label: 'CI Pipeline'},
  {id: 'ci-jobs', label: 'CI Jobs'},
  {id: 'ci-steps', label: 'CI Steps'},
  {id: 'runners', label: 'Runners', disabled: true},
  {id: 'suit', label: 'Suit', disabled: true},
  {id: 'cases', label: 'Cases', disabled: true},
];

/**
 * Expression Filter Bar
 *
 * Displays a horizontal button group for selecting resource types.
 * Integrates with the dashboard context for state management.
 *
 * @example
 * ```tsx
 * <ExpressionFilterBar
 *   value="ci-pipeline"
 *   onValueChange={setResourceType}
 * />
 * ```
 */
export function ExpressionFilterBar({
  options = DEFAULT_OPTIONS,
  value = 'ci-pipeline',
  onValueChange,
  className,
  ...props
}: ExpressionFilterBarProps) {
  return (
    <div
      className={cn(
        // Desktop: Normal flex layout
        'md:flex md:gap-4 md:items-start',
        // Mobile: Swipeable with scroll-snap
        'overflow-x-auto scrollbar-none',
        // Scroll snap for smooth swiping
        'snap-x snap-mandatory',
        // Hide scrollbar but allow scrolling
        '[&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    >
      <div className="flex gap-4 items-start px-0">
        {options.map((option) => {
          const isActive = value === option.id;
          return (
            <Button
              variant={isActive ? 'secondary' : 'transparent'}
              size="md"
              key={option.id}
              disabled={option.disabled}
              onClick={() => !option.disabled && onValueChange?.(option.id)}
              className={cn(
                'flex items-center justify-center gap-8 px-10 py-6 rounded-6',
                'text-sm font-medium leading-20 tracking-0',
                'transition-colors',
                // Mobile: Prevent shrinking, snap alignment
                'shrink-0 snap-start',
                // Active state
                isActive && 'shadow-none bg-background-button-neutral-pressed',
                // Inactive state
                !isActive &&
                  !option.disabled &&
                  'bg-transparent text-foreground-neutral-subtle hover:text-foreground-neutral-base',
              )}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
