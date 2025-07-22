import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent, {type UserEvent} from '@testing-library/user-event';
import {
  type NormalizedInterval,
  endOfDay,
  startOfDay,
  startOfMinute,
  subDays,
  subHours,
} from 'date-fns';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DateTimeRangePicker} from './DateTimeRangePicker';

const past1HourRegex = /past 1 hour/i;
const past6HourRegex = /past 6 hours/i;

describe('DateTimeRangePicker', () => {
  const now = new Date('2024-03-20T17:45:00Z');
  let interval: NormalizedInterval;
  const setInterval = (newInterval: NormalizedInterval) => {
    interval = newInterval;
  };
  let user: UserEvent;

  beforeEach(() => {
    interval = {
      start: subHours(now, 1),
      end: now,
    };
    user = userEvent.setup();
    vi.useFakeTimers({now, shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should open the menu on input focus', async () => {
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);

    const input = await screen.findByRole('textbox');
    await user.click(input);
    const button = await screen.findByRole('button', {name: past1HourRegex});
    expect(button).toBeVisible();
  });

  it('should close the menu on button click', async () => {
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);

    const input = await screen.findByRole('textbox');
    await user.click(input);
    const button = await screen.findByRole('button', {name: past1HourRegex});
    await user.click(button);
    if (screen.queryByRole('button', {name: 'Past 1 hour'}))
      await waitForElementToBeRemoved(() => screen.queryByRole('button', {name: past1HourRegex}));
  });

  it('should set the interval on button click', async () => {
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);
    const input = await screen.findByRole('textbox');
    await user.click(input);
    const button = await screen.findByRole('button', {name: past6HourRegex});
    await user.click(button);

    await waitFor(() =>
      expect({
        start: startOfMinute(interval.start),
        end: startOfMinute(interval.end),
      }).toEqual({
        start: subHours(now, 6),
        end: now,
      }),
    );
  });

  it('should update the input display to match the humanized interval on button click', async () => {
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);
    const input = await screen.findByRole('textbox');
    await user.click(input);
    const button = await screen.findByRole('button', {name: past6HourRegex});
    await user.click(button);

    await waitFor(() => expect(input).toHaveDisplayValue('Past 6 hours'));
  });

  it('should display a short notation in input when looking at full days', async () => {
    setInterval({
      start: startOfDay(subDays(now, 1)),
      end: endOfDay(now),
    });
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);
    const input = await screen.findByRole('textbox');

    expect(input).toHaveDisplayValue('Mar 19\u2009\u2013\u200920');
  });

  it('should display a full notation in input when focusing the input', async () => {
    setInterval({
      start: subDays(now, 1),
      end: now,
    });
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);
    const input = await screen.findByRole('textbox');
    await user.click(input);

    await waitFor(() =>
      expect(input).toHaveDisplayValue(
        'Mar 19, 2024, 5:45 PM\u2009\u2013\u2009Mar 20, 2024, 5:45 PM',
      ),
    );
  });

  it('should allow editing the interval as text directly', async () => {
    setInterval({
      start: subDays(now, 1),
      end: now,
    });
    render(<DateTimeRangePicker interval={interval} setInterval={setInterval} />);

    const input = await screen.findByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Mar 18, 2024, 5:45 PM - Mar 20, 2024, 5:45 PM{enter}');

    await waitFor(() =>
      expect({
        start: startOfMinute(interval.start),
        end: startOfMinute(interval.end),
      }).toEqual({
        start: subDays(now, 2),
        end: now,
      }),
    );
  });
});
