import type {Duration, NormalizedInterval} from 'date-fns';
import {differenceInDays, differenceInMonths, differenceInYears} from 'date-fns';
import {parseTextDurationShortcut} from 'utils/date';
import {formatDateTimeRange} from 'utils/format/date';
import type {CalendarShortcutResult, ParsedShortcut} from './constants';
import {isRelativeToNow} from './intervals';
import {findOptionByInterval} from './options';

function normalizeDurationToAppropriateUnit(duration: Duration): Duration {
  const normalized: Duration = {...duration};

  if (normalized.minutes && normalized.minutes >= 60) {
    const hours = Math.floor(normalized.minutes / 60);
    const remainingMinutes = normalized.minutes % 60;
    normalized.hours = (normalized.hours || 0) + hours;
    if (remainingMinutes > 0) {
      normalized.minutes = remainingMinutes;
    } else {
      delete normalized.minutes;
    }
  }

  if (normalized.hours && normalized.hours >= 24) {
    const days = Math.round(normalized.hours / 24);
    normalized.days = (normalized.days || 0) + days;
    delete normalized.hours;
  }

  if (normalized.days && normalized.days >= 30) {
    const months = Math.round(normalized.days / 30);
    normalized.months = (normalized.months || 0) + months;
    delete normalized.days;
  }

  if (normalized.months && normalized.months >= 12) {
    const years = Math.floor(normalized.months / 12);
    const remainingMonths = normalized.months % 12;
    normalized.years = (normalized.years || 0) + years;
    if (remainingMonths > 0) {
      normalized.months = remainingMonths;
    } else {
      delete normalized.months;
    }
  }

  const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'] as const;
  for (const unit of units) {
    if (normalized[unit]) {
      return {[unit]: normalized[unit]};
    }
  }

  return normalized;
}

export function parseRelativeTimeShortcut(input: string): ParsedShortcut | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  let duration = parseTextDurationShortcut(trimmed);
  if (!duration) return undefined;

  if (duration.days !== undefined) {
    const days = duration.days;
    if (days > 730) return undefined;
    if (days > 547) {
      return {
        shortcut: '2y',
        duration: {years: 2},
        label: 'Past 2 Years',
      };
    }
  }

  duration = normalizeDurationToAppropriateUnit(duration);

  if (duration.years !== undefined) {
    if (duration.years !== 1) return undefined;
    return {
      shortcut: '1y',
      duration: {years: 1},
      label: 'Past 1 Year',
    };
  }

  if (duration.months !== undefined) {
    const months = duration.months;
    if (months > 17) {
      return {
        shortcut: '2y',
        duration: {years: 2},
        label: 'Past 2 Years',
      };
    }
    return {
      shortcut: `${months}mo`,
      duration: {months},
      label: `Past ${months} ${months === 1 ? 'Month' : 'Months'}`,
    };
  }

  if (duration.weeks !== undefined) {
    const weeks = duration.weeks;
    if (weeks > 104) return undefined;
    if (weeks > 78) {
      return {
        shortcut: '2y',
        duration: {years: 2},
        label: 'Past 2 Years',
      };
    }
    if (weeks >= 52) {
      return {
        shortcut: '1y',
        duration: {years: 1},
        label: 'Past 1 Year',
      };
    }
    if (weeks > 17) {
      const months = Math.round(weeks / 4.33);
      return {
        shortcut: `${months}mo`,
        duration: {months},
        label: `Past ${months} ${months === 1 ? 'Month' : 'Months'}`,
      };
    }
    return {
      shortcut: `${weeks}w`,
      duration: {weeks},
      label: `Past ${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`,
    };
  }

  if (duration.days !== undefined) {
    const days = duration.days;
    if (days >= 30 && days <= 31) {
      return {
        shortcut: '1mo',
        duration: {months: 1},
        label: 'Past 1 Month',
      };
    }
    if (days > 31) return undefined;
    return {
      shortcut: `${days}d`,
      duration: {days},
      label: `Past ${days} ${days === 1 ? 'Day' : 'Days'}`,
    };
  }

  if (duration.hours !== undefined) {
    const hours = duration.hours;
    return {
      shortcut: `${hours}h`,
      duration: {hours},
      label: `Past ${hours} ${hours === 1 ? 'Hour' : 'Hours'}`,
    };
  }

  if (duration.minutes !== undefined) {
    const minutes = duration.minutes;
    return {
      shortcut: `${minutes}m`,
      duration: {minutes},
      label: `Past ${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`,
    };
  }

  return undefined;
}

export function detectShortcutFromCalendarInterval(
  interval: NormalizedInterval,
): CalendarShortcutResult | undefined {
  if (isRelativeToNow(interval)) {
    return undefined;
  }

  const formatOptions = {forceShowTime: true};

  const matchingOption = findOptionByInterval(interval);
  if (matchingOption?.shortcut) {
    return {
      shortcut: matchingOption.shortcut,
      label: formatDateTimeRange(interval, formatOptions),
      value: matchingOption.value,
    };
  }

  const days = Math.abs(differenceInDays(interval.end, interval.start));
  const months = Math.abs(differenceInMonths(interval.end, interval.start));
  const years = Math.abs(differenceInYears(interval.end, interval.start));

  let shortcut: string | undefined;

  if (years > 0) {
    if (years > 1) {
      return {
        shortcut: undefined,
        label: formatDateTimeRange(interval, formatOptions),
        value: undefined,
      };
    }
    shortcut = '1y';
  } else if (months > 0) {
    shortcut = `${months}mo`;
  } else if (days > 0) {
    if (days > 30) {
      shortcut = '1mo';
    } else {
      shortcut = `${days}d`;
    }
  } else {
    return {
      shortcut: undefined,
      label: formatDateTimeRange(interval, formatOptions),
      value: undefined,
    };
  }

  return {
    shortcut,
    label: formatDateTimeRange(interval, formatOptions),
    value: undefined,
  };
}
