import {useCallback, useEffect, useState} from 'react';

const STORAGE_KEY = 'queryBuilder_recentDurations';

const DURATION_VALUE_REGEX = /^[<>=]{1,2}\d+(?:s|sec|m|min|h|hr|d)?$/i;
const SANITIZE_NON_ASCII_REGEX = /[^\x20-\x7E]/g;

export function useRecentDurations() {
  const [recentDurations, setRecentDurations] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as string[];
          const cleaned = parsed
            .map((v) => {
              if (v.startsWith('__preset__')) {
                v = v.replace('__preset__', '').split('__')[1] || '';
              }
              const sanitized = v.replace(SANITIZE_NON_ASCII_REGEX, '').trim();
              if (DURATION_VALUE_REGEX.test(sanitized)) {
                return sanitized;
              }
              return '';
            })
            .filter(Boolean);
          if (JSON.stringify(cleaned) !== saved) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          }
          return cleaned;
        } catch {
          return [];
        }
      }
      return [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentDurations));
    }
  }, [recentDurations]);

  const addToRecentDurations = useCallback((value: string) => {
    const sanitized = value.replace(SANITIZE_NON_ASCII_REGEX, '').trim();
    if (!sanitized || !DURATION_VALUE_REGEX.test(sanitized)) {
      return;
    }
    setRecentDurations((prev) => {
      const filtered = prev.filter((v) => v !== sanitized);
      return [sanitized, ...filtered].slice(0, 5);
    });
  }, []);

  return {recentDurations, addToRecentDurations};
}
