/**
 * Generic Page Toolbar Component
 *
 * A reusable toolbar for dashboard pages with title, refresh indicator,
 * time period selector, and playback controls.
 */

import {Button} from 'components/button';
import {ButtonGroup, ButtonGroupSeparator} from 'components/button-group';
import {Icon} from 'components/icon';
import {IntervalSelector} from 'components/interval-selector';
import {Header, Text} from 'components/typography';
import type {ComponentProps, ReactNode} from 'react';
import {cn} from 'utils/cn';
import {useDashboardContext} from '../context';

export interface PageToolbarProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  /**
   * The title to display in the toolbar header
   */
  title: ReactNode;
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
  /**
   * Custom container for the interval selector popover
   */
  intervalSelectorContainer?: HTMLElement | null;
}

/**
 * Generic Page Toolbar
 *
 * A flexible toolbar component that can be used across different dashboard pages.
 * Supports title customization, time interval selection, refresh indicator, and playback controls.
 * Uses DashboardContext for interval state management.
 *
 * @example
 * ```tsx
 * <PageToolbar
 *   title="Analytics"
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
export function PageToolbar({
  title,
  onRefresh,
  showPlaybackControls = true,
  onRewind,
  onPlay,
  onSpeed,
  actions,
  children,
  intervalSelectorContainer,
  className,
  ...props
}: PageToolbarProps) {
  const {interval, setInterval, intervalValue, setIntervalValue, lastUpdated} =
    useDashboardContext();
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

        {/* Time Interval Selector - Responsive width */}
        <IntervalSelector
          interval={interval}
          onIntervalChange={setInterval}
          value={intervalValue}
          onValueChange={setIntervalValue}
          container={intervalSelectorContainer}
          className="w-[75vw] md:w-350"
        />

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
