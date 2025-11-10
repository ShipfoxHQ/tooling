import {useMemo} from 'react';
import {useTheme} from './useTheme';

export function useResolvedTheme(): 'light' | 'dark' {
  const {theme} = useTheme();

  return useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);
}
