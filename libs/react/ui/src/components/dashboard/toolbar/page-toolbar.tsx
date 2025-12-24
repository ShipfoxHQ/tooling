/**
 * Generic Page Toolbar Component
 *
 * A reusable toolbar for dashboard pages with title, refresh indicator,
 * time period selector, and playback controls.
 */

import {Button} from 'components/button';
import {ButtonGroup, ButtonGroupSeparator} from 'components/button-group';
import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'components/select';
import {Header, Text} from 'components/typography';
import type {ComponentProps, ReactNode} from 'react';
import {cn} from 'utils/cn';
import type {TimePeriod} from '../context';

export interface PageToolbarProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  /**
   * The title to display in the toolbar header
   */
  title: ReactNode;
  /**
   * Last updated timestamp text
   * @default '13s ago'
   */
  lastUpdated?: string;
  /**
   * Current time period value
   * @default '2days'
   */
  timePeriod?: TimePeriod;
  /**
   * Callback when time period changes
   */
  onTimePeriodChange?: (value: TimePeriod) => void;
  /**
   * Callback when refresh button is clicked
   */
  onRefresh?: () => void;
  /**
   * Show playback controls
   * @default true
   */
  showPlaybackControls?: boolean;
  /**
   * Callback when rewind button is clicked
   */
  onRewind?: () => void;
  /**
   * Callback when play button is clicked
   */
  onPlay?: () => void;
  /**
   * Callback when speed button is clicked
   */
  onSpeed?: () => void;
  /**
   * Additional actions to render on the right side
   */
  actions?: ReactNode;
  /**
   * Children to render (e.g., mobile menu button)
   */
  children?: ReactNode;
}

/**
 * Generic Page Toolbar
 *
 * A flexible toolbar component that can be used across different dashboard pages.
 * Supports title customization, time period selection, refresh indicator, and playback controls.
 *
 * @example
 * ```tsx
 * <PageToolbar
 *   title="Analytics"
 *   timePeriod="2days"
 *   onTimePeriodChange={setTimePeriod}
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
export function PageToolbar({
  title,
  lastUpdated = '13s ago',
  timePeriod = '2days',
  onTimePeriodChange,
  onRefresh,
  showPlaybackControls = true,
  onRewind,
  onPlay,
  onSpeed,
  actions,
  children,
  className,
  ...props
}: PageToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-12 items-center justify-between px-12 py-20 md:px-24 md:py-40',
        className,
      )}
      {...props}
    >
      {/* Left: Title + Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu (if provided) */}
        {children}

        {/* Title */}
        {typeof title === 'string' ? (
          <Header variant="h1" className="text-foreground-neutral-base text-xl md:text-2xl">
            {title}
          </Header>
        ) : (
          title
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-8 md:gap-12">
        {/* Last Updated / Refresh */}
        <div className="flex items-center gap-8">
          <Button
            variant="transparent"
            size="md"
            className="w-full group text-foreground-neutral-muted"
            aria-label="Refresh"
            onClick={onRefresh}
          >
            <Text size="xs" className="hidden md:flex group-hover:text-foreground-neutral-subtle">
              {lastUpdated}
            </Text>
            <Icon
              name="loopRightLine"
              className="size-14 group-hover:text-foreground-neutral-subtle"
            />
          </Button>
        </div>

        {/* Time Period Selector - Responsive width */}
        <Select defaultValue={timePeriod} value={timePeriod} onValueChange={onTimePeriodChange}>
          <SelectTrigger className="w-full md:w-280">
            <div className="flex items-center gap-8 flex-1 min-w-0">
              <SelectValue placeholder="Select time range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1hour">
              <div className="flex items-center gap-8">
                <Kbd className="h-16">1h</Kbd>
                <span>Past 1 Hour</span>
              </div>
            </SelectItem>
            <SelectItem value="1day">
              <div className="flex items-center gap-8">
                <Kbd className="h-16">1d</Kbd>
                <span>Past 1 Day</span>
              </div>
            </SelectItem>
            <SelectItem value="2days">
              <div className="flex items-center gap-8">
                <Kbd className="h-16">2d</Kbd>
                <span>Past 2 Days</span>
              </div>
            </SelectItem>
            <SelectItem value="7days">
              <div className="flex items-center gap-8">
                <Kbd className="h-16">7d</Kbd>
                <span>Past 7 Days</span>
              </div>
            </SelectItem>
            <SelectItem value="30days">
              <div className="flex items-center gap-8">
                <Kbd className="h-16">30d</Kbd>
                <span>Past 30 Days</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Playback Controls - Hidden on mobile */}
        {showPlaybackControls && (
          <ButtonGroup aria-label="Playback controls" className="hidden lg:flex">
            <Button variant="secondary" size="md" aria-label="Rewind" onClick={onRewind}>
              <Icon name="rewindFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="md" aria-label="Play" onClick={onPlay}>
              <Icon name="playFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="md" aria-label="Speed" onClick={onSpeed}>
              <Icon name="speedFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
        )}

        {/* Additional Actions */}
        {actions}
      </div>
    </div>
  );
}
